const { response } = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const myDataBase = require('./conectionDB');

async function crearUsuario(usuario) {
    let existe = await myDataBase.query('SELECT nombre FROM usuarios WHERE usuario = ?', {
      replacements: [usuario.usuario],
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
      if (resultado.length == 0)
        return status(401);
      else{
        return resultado[0];
      }
  }

  async function isAdmin(usuario){
    let resultado = await myDataBase.query('SELECT admin FROM usuarios WHERE usuario = ?', {
      replacements: [usuario.usuario],
      type: QueryTypes.SELECT
    })
    if (resultado.length == 0)
      return status(404);
    return resultado;
  }
  
  async function getUsuario(id){
    let a = await myDataBase.query('SELECT * FROM usuarios WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT
    });
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
    return id[0].id;
  }

  async function updateUsuarios(usuario, id){
    await myDataBase.query('UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, perfil = ?, admin = ?, contrasenia = ? WHERE id = ?', {
      replacements: [usuario.nombre, usuario.apellido, usuario.email, usuario.perfil, usuario.admin, usuario.contrasenia, id],
      type: QueryTypes.UPDATE
    });

    let resultado =  await myDataBase.query('SELECT * FROM usuarios WHERE id = ?', {
      replacements: [id],
      tpye: QueryTypes.SELECT
    });

    return resultado[0][0];
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
    return await myDataBase.query('INSERT INTO paises (region, nombre) VALUES (?, ?)', {
      replacements: [pais.region.nombre, pais.pais.nombre],
      type: QueryTypes.INSERT
    })
  }

  async function actualizarPais(pais){
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE region = ? AND nombre = ?', {
      replacements: [pais.region.nombre, pais.pais.nombre_anterior],
      type: QueryTypes.SELECT
    });

    return await myDataBase.query('UPDATE paises SET nombre = ? WHERE id = ?', {
      replacements: [pais.pais.nombre, idPais[0].id],
      type: QueryTypes.UPDATE
    })
  }

  async function borrarPais(pais){
    let idPais = await myDataBase.query('SELECT id FROM paises WHERE nombre = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

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

    if (resultado.length !== 0)
      return resultado;
    else return;

  }

  async function getTodasCiudades(){
    return await myDataBase.query('SELECT nombre FROM ciudades', {
      type: QueryTypes.SELECT
    });
  }

  async function getIdCiudad(ciudad){
    return await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [ciudad],
      type: QueryTypes.SELECT
    });
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

    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ? AND id_pais = ?', {
      replacements: [ciudad.ciudad_ant.nombre_anterior, idPais[0].id],
      type: QueryTypes.SELECT
    })

    return await myDataBase.query('UPDATE ciudades SET nombre = ? WHERE  id = ?', {
      replacements: [ciudad.ciudad_ant.nombre, idCiudad[0].id],
      type: QueryTypes.UPDATE
    })
  }

  async function getCompanias(){
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
  
    return {ciudades, companias};
  }

  async function addCompania(compania){
    let existeCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });

    if (existeCiudad.length != 0){
        return await myDataBase.query('INSERT INTO companias (nombre, direccion, email, telefono, id_ciudad) VALUES (?, ?, ?, ?, ?)',{
          replacements: [compania.nombre, compania.direccion, compania.email, compania.telefono, existeCiudad[0].id],
          type: QueryTypes.INSERT
        })
    }
    else {
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

    // vuelvo a tomar el id para los casos en donde haya editado la ciudad, 
    // el id de la ciudad deberia cambiar para levantarla correctamente
    idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });

    // actualizo los contactos que tenian relacion con esta compania (por si cambia de nombre)
    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE compania = ?', {
      replacements: [compania.nombre_ant],
      tpye: QueryTypes.SELECT
    });

    for (let i = 0; i < contactos.length; i++){
      if (contactos[i][0].compania == compania.nombre_ant){
        await myDataBase.query('UPDATE contactos SET compania = ? WHERE compania = ?', {
          replacements: [compania.nombre, compania.nombre_ant],
          tpye: QueryTypes.UPDATE
        })
      }
    }

    return await myDataBase.query('UPDATE companias SET nombre=?, direccion=?, email=?, telefono=?, id_ciudad=? WHERE  id = ?', {
      replacements: [compania.nombre, compania.direccion, compania.email, compania.telefono, idCiudad[0].id, idCompania[0].id],
      type: QueryTypes.UPDATE
    });
  }

  async function borrarCompania(compania){
    let idCiudad = await myDataBase.query('SELECT * FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });

    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE compania = ?', {
      replacements: [compania.nombre],
      type: QueryTypes.SELECT
    })

    
    // eliminar de contactos
    for (let i = 0; i < contactos.length; i++){
     await borrarContacto(contactos[i]);
    }

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

    let companias = await myDataBase.query('SELECT nombre, direccion, email, telefono, id_ciudad ciudad FROM companias WHERE id_ciudad = ?', {
      replacements: [idCiudad[0].id],
      tpye: QueryTypes.SELECT
    });
    

    for (let i = 0; i < companias[0].length; i++){
      if (companias[0][i] != undefined){
        companias[0][i].ciudad = nombreCiudad;
      }
    }
    if (companias[0].length != 0){
      // primero borro las companias, y las companias borra los contactos que pertenecen a esa compania
      for (let i = 0; i < companias[0].length; i++){
        if (companias[0][i] != undefined){
          await borrarCompania(companias[0][i]);
        }
      }
      // luego borro los contactos que esten en esa ciudad (no importa la compania a la cual pertenecen)
      let contactos = await myDataBase.query('SELECT * FROM contactos WHERE id_ciudad = ?', {
        replacements: [idCiudad[0].id],
        tpye: QueryTypes.SELECT
      });
      for (let i = 0; i < contactos[0].length; i++){
        console.log("estoy queriendo borrar el contaco: ", contactos[0][i])
        await borrarContacto(contactos[0][i]);
      }
    }
    else{
      let contactos = await myDataBase.query('SELECT * FROM contactos WHERE id_ciudad = ?', {
        replacements: [idCiudad[0].id],
        tpye: QueryTypes.SELECT
      });
      for (let i = 0; i < contactos[0].length; i++){
        console.log("estoy queriendo borrar el contaco: ", contactos[0][i])
        await borrarContacto(contactos[0][i]);
      }
    }

    return;
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
    
    for (let i = 0; i < idCiudad.length; i++){
      let nombreCiudad = await myDataBase.query('SELECT nombre FROM ciudades WHERE id = ?', {
        replacements: [idCiudad[i].id],
        tpye: QueryTypes.SELECT
      });


      await borrarCompaniaPais(nombreCiudad[0][0].nombre);

      await borrarCiudad(nombreCiudad[0][0].nombre);
    }
  }

  async function borrarContacto(contacto){
    let id_contacto = await myDataBase.query('SELECT id FROM contactos WHERE nombre = ? AND apellido = ? AND email = ?', {
      replacements: [contacto.nombre, contacto.apellido, contacto.email],
      type: QueryTypes.SELECT
    });
    let id_canal = await myDataBase.query('SELECT id_canal FROM tienen_canales WHERE id_contacto = ?', {
      replacements: [id_contacto[0].id],
      type: QueryTypes.SELECT
    });
    await myDataBase.query('DELETE FROM tienen_canales WHERE id_contacto = ?', {
      replacements: [id_contacto[0].id],
      type: QueryTypes.DELETE
    })

    for (let i = 0; i < id_canal.length; i++){
      await myDataBase.query('DELETE FROM canales WHERE id = ?', {
        replacements: [id_canal[i].id_canal],
        type: QueryTypes.DELETE
      });
    }

    // await myDataBase.query('DELETE FROM contactos_trabajan_en_companias WHERE id_contacto = ?', {
    //     replacements: [id_contacto[0].id],
    //     type: QueryTypes.DELETE
    // });

    // borro el contacto de la compania
    await myDataBase.query('DELETE FROM contactos_trabajan_en_companias WHERE id_contacto = ?', {
      replacements: [id_contacto[0].id],
      type: QueryTypes.DELETE
    });

    return await myDataBase.query('DELETE FROM contactos WHERE id = ?', {
      replacements: [id_contacto[0].id],
      type: QueryTypes.DELETE
    });
  }

  async function actualizarContacto(contacto){
    let id_canales_anteriores = await myDataBase.query('SELECT * FROM tienen_canales WHERE id_contacto = ?',{
      replacements: [contacto.contacto_anterior.id],
      type: QueryTypes.SELECT
    });


    let canales_anteriores = [];
    for (let i = 0; i < id_canales_anteriores.length; i++)
      canales_anteriores.push(await myDataBase.query('SELECT * FROM canales WHERE id = ?', {
          replacements: [id_canales_anteriores[i].id_canal],
          type: QueryTypes.SELECT
        })
      );
      // por si agrega canales nuevos en la edicion del contacto
    if (canales_anteriores.length != contacto.contacto_nuevo.canal.length){
      for (let i = canales_anteriores.length; i < contacto.contacto_nuevo.canal.length; i++){
        await myDataBase.query('INSERT INTO canales (canal, cuenta_usuario, preferencia) VALUES (?, ?, ?)', {
          replacements: [contacto.contacto_nuevo.canal[i].canal, contacto.contacto_nuevo.canal[i].cuentaUsuario, contacto.contacto_nuevo.canal[i].preferencia],
          type: QueryTypes.INSERT
        });
        let id_canal = await myDataBase.query('SELECT id FROM canales WHERE canal = ? AND cuenta_usuario = ? AND preferencia = ?', {
          replacements: [contacto.contacto_nuevo.canal[i].canal, contacto.contacto_nuevo.canal[i].cuentaUsuario, contacto.contacto_nuevo.canal[i].preferencia],
          type: QueryTypes.SELECT
        })
        await myDataBase.query('INSERT INTO tienen_canales (id_canal, id_contacto) VALUES (?, ?)', {
          replacements: [id_canal[0].id, contacto.contacto_anterior.id],
          type: QueryTypes.INSERT
        });
      }
    }
    // actualizo tambien en la relacion con compañia
    let id_compania = await myDataBase.query('SELECT id FROM companias WHERE nombre = ?', {
      replacements: [contacto.contacto_nuevo.compania],
      type: QueryTypes.SELECT
    });

    await myDataBase.query('UPDATE contactos_trabajan_en_companias SET id_compania = ? WHERE id_contacto = ?', {
      replacements: [id_compania[0].id, contacto.contacto_anterior.id],
      type: QueryTypes.UPDATE
    });

    return await myDataBase.query('UPDATE contactos SET nombre = ?, apellido = ?, cargo = ?, email = ?, compania = ?, direccion = ?, interes = ?, id_ciudad = ? WHERE id = ?',{
      replacements: [contacto.contacto_nuevo.nombre, contacto.contacto_nuevo.apellido, contacto.contacto_nuevo.cargo, contacto.contacto_nuevo.email, 
                    contacto.contacto_nuevo.compania, contacto.contacto_nuevo.direccion, contacto.contacto_nuevo.interes, contacto.contacto_nuevo.id_ciudad, contacto.contacto_anterior.id],
      type: QueryTypes.UPDATE
    });
  }

  async function getContactos(){
    let resultado = await myDataBase.query('SELECT * FROM contactos', {
      type: QueryTypes.SELECT
    });

    if (resultado.length != 0)
      return resultado;
    return;
  }

  async function getCanales(contacto){
    let id_contacto = await myDataBase.query('SELECT id FROM contactos WHERE email = ?', {
      replacements: [contacto.email],
      type: QueryTypes.SELECT
    });
    
    let id_canal =  await myDataBase.query('SELECT id_canal FROM tienen_canales WHERE id_contacto = ?', {
      replacements: [id_contacto[0].id],
      type: QueryTypes.SELECT
    });

    let resultado = [];
    for (let i = 0; i < id_canal.length; i++){
      resultado.push(await myDataBase.query('SELECT * FROM canales WHERE id = ?', {
                        replacements: [id_canal[i].id_canal],
                        type: QueryTypes.SELECT
                      })
      );
    }

    if (resultado.length != 0){
      return resultado;
    }
    return [];
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
    let id_pais = await myDataBase.query('SELECT id_pais FROM ciudades WHERE id = ?', {
      replacements: [id_ciudad],
      type: QueryTypes.SELECT
    });

    return await myDataBase.query('SELECT nombre FROM paises WHERE id = ?', {
      replacements: [id_pais[0].id_pais],
      type: QueryTypes.SELECT
    });
  }

  async function addContacto(contacto){
    // si existe ciudad
    let existe = await myDataBase.query('SELECT nombre FROM ciudades WHERE id = ?', {
      replacements: [contacto.id_ciudad],
      type: QueryTypes.SELECT
    });

    if (existe.length == 0)
      return status(404);
    
    // si existe la compania
    existe = await myDataBase.query('SELECT id FROM companias WHERE nombre = ?', {
      replacements: [contacto.compania],
      type: QueryTypes.SELECT
    });

    if (existe.length == 0)
      return status(404);
     
    // inserto los canales del contacto
    contacto.canal.forEach(async elemento => {
      await myDataBase.query('INSERT INTO canales (canal, cuenta_usuario, preferencia) VALUES (?, ?, ?)', {
        replacements: [elemento.canal, elemento.cuentaUsuario, elemento.preferencia],
        type: QueryTypes.INSERT
      })
    });

    // inserto el contacto
    await myDataBase.query('INSERT INTO contactos (nombre, apellido, cargo, email, compania, direccion, interes, id_ciudad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', {
      replacements: [contacto.nombre, contacto.apellido, contacto.cargo, contacto.email, contacto.compania, contacto.direccion, contacto.interes, contacto.id_ciudad],
      type: QueryTypes.INSERT
    })

    let id_contacto = await myDataBase.query('SELECT id FROM contactos WHERE email = ?', {
      replacements: [contacto.email],
      type: QueryTypes.SELECT
    })

    // inserto las relaciones de contactos y canales
    contacto.canal.forEach( async elemento => {
      let id_canal = await myDataBase.query('SELECT id FROM canales WHERE canal = ? AND cuenta_usuario = ?', {
        replacements: [elemento.canal, elemento.cuentaUsuario],
        type: QueryTypes.SELECT
      });

      await myDataBase.query('INSERT INTO tienen_canales (id_canal, id_contacto) VALUES(?, ?)', {
        replacements: [id_canal[0].id, id_contacto[0].id],
        type: QueryTypes.INSERT
      });
    });

    let id_compania = await myDataBase.query('SELECT id FROM companias WHERE nombre = ?', {
      replacements: [contacto.compania],
      type: QueryTypes.SELECT
    });

    // agrego el contacto en la compañia
    await myDataBase.query('INSERT INTO contactos_trabajan_en_companias (id_contacto, id_compania) VALUES (?, ?)', {
      replacements: [id_contacto[0].id, id_compania[0].id],
      type: QueryTypes.INSERT
    });
  }

  async function borrarContactosPais(pais){
    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE id_pais = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

    if (idCiudad.length != 0){
        for (let i = 0; i < idCiudad.length; i++){
          let contactos = await myDataBase.query('SELECT * FROM contactos WHERE id_ciudad = ?', {
            replacements: [idCiudad[i].id],
            type: QueryTypes.SELECT
          });

          for (let i = 0; i < contactos.length; i++){
            await borrarContacto(contactos[i]);
        }
        
      }
    }
  }

  async function borrarContactoCiudad(id_ciudad){
    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE id_ciudad = ?', {
      replacements: [id_ciudad[0].id],
      type: QueryTypes.SELECT
    })
    for (let i = 0; i < contactos.length; i++){
      await borrarContacto(contactos[i]);
    }
  }

  async function borrarContactoCompania(compania){
    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE compania = ?', {
      replacements: [compania.nombre],
      type: QueryTypes.SELECT
    });
    for (let i = 0; i < contactos.length; i++)
      await borrarContacto(contacto[i]);
  }


  
  module.exports = {  crearUsuario, loginUsuario, isAdmin, getUsuario, getUsuarios, getId, updateUsuarios, 
                      deleteUsuarios, setPassword, getRegiones, addRegion, getPaises, addPais, borrarPais, 
                      actualizarPais, getCiudades, getTodasCiudades, addCiudad, borrarCiudad, actualizarCiudad, getCompanias,
                      addCompania, actualizarCompania, borrarCompania, borrarCompaniaPais, borrarCompaniaRegion, 
                      borrarContacto, actualizarContacto, getContactos, getCanales, getRegion, getPais, addContacto, 
                      getIdCiudad, borrarContactosPais, borrarContactoCiudad, borrarContactoCompania, 
                    };