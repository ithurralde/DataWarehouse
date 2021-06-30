let express = require('express');
let server = express();
const transactionHandler = require('./DBHandler.js');
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


server.use('/datawarehouse', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


server.use(express.json());

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
      const token = request.headers.authorization.split(' ')[1];
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

