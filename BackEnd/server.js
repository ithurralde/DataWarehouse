let express = require('express');
let server = express();
const transactionHandler = require('./DBHandler.js');
// cors lo necesito para tener permisos y poder conectar el front con el back
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwtClave = "Cl4V3_J0t4D0bl3VT3$";
let token;

const expressJWT = require('express-jwt');
// const { request, response } = require('express');

server.listen(3000, function () {
    console.log('Servidor conectado en el puerto 3000');
});



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { response, request } = require('express');
const { conf_password } = require('./configuracionDB.js');
const myDataBase = require('./conectionDB.js');


server.use('/datawarehouse', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


server.use(express.json());

server.use(cors());

//middleware global
server.use((error, request, response, next) => {
    if (error) {
      response.status(500).send('Error global: ', error);
    } else {
      next();
    }
  });

const autenticarUsuario = (request, response, next) => {
  try {
      token = request.headers.authorization;
      console.log(token);
      const verificarToken = jwt.verify(token, jwtClave);
      console.log("verificarToken:");
      console.log(verificarToken);
      if (verificarToken) {
        request.usuario = verificarToken;
        console.log(request.usuario);
        return next();
      }
  } catch (error){
      //response.json({ error: "Error al validar usuario." }); 
      return response.status(403).send({ message: "Error al validar usuario." });
  }
}

async function isAdmin(request, response, next){
  let user = jwt.verify(token, jwtClave);
  let admin;
  await transactionHandler.isAdmin(user)
  .then(respuesta => admin = respuesta[0].admin)
  .catch(error => response.status(404).send( {message: "Error en la verificacion de usuario administrador: " + error}));
  if (!admin){
    let message = { message: "Tiene que ingresar como administrador para realizar la accion solicitada." }
    return response.status(403).send(message);
  }
  return next();
}

server.post('/login', (request, response) => {
  let usuario = request.body;
  transactionHandler.loginUsuario(usuario.user, usuario.contrasenia)
  .then(respuesta => { 
    // el objeto {expiresIn: 15} hace que el token expira en 15 segundos.
    // token = jwt.sign({usuario: usuario.user/*, id: usuario.id*/}, jwtClave, {expiresIn: 2});
    response.status(200).send(respuesta); })
  .catch(respuesta => {response.status(401).send({ message: "Usuario o contraseña invalidos."})});
});

server.post('/token', (request, response) => {
  let unDia = 60*60*24;
  token = jwt.sign({usuario: request.body.user/*, id: usuario.id*/}, jwtClave, {expiresIn: unDia});
  const p1 = Promise.resolve({"token": token});
  p1
    .then(respuesta => {
      console.log(respuesta);
      response.status(200).send(respuesta)})
    .catch(error => response.status(404).send({message: "Error para verificar el token: " + error}));
});

server.post('/', (request, response) => {
  let usuario = request.body;
  transactionHandler.loginUsuario(usuario.user, usuario.contrasenia)
  .then(respuesta => { 
    // el objeto {expiresIn: 15} hace que el token expira en 15 segundos.
    // token = jwt.sign({usuario: usuario.user/*, id: usuario.id*/}, jwtClave, {expiresIn: 2});
    response.status(200).send(respuesta); })
  .catch(respuesta => {response.status(401).send({ message: "Usuario o contraseña invalidos."})});
});

server.post('/usuarios/crear', autenticarUsuario, (request, response) => {
  let usuario = request.body;
  transactionHandler.crearUsuario(usuario)
  .then(respuesta =>
    response.status(201).send(respuesta)
  )
  .catch(respuesta => 
    response.status(400).send({ message: "Ya existe un usuario con ese nombre de cuenta o mail asignado."})
  );
});

server.get('/usuarios', isAdmin, autenticarUsuario, (request, response) => {
  transactionHandler.getUsuarios()
  .then( respuesta => {
    response.status(200).send(respuesta);
  })
  .catch(respuesta => 
    response.status(400).send({message: "No se pudo conectar con la base de datos."}))
});

server.put('/usuarios', isAdmin, autenticarUsuario, async (request, response) => {
  let user = request.body;
  let id;
  await transactionHandler.getId(user.usuario)
  .then(respuesta => id = respuesta)
  .catch(error => response.status(404).send({ message: "Error al obtener el id del usuario: " + error}));

  await transactionHandler.updateUsuarios(user, id)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.send(error));
  
})

server.delete('/usuarios', isAdmin, autenticarUsuario, async (request, response) => {
  let userParam = request.query.user;
  let id;
  await transactionHandler.getId(userParam)
  .then(respuesta => id = respuesta)
  .catch(error => response.status(404).send({ message: "Error al obtener el id del usuario: " + error}));
  
  await transactionHandler.deleteUsuarios(id)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.send(error));
})

// obtengo el nombre del usuario para el front (para crear usuarios desde el front)
server.get('/usuario', (request, response) => {
  request.usuario = jwt.verify(token, jwtClave)
  const p1 = Promise.resolve(request.usuario);
  p1
  .then(resultado => {response.status(200).send(resultado)})
  .catch(error => { response.status(400).send(error)})
});

// verifica que sea admin (para crear usuarios desde el front)
server.post('/isAdmin', (request, response) => {
  let usuario = request.body;
  transactionHandler.isAdmin(usuario)
  .then(resultado => response.status(200).send(resultado))
  .catch(error => response.status(404).send({message: "Hubo un error: " + error}));
})

// obtengo los usuarios antes de logear
server.get('/usuarios_log', (request, response) => {
  transactionHandler.getUsuarios()
  .then( respuesta => {
    response.status(200).send(respuesta);
  })
  .catch(respuesta => 
    response.status(400).send({message: "No se pudo conectar con la base de datos."}))
})

server.get('/usuarios/:id', (request, response) => {
  let idParam = request.query.id;
  transactionHandler.getUsuario(idParam)
  .then( respuesta => {
    response.status(200).send(respuesta);
  })
  .catch(respuesta => 
    response.status(400).send({message: "No se pudo conectar con la base de datos."}))
})

server.get('/regiones', autenticarUsuario, (request, response) => {
  transactionHandler.getRegiones()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos."}));
})

server.post('/regiones', autenticarUsuario, (request, response) => {
  let region = request.body;
  transactionHandler.addRegion(region)
  .then( respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send( { message: "Error al agregar region: " + error} ));
})

server.get('/paises', autenticarUsuario, (request, response) => {
  let regionParam = request.query.region;
  transactionHandler.getPaises(regionParam)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos: " + error + "."}));
})

server.put('/paises', autenticarUsuario, (request, response) => {
  let nombre = request.body;
  transactionHandler.actualizarPais(nombre)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos: " + error + "."}));
})

server.post('/paises', autenticarUsuario, (request, response) => {
  let pais = request.body;
  transactionHandler.addPais(pais)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos " + error + "."}));
})

server.delete('/paises', autenticarUsuario, (request, response) => {
  let paisToDelete = request.query.pais;
  transactionHandler.borrarPais(paisToDelete)
  .then( respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send(error));
})

server.get('/ciudad', autenticarUsuario, (request, response) => {
  let paisParam = request.query.pais;
  transactionHandler.getCiudades(paisParam)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos: " + error + "."}));
})

server.get('/ciudades', autenticarUsuario, (request, response) => {
  transactionHandler.getTodasCiudades()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos: " + error + "."}));
})

server.get('/id_ciudad', autenticarUsuario, (request, response) => {
  let ciudad= request.query.get_ciudad;
  transactionHandler.getIdCiudad(ciudad)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos: " + error + "."}));
})

server.post('/ciudad', autenticarUsuario, (request, response) => {
  let ciudad = request.body;
  transactionHandler.addCiudad(ciudad.ciudad, ciudad.region, ciudad.pais)
  .then(respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send( { message: "Error en el server: " + error}));
})

server.put('/ciudad', autenticarUsuario, (request, response) => {
  let nombre = request.body;
  transactionHandler.actualizarCiudad(nombre)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos: " + error + "."}));
})

server.delete('/ciudad', autenticarUsuario, (request, response) => {
  let ciudadToDelete = request.query.ciudad;
  transactionHandler.borrarCiudad(ciudadToDelete)
  .then( respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send(error));
})

server.get('/companias', autenticarUsuario, (request, response) => {
  transactionHandler.getCompanias()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send(error));
})

server.post('/companias', autenticarUsuario, (request, response) => {
  let compania = request.body;
  transactionHandler.addCompania(compania)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "No existe la ciudad. " + error}));
})

server.put('/companias', autenticarUsuario, (request, response) => {
  let compania = request.body;
  transactionHandler.actualizarCompania(compania)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "No existe la ciudad. " + error}));
})

server.delete('/companias', autenticarUsuario, (request, response) => {
  let compania = request.query.compania;
  compania = JSON.parse(compania);
  transactionHandler.borrarCompania(compania)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "No se pudo borrar la compania. " + error}));
})

server.delete('/companiasPais', autenticarUsuario, (request, response) => {
  let nombre = request.query.ciudad;
  transactionHandler.borrarCompaniaPais(nombre)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "Hubo un error al intentar borrar la compañia. " + error}));
})

server.delete('/companiasRegion', autenticarUsuario, (request, response) => {
  let pais = request.query.pais;
  transactionHandler.borrarCompaniaRegion(pais)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "Hubo un error al intentar borrar la compañia. " + error}));
})

server.get('/contactos', autenticarUsuario, (request, response) => {
  transactionHandler.getContactos()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "Hubo un error en el server. " + error}));
});

// tipo puede ser: region o pais
server.get('/contactos/:tipo', autenticarUsuario, (request, response) => {
  let tipo = request.params.tipo;
  let id_ciudad = request.query.id_ciudad;
  if (tipo == "region")
    transactionHandler.getRegion(id_ciudad)
    .then(respuesta => response.status(200).send(respuesta))
    .catch(error => response.status(404).send({ message: "Hubo un error en el server. " + error}));
  else if (tipo == "pais")
    transactionHandler.getPais(id_ciudad)
    .then(respuesta => response.status(200).send(respuesta))
    .catch(error => response.status(404).send({ message: "Hubo un error en el server. " + error}));
});

server.get('/contactosCanales', autenticarUsuario, (request, response) => {
  let contacto = request.query.contacto;
  contacto = JSON.parse(contacto);
  transactionHandler.getCanales(contacto)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "Hubo un error en el server. " + error}));
})

server.post('/contactos', autenticarUsuario, (request, response) => {
  let contacto = request.body;
  transactionHandler.addContacto(contacto)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "No existe la ciudad, la compañia o ya existe un contacto con ese mail. " + error}));
});

server.put('/contactos', autenticarUsuario, (request, response) => {
  let contacto = request.body;
  transactionHandler.actualizarContacto(contacto)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "No se pudo actualizar el contacto : %o. Error: ", contacto, error}));
});

server.delete('/contactos', autenticarUsuario, (request, response) => {
  let contacto = request.query.contacto;
  contacto = JSON.parse(contacto);
  transactionHandler.borrarContacto(contacto)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(404).send({ message: "No se pudo eliminar el contaco " + contacto +". Error: " + error}));
});

// tipo puede ser: region/pais/ciudad o compañia
server.delete('/contactos/:tipo', autenticarUsuario, (request, response) => {
  let tipo = request.params.tipo;
  let dato = request.query.dato;
  switch(tipo){
    case 'pais':
      transactionHandler.borrarContactosPais(dato)
      .then(respuesta => response.status(200).send(respuesta))
      .catch(error => response.status(404).send({ message: "No existen contactos para el pais " + dato +". " + error}));
      break;
    case 'ciudad':
      transactionHandler.borrarContactoCiudad(dato)
      .then(respuesta => response.status(200).send(respuesta))
      .catch(error => response.status(404).send({ message: "No existen contactos para la ciudad " + dato +". " + error}));
      break;
    case 'compania':
      transactionHandler.borrarContactoCompania(dato)
      .then(respuesta => response.status(200).send(respuesta))
      .catch(error => response.status(404).send({ message: "No existen contactos para la compañia " + dato +". " + error}));
      break;
    default:
      console.error("No se pudo/pudieron borrar el/los contacto/s con referencia en: " + tipo);
      break;

  }
})