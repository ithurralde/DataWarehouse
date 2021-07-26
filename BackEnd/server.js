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

server.get('/usuarios', autenticarUsuario, (request, response) => {
  transactionHandler.getUsuarios()
  .then( respuesta => {
    response.status(200).send(respuesta);
  })
  .catch(respuesta => 
    response.status(400).send({message: "No se pudo conectar con la base de datos."}))
});

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
  .catch(error => response.status(404).send({message: "Te la creiste weyyy JAJAJAAJAJA"}));
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

server.get('/regiones', /*autenticarUsuario,*/ (request, response) => {
  transactionHandler.getRegiones()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos."}));
})

server.get('/paises',/* autenticarUsuario,*/ (request, response) => {
  transactionHandler.getRegiones()
  .then(respuesta => response.status(200).send(respuesta))
  .catch(error => response.status(400).send({message: "No se pudo conectar con la base de datos."}));
})