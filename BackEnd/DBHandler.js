const { response } = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const myDataBase = require('./conectionDB');

async function crearUsuario(usuario) {
    let existe = await myDataBase.query('SELECT nombre FROM usuarios WHERE nombre = ?', {
      replacements: [usuario.nombre],
      type: QueryTypes.SELECT
    });
    if (existe.length == 0 && usuario.contrasenia === usuario.repcontrasenia){
      existe = await myDataBase.query('SELECT email FROM usuarios WHERE email = ?', {
        replacements: [usuario.email],
        type: QueryTypes.SELECT
      });
      if (existe.length == 0){
        await myDataBase.query('INSERT INTO usuarios (usuario, nombre, apellido, email, perfil, admin, contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?)', {
          replacements: [usuario.usuario, usuario.nombre, usuario.apellido, usuario.email, usuario.perfil, usuario.admin, usuario.contrasenia],
        });
        return {message: 'Usuario registrado exitosamente.'};
      }
    }
    return status(404);
  }
    
  async function loginUsuario(usuario, contrasenia) {
      let resultado = await myDataBase.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?', {
          replacements: [usuario, contrasenia],
          type: QueryTypes.SELECT
      });
      console.log(resultado[0]);
      console.log(resultado.length);
      if (resultado.length == 0)
        return status(401);
      else{
        console.log("estoy entrando bien");
        return resultado[0];
      }
  }

  async function isAdmin(usuario){
    console.log("pero estoy entrando aca???");
    console.log(usuario);
    console.log(usuario.usuario);
    let resultado = await myDataBase.query('SELECT admin FROM usuarios WHERE usuario = ?', {
      replacements: [usuario.usuario],
      type: QueryTypes.SELECT
    })
    console.log("El admin es: " + resultado);
    return resultado;
    // if (resultado == 0)
    //   return false;
    // else return true;
  }
  
  async function getUsuario(id){
    // return await myDataBase.query('SELECT * FROM usuarios WHERE id = ?', {
    //   replacements: [id],
    //   type: QueryTypes.SELECT
    // });
    let a = await myDataBase.query('SELECT * FROM usuarios WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT
    });
    console.log("el id y el a de getUsuario: ");
    console.log(id);
    console.log(a);
    return a;
  }

  async function getUsuarios(){
    let datos = await myDataBase.query('SELECT * FROM usuarios', {
      replacements: QueryTypes.SELECT
    });
    return datos[0];
  }

  async function getId(usuario){
    let id = await myDataBase.query('SELECT id FROM usuarios WHERE usuario = ?', {
      replacements: [usuario],
      type: QueryTypes.SELECT
    });
    console.log("el id en el endpoint duro de la BD");
    console.log(id);
    console.log(id[0]);
    console.log(id[0].id);
    return id[0].id;
  }

  async function updateUsuarios(usuario, id){
    console.log("el usuario : ");
    console.log(usuario.usuario);
    console.log("el id: ");
    console.log(id);
      await myDataBase.query('UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, perfil = ?, admin = ?, contrasenia = ? WHERE id = ?', {
      replacements: [usuario.nombre, usuario.apellido, usuario.email, usuario.perfil, usuario.admin, usuario.contrasenia, id],
      type: QueryTypes.UPDATE
    })
  }

  async function deleteUsuarios(id){
    await myDataBase.query('DELETE FROM usuarios WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.DELETE
    })
  }
  
  async function setPassword(usuario){
    let existe = await myDataBase.query('SELECT * FROM usuarios WHERE user = ?', {
      replacements: [usuario.user],
      type: QueryTypes.SELECT
    });
    if (existe.length == 0)
      return status(404);
    await myDataBase.query('UPDATE usuarios SET password = ? WHERE user = ?', {
      replacements: [usuario.password, usuario.user],
      type: QueryTypes.UPDATE
    });
  
    return { message: "Contraseña actualizada."}
  }
  

  async function getRegiones(){
    return await myDataBase.query('SELECT * FROM paises GROUP BY region', {
      type: QueryTypes.SELECT
    })
    // falta el grup by para que me tome solo las regiones
  }

  async function addRegion(region){
      return await myDataBase.query('INSERT INTO paises (region, nombre) VALUES (?, ?)', {
        replacements: [region.nombre, null],
        type: QueryTypes.INSERT
      })
      //INSERT INTO usuarios (usuario, nombre, apellido, email, perfil, admin, contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?)'
  }

  async function getPaises(region){
    return await myDataBase.query('SELECT * FROM paises WHERE region = ?', {
      replacements: [region],
      type: QueryTypes.SELECT
    })
  }

  async function addPais(pais){
    console.log(pais);
    console.log(pais.region);
    console.log(pais.pais);
    console.log(pais.region.nombre);
    console.log(pais.pais.nombre);

    return await myDataBase.query('INSERT INTO paises (region, nombre) VALUES (?, ?)', {
      replacements: [pais.region.nombre, pais.pais.nombre],
      type: QueryTypes.INSERT
    })
  }

  async function actualizarPais(pais){
    console.log("*******************************************************************************************************************************************************");
    console.log("pais de la BD");
    console.log(pais);
    console.log("*******************************************************************************************************************************************************");
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE region = ? AND nombre = ?', {
      replacements: [pais.region.nombre, pais.pais.nombre_anterior],
      type: QueryTypes.SELECT
    });

    console.log("que carajo es el pais??");
    console.log(pais.pais.nombre);
    console.log("que carajo es el region??");
    console.log(pais.region.nombre);
    console.log("que carajo es el id??");
    console.log(idPais[0].id);
    console.log("ACTUALIZANDO CIUDAD MEEEEN");
    console.log(idPais[0].id);

    console.log("me esta llamando a este metodo??");
    console.log(pais.pais.nombre);
    return await myDataBase.query('UPDATE paises SET nombre = ? WHERE id = ?', {
      replacements: [pais.pais.nombre, idPais[0].id],
      type: QueryTypes.UPDATE
    })
  }

  async function borrarPais(pais){
    console.log("quien poronga soy : pais ");
    console.log(pais);
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE nombre = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

    console.log("el idPais: ");
    console.log(idPais);

    await myDataBase.query('DELETE FROM ciudades WHERE id_pais = ?', {
      replacements: [idPais[0].id],
      type: QueryTypes.DELETE
    });

    return await myDataBase.query('DELETE FROM paises WHERE nombre = ?', {
      replacements: [pais],
      type: QueryTypes.DELETE
    });
  }

  async function getCiudades(pais){
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE nombre = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

    let resultado = await myDataBase.query('SELECT * FROM ciudades WHERE id_pais = ?', {
      replacements: [idPais[0].id],
      type: QueryTypes.SELECT
    })
    console.log(resultado);
    if (resultado.length !== 0)
      return resultado;
    else return;

  }

  async function addCiudad(ciudad, region, pais){
    // consulto por region y pais para los casos en que hayan paises con el mismo nombre (dudo que pase)
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE region = ? AND nombre = ?', {
      replacements: [region.nombre, pais.nombre],
      type: QueryTypes.SELECT
    });
    
    return await myDataBase.query('INSERT INTO ciudades (nombre, id_pais) VALUES (?, ?)', {
      replacements: [ciudad.nombre, idPais[0].id],
      type: QueryTypes.INSERT
    })
  }

  async function borrarCiudad(ciudad){
    return await myDataBase.query('DELETE FROM ciudades WHERE nombre = ?', {
      replacements: [ciudad],
      type: QueryTypes.DELETE
    })
  }

  async function actualizarCiudad(ciudad){
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE nombre = ?', {
      replacements: [ciudad.pais.nombre],
      type: QueryTypes.SELECT
    });
    console.log("ACTUALIZANDO CIUDAD MEEEEN");
    console.log(idPais[0].id);

    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ? AND id_pais = ?', {
      replacements: [ciudad.ciudad_ant.nombre_anterior, idPais[0].id],
      type: QueryTypes.SELECT
    })

    console.log(idCiudad[0].id);

    return await myDataBase.query('UPDATE ciudades SET nombre = ? WHERE  id = ?', {
      replacements: [ciudad.ciudad_ant.nombre, idCiudad[0].id],
      type: QueryTypes.UPDATE
    })
  }

  async function getCompanias(){
    console.log("aca si quiera?");
    let companias = await myDataBase.query('SELECT * FROM companias', {
      type: QueryTypes.SELECT
    });

    let ciudades = new Array;
    for (let i = 0 ; i < companias.length ; i++)
      ciudades.push(await myDataBase.query('SELECT nombre FROM ciudades WHERE id = ?',{
          replacements: [companias[i].id_ciudad],
          type: QueryTypes.SELECT
        })
      );

    let retorno = { ciudades, companias };
    console.log("pero que concha tiene esto: retorno");
    console.log(retorno);
    console.log(retorno.ciudades[0][0]);
    console.log(retorno.ciudades[1][0]);
  
    return {ciudades, companias};
  }

  async function addCompania(compania){
    let existeCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });
    console.log("tamaño de la ciudad= " + existeCiudad.length);
    if (existeCiudad.length != 0){
        return await myDataBase.query('INSERT INTO companias (nombre, direccion, email, telefono, id_ciudad) VALUES (?, ?, ?, ?, ?)',{
          replacements: [compania.nombre, compania.direccion, compania.email, compania.telefono, existeCiudad[0].id],
          type: QueryTypes.INSERT
        })
    }
    else {
      console.log("por ende deberia estar entrando por aca....");
      return status(404);
    }
  }

  async function actualizarCompania(compania){
    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad_ant],
      type: QueryTypes.SELECT
    });

    idCompania = await myDataBase.query('SELECT id FROM companias WHERE nombre = ? AND direccion = ? AND id_ciudad = ?', {
      replacements: [compania.nombre_ant, compania.direccion_ant, idCiudad[0].id],
      type: QueryTypes.SELECT
    });

    console.log(idCompania[0].id);

    // vuelvo a tomar el id para los casos en donde haya editado la ciudad, 
    // el id de la ciudad deberia cambiar para levantarla correctamente
    idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });

    return await myDataBase.query('UPDATE companias SET nombre=?, direccion=?, email=?, telefono=?, id_ciudad=? WHERE  id = ?', {
      replacements: [compania.nombre, compania.direccion, compania.email, compania.telefono, idCiudad[0].id, idCompania[0].id],
      type: QueryTypes.UPDATE
    });
  }

  async function borrarCompania(compania){
    console.log("me estas imprimiendo esto?");
    console.log(compania.nombre);
    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });

    return await myDataBase.query('DELETE FROM companias WHERE nombre = ? AND direccion = ? AND id_ciudad = ?', {
      replacements: [compania.nombre, compania.direccion, idCiudad[0].id],
      type: QueryTypes.DELETE
    });
  }

  async function borrarCompaniaPais(nombreCiudad){
    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [nombreCiudad],
      type: QueryTypes.SELECT
    });

    let resultado = await myDataBase.query('DELETE FROM companias WHERE id_ciudad = ?', {
      replacements: [idCiudad[0].id],
      type: QueryTypes.DELETE
    });

    await borrarCiudad(nombreCiudad);

    return resultado;
  }

  
  async function borrarCompaniaRegion(pais){
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE nombre = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE id_pais = ?', {
      replacements: [idPais[0].id],
      type: QueryTypes.SELECT
    });

    let nombreCiudad = await myDataBase.query('SELECT nombre FROM ciudades WHERE id = ?',{
      replacements: [idCiudad[0].id],
      type: QueryTypes.SELECT
    })

    let resultado = await myDataBase.query('DELETE FROM companias WHERE id_ciudad = ?', {
      replacements: [idCiudad[0].id],
      type: QueryTypes.DELETE
    });

    await borrarCiudad(nombreCiudad[0].nombre);

    return resultado;
  }

  async function getContactos(){
    let resultado = await myDataBase.query('SELECT * FROM contactos', {
      type: QueryTypes.SELECT
    });

    if (resultado.length != 0)
      return resultado;
    return;
  }

  async function getRegion(id_ciudad){
    let id_pais = await myDataBase.query('SELECT id_pais FROM ciudades WHERE id = ?', {
      replacements: [id_ciudad],
      type: QueryTypes.SELECT
    });

    return await myDataBase.query('SELECT region FROM paises WHERE id = ?', {
      replacements: [id_pais[0].id_pais],
      type: QueryTypes.SELECT
    });
  }

  async function getPais(id_ciudad){
    console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
    console.log("id ciudad antes de la query: " + id_ciudad);
    let id_pais = await myDataBase.query('SELECT id_pais FROM ciudades WHERE id = ?', {
      replacements: [id_ciudad],
      type: QueryTypes.SELECT
    });
    console.log("el id pais en get pais: ");
    console.log(id_pais[0].id_pais);
    console.log("id ciudad es: " + id_ciudad);

    return await myDataBase.query('SELECT nombre FROM paises WHERE id = ?', {
      replacements: [id_pais[0].id_pais],
      type: QueryTypes.SELECT
    });
  }



  
  module.exports = {  crearUsuario, loginUsuario, isAdmin, getUsuario, getUsuarios, getId, updateUsuarios, 
                      deleteUsuarios, setPassword, getRegiones, addRegion, getPaises, addPais, borrarPais, 
                      actualizarPais, getCiudades, addCiudad, borrarCiudad, actualizarCiudad, getCompanias,
                      addCompania, actualizarCompania, borrarCompania, borrarCompaniaPais, borrarCompaniaRegion, 
                      getContactos, getRegion, getPais, 
                    };













  async function crearPlato(plato){
    await myDataBase.query('INSERT INTO platos (nombre_plato, precio, descripcion) VALUES (?, ?, ?)', {
      replacements: [plato.nombrePlato, plato.precio, plato.descripcion],
    });
    return { message: 'Plato creado'};
  }
  
  async function actualizarPrecio(idPLato){
    let plato = await myDataBase.query('SELECT * FROM platos WHERE id = ?', {
      replacements: [idPLato.id],
      type: QueryTypes.SELECT
    });
    await myDataBase.query('UPDATE platos SET precio = ? WHERE id = ?', {
      replacements: [idPLato.precio, plato[0].id],
      type: QueryTypes.UPDATE
    });
    return { message: "Precio actualizado correctamente."};
  }
  
  async function getPlatos(){
    let r = await myDataBase.query('SELECT nombre_plato, descripcion, precio FROM platos', {
      replacements: QueryTypes.SELECT
    });
    return r[0];
  }
  
  async function borrarPlato(idPLato){
    let existe = await myDataBase.query('SELECT * FROM platos WHERE id = ?', {
      replacements: [idPLato],
      type: QueryTypes.SELECT
    });
    if (existe.length == 0)
      return status(404);
    await myDataBase.query('DELETE FROM platos WHERE id = ?', {
      replacements: [idPLato],
      type: QueryTypes.DELETE
    });
  
    return { message: "Plato eliminado correctamente."};
  }
  
  async function crearPedido(pedido) {
    await myDataBase.query('INSERT INTO pedidos (id_usuario, estado) VALUES (?, ?)', {
      replacements: [pedido.idUsuario, pedido.estado],
    });
    let i = 0;
    let id = await myDataBase.query('SELECT id FROM pedidos ORDER BY id DESC LIMIT 0,1', {
      replacements: QueryTypes.SELECT
    });
    while (i < pedido.platos.length){
      await rellenarFormaParte(id[0][0].id, pedido.platos[i]);
      i++;
    }
    return { message: "Pedido realizado correctamente." };
  }
  
  async function rellenarFormaParte(id, plato){
    await myDataBase.query('INSERT INTO forma_parte (id_pedido, id_plato) VALUES (?, ?)', {
      replacements: [id, plato],
    });
    return { message: "Plato agregado exitosamente: " + plato};
  }
  
  async function actualizar_estado(pedido){
    let existe = await myDataBase.query('SELECT * FROM pedidos WHERE id = ?', {
      replacements: [pedido.id],
      type: QueryTypes.SELECT
    })
    if (existe.length == 0)
      return status(404);
    await myDataBase.query('UPDATE pedidos SET estado = ? WHERE id = ?', {
      replacements: [pedido.estado, pedido.id],
      type: QueryTypes.UPDATE
    });
  
    return { message: "Estado actualizado."};
  }
  
  async function getPedido(numeroPedido){
    let platos = await myDataBase.query('SELECT id_plato FROM forma_parte WHERE id_pedido = ?', {
      replacements: [numeroPedido],
      type: QueryTypes.SELECT
    });
  
    let resultado = [];
    for (let i = 0; i < platos.length; i++){
      resultado[i] = await myDataBase.query('SELECT nombre_plato FROM platos WHERE id = ?', {
        replacements: [platos[i].id_plato],
        type: QueryTypes.SELECT
      });
    }
  
    let respuesta = " ";
    resultado.forEach(plato => respuesta += plato[0].nombre_plato + ", ");
    if (respuesta == " ")
      return status(404);
    return { message: respuesta }
  }
  
  async function borrarPedido(idPedido){
    let existe = await myDataBase.query('SELECT * FROM pedidos WHERE id = ?', {
      replacements: [idPedido],
      type: QueryTypes.SELECT
    });
    console.log(existe);
    console.log(existe.length);
    if (existe.length == 0)
      return status(404);
    
    await eliminarFormaParte(idPedido);
    await myDataBase.query('DELETE FROM pedidos WHERE id = ?', {
      replacements: [idPedido],
      type: QueryTypes.DELETE
    });
  
  
    return { message: "Pedido eliminado correctamente."}
  }
  
  async function eliminarFormaParte(idPedido){
    let eliminar = [];
    eliminar = await myDataBase.query('SELECT * FROM forma_parte WHERE id_pedido = ?', {
      replacements: [idPedido],
      type: QueryTypes.SELECT
    });
    console.log(eliminar);
    eliminar.forEach(async pedido => await myDataBase.query('DELETE FROM forma_parte WHERE id_pedido = ?', { 
      replacements: [pedido.id_pedido],
      type: QueryTypes.DELETE},));
  }
  