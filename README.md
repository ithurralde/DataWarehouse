# DataWarehouse



_Instalaciones que se hicieron en el proyecto:_
## instalar npm para gestion de proyectos y node para correr el servidor
_https://www.npmjs.com/get-npm_

## instalar xampp, correr apache y MySql para que funcione correctamente la base de datos en phpmyadmin
_https://www.apachefriends.org/es/download.html_

# IMPORTANTE
_El proyecto contiene dos carpetas: Back-end y Front-end. Por ende, se necesitan abrir dos consolas para cada una de estas carpetas; ya que ambas necesitan ejecutar distintos scripts desarrollados para que funcione toda la aplicación DataWarehouse de manera correcta._
# Instalar bibliotecas
_El proyecto se envió sin las bibliotecas necesarias para poder ejecutar tanto el back-end como el front-end, por lo que es necesario ingresar a cada carpeta correspondiente:_
_En una consola dentro de visual studio code escribir: "cd BackEnd", y luego escribir "npm i" para que automáticamente se instalen las bibliotecas utilizadas. (No cerrar la consola, dejarla abierta con la carpeta de back end ya que luego se utilizará para inicializar el server)._

_De igual forma, se necesita ingresar a la carpeta de front-end, por lo tanto se debe escribir en una nueva consola: "cd FrontEnd",  y luego escribir "npm i" para que automáticamente se instalen las bibliotecas utilizadas. (No cerrar la consola, dejarla abierta con la carpeta de front end ya que luego se utilizará para inicializar el server de Angular)._


# Back-End:

## Configuracion de la Base de Datos
### nombre de la base de datos: datawarehouse
_nombre que se le dio a la base de datos para el proyecto_

### Configuracion en xampp
_abrir xampp como administrador y ejecutar Apache y MySQL (hacer click en la accion "Admin" de MySQL desde xampp para abrir http://localhost/phpmyadmin/)_

### Una vez abierto phpmyadmin:
_crear una nueva base de datos con el nombre "datawarehouse" (sin comillas) e importar el archivo datawarehouse.sql (que se encuentra en la carpeta del proyecto)_

### Se utilizaron las siguientes bibliotecas
_En la consola bash de visual studio code se inicializo npm init --yes, y se instalaron los siguientes paquetes:_
* npm i express
* npm i express-jwt
* npm i sequelize
* npm i mysql2
* npm i jsonwebtoken
* npm i cors

### Comando para ejecutar el servidor
_En la consola que teniamos para el back-end (dentro de visual studio code), cuando instalamos las bibliotecas, escribir: "node .\server.js" (sin comillas) para correr el servidor._
_Recuerde que para ejecutar el servidor es necesario estar ubicado (dentro de la consola) en la carpeta de Back End._


# Front-End:
_En esta parte, como se utilizó el framework de Angular para realizar el proyecto, solo es necesario ingresar el siguiente comando:_
_"ng serve -o", para que inicie el servidor desde angular y automáticamente abra su navegador por defecto con la URL del proyecto base._
_Recuerde que para ejecutar el servidor de Angular es necesario estar ubicado (dentro de la consola) en la carpeta de Front End._
