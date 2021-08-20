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
_En una consola de visual studio code escribir: "cd BackEnd" (sin comillas) para acceder a la carpeta de back end._
_Luego escribir: "node .\server.js" (sin comillas) para correr el servidor_
