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
      response.status(500).send('Error');
    } else {
      next();
    }
  });

const autenticarUsuario = (request, response, next) => {
  try {
      // console.log(request.headers);
      // console.log(request.headers.authorization);
      // token = request.headers.authorization.split(' ')[1];
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
  console.log(usuario.user);
  console.log(usuario.contrasenia);
  console.log(usuario.id);
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
  console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(usuario);
  transactionHandler.crearUsuario(usuario)
  .then(respuesta =>
    response.status(201).send(respuesta)
  )
  .catch(respuesta => 
    response.status(400).send({ message: "No se pudo crear el usuario."})
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
  console.log(user);
  let id;
  await transactionHandler.getId(user.usuario)
  .then(respuesta => id = respuesta)
  .catch(error => response.status(404).send({ message: "Error al obtener el id del usuario: " + error}));
  
  console.log("el id antes de updatear: ");
  console.log(id);

  await transactionHandler.updateUsuarios(user, id)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.send(error));
  
})

server.delete('/usuarios', isAdmin, autenticarUsuario, async (request, response) => {
  let userParam = request.query.user;
  console.log("********************************************************************************************************");
  console.log(userParam);
  console.log("********************************************************************************************************");
  let id;
  await transactionHandler.getId(userParam)
  .then(respuesta => id = respuesta)
  .catch(error => response.status(404).send({ message: "Error al obtener el id del usuario: " + error}));

  console.log("********************************************************************************************************");
  console.log(id);
  console.log("********************************************************************************************************");

  
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
  console.log("el supuesto usuario: " + usuario);
  console.log(usuario);
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
  console.log("voy a entrar aca (el posta)");
  console.log(idParam);
  transactionHandler.getUsuario(idParam)
  .then( respuesta => {
    response.status(200).send(respuesta);
  })
  .catch(respuesta => 
    response.status(400).send({message: "No se pudo conectar con la base de datos."}))
})

server.get('/regiones', autenticarUsuario, (request, response) => {
  console.log("El token: ");
  console.log(token);
  transactionHandler.getRegiones()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos."}));
})

server.post('/regiones', autenticarUsuario, (request, response) => {
  let region = request.body;
  console.log(region);
  console.log(region.nombre);
  transactionHandler.addRegion(region)
  .then( respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send( { message: "Error al agregar region: " + error} ));
})

server.get('/paises', autenticarUsuario, (request, response) => {
  console.log("El token: ");
  console.log(token);
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
  console.log("[server.paises] pais: ");
  console.log(pais);
  transactionHandler.addPais(pais)
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos " + error + "."}));
})

server.delete('/paises', autenticarUsuario, (request, response) => {
  let paisToDelete = request.query.pais;
  console.log("[Server.Delete.Paises] pais a borrar : ");
  console.log(paisToDelete);
  transactionHandler.borrarPais(paisToDelete)
  .then( respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send(error));
})

server.get('/ciudad', autenticarUsuario, (request, response) => {
  let paisParam = request.query.pais;
  console.log("ciudad param: ");
  console.log(paisParam);
  transactionHandler.getCiudades(paisParam)
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
  console.log("[Server.Delete.Paises] pais a borrar : ");
  console.log(ciudadToDelete);
  transactionHandler.borrarCiudad(ciudadToDelete)
  .then( respuesta => response.status(200).send(respuesta))
  .catch( error => response.status(404).send(error));
})