const config_db = require("./configuracionDB");
const Sequelize = require('sequelize');
// const path = 'mysql://root@localhost:3306/data_warehouse';
// const myDataBase = new Sequelize(path);
const myDataBase = new Sequelize(config_db.conf_db_name, config_db.conf_user, config_db.conf_password, {
    host: config_db.conf_db_host,
    dialect: "mysql",
    port: config_db.conf_port,
    dialectOptions: {
        multipleStatements: true
    }
});

myDataBase
  .authenticate()
  .then(() => {
    console.log('Estamos conectado a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexion con la base de datos', error);
  });

module.exports = myDataBase;
