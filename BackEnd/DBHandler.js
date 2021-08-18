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
    console.log("que carajo es compania ahora: %o, y la ciudad: %o ", compania, compania.ciudad);
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

    // actualizo los contactos que tenian relacion con esta compania (por si cambia de nombre)
    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE compania = ?', {
      replacements: [compania.nombre_ant],
      tpye: QueryTypes.SELECT
    });

    console.log("Nombre de la compania anterior: %o, nombre de la nueva compania: %o", compania.nombre_ant, compania.nombre);
    for (let i = 0; i < contactos.length; i++){
      console.log("el nombre de la compania antes de cambiar: ", contactos[i][0])
      console.log("el nombre de la compania antes de cambiar: ", contactos[i][0].compania)
      if (contactos[i][0].compania == compania.nombre_ant){
        console.log("estoy cambiando: ", contactos[i].compania)
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
    console.log("me estas imprimiendo esto?");
    console.log(compania.nombre);
    console.log(compania.ciudad);
    let idCiudad = await myDataBase.query('SELECT * FROM ciudades WHERE nombre = ?', {
      replacements: [compania.ciudad],
      type: QueryTypes.SELECT
    });

    console.log("id ciudad termino con: ", idCiudad[0].id);
    
    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE compania = ?', {
      replacements: [compania.nombre],
      type: QueryTypes.SELECT
    })

    
    // eliminar de contactos
    for (let i = 0; i < contactos.length; i++){
      // console.log("los contactos que levante: ", contactos[i])
     await borrarContacto(contactos[i]);
    }

    console.log("termino bien con el for?");
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

    // let existe = await myDataBase.query('SELECT * FROM companias WHERE id_ciudad = ?', {
    //   replacements: [idCiudad[0].id],
    //   type: QueryTypes.SELECT
    // });

    // console.log("existe: ");
    // console.log(existe);
    let resultado;
    // if (existe.length != 0){
      // console.log("what man?");
    let companias = await myDataBase.query('SELECT nombre, direccion, email, telefono, id_ciudad ciudad FROM companias WHERE id_ciudad = ?', {
      replacements: [idCiudad[0].id],
      tpye: QueryTypes.SELECT
    });

    // console.log("ni el for pasa?");
    console.log("companias: ", companias)
    console.log("el length de companias[0]: ", companias[0].length);
    console.log("companias 0: ", companias[0])
    console.log("companias 0,0: ", companias[0][0])
    console.log("companias 0,1: ", companias[0][1])
    console.log("companias 2,0: ", companias[0][2])
    console.log("companias 1,0: ", companias[1][0])
    console.log("companias 1,1: ", companias[1][1])
    console.log("companias 2,1: ", companias[1][2])
    

    for (let i = 0; i < companias[0].length; i++){
      console.log("Pero que carajo estoy imprimiendo papurron: ", companias[0][i]);
      console.log("Pero que carajo estoy imprimiendo papurron: ", companias[0][i]);
      if (companias[0][i] != undefined){
        companias[0][i].ciudad = nombreCiudad;
      }
    }

    console.log("companias despues de modificar: ", companias);
    // console.log("no, ni el for pasa........");

    // console.log("Las companias enteras antes de borrar: ", companias[0]);
    for (let i = 0; i < companias[0].length; i++){
      // console.log("imprime cada compania: ", companias[0][i]);
      console.log("por borrar la compania: ", companias[0][i]);
      if (companias[0][i] != undefined){
        console.log("pero me esta entrando con undefined esta poronga?? ", companias[0][i]);
        await borrarCompania(companias[0][i]);
      }
    }
    // resultado = await myDataBase.query('DELETE FROM companias WHERE id_ciudad = ?', {
    //   replacements: [idCiudad[0].id],
    //   type: QueryTypes.DELETE
    // });
    // }

    // if (existe.length != 0){
      // await borrarCiudad(nombreCiudad);
    // }
    console.log("por aca todo correct?");
    // await borrarContactoCiudad(idCiudad);
    

    return;
  }

  
  async function borrarCompaniaRegion(pais){

    let idPais = await myDataBase.query('SELECT id FROM paises WHERE nombre = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

    // await borrarContactosPais(idPais[0].id);
    console.log("paso el anterior?");
    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE id_pais = ?', {
      replacements: [idPais[0].id],
      type: QueryTypes.SELECT
    });

    console.log("paso este?")
    console.log("el idCiudad con los ids de las ciudades: ", idCiudad);
    console.log("el length de idCiudad: ", idCiudad.length);
    // let nombreCiudad = await myDataBase.query('SELECT nombre FROM ciudades WHERE id = ?',{
    //   replacements: [idCiudad[0].id],
    //   type: QueryTypes.SELECT
    // })
    
    for (let i = 0; i < idCiudad.length; i++){
      let nombreCiudad = await myDataBase.query('SELECT nombre FROM ciudades WHERE id = ?', {
        replacements: [idCiudad[i].id],
        tpye: QueryTypes.SELECT
      });

      console.log("nombre de la ciudad objeto entero: ", nombreCiudad);
      console.log("pero me esta agarrando como el orto el nombre de la ciudad: ", nombreCiudad[0][0].nombre);

      await borrarCompaniaPais(nombreCiudad[0][0].nombre);
      
      console.log("entonces estoy rompiendo en este")

      await borrarCiudad(nombreCiudad[0][0].nombre);
    }

    // return await myDataBase.query('DELETE FROM paises WHERE nombre = ?', {
    //   replacements: [pais],
    //   type: QueryTypes.DELETE
    // });
    // ****************************************************************************************************************************************************
    // let companias = await myDataBase.query('SELECT nombre, direccion, email, telefono, id_ciudad ciudad FROM companias WHERE id_ciudad = ?', {
    //   replacements: [idCiudad[0].id],
    //   tpye: QueryTypes.SELECT
    // });

    // for (let i = 0; i < companias.length; i++){
    //   console.log("Pero que carajo estoy imprimiendo papurron: ", companias[i][0]);
    //   companias[i][0].ciudad = nombreCiudad;
    // }

    // for (let i = 0; i < companias.length; i++){
    //   // console.log("imprime cada compania: ", companias[0][i]);
    //   await borrarCompania(companias[i][0]);
    // }


    // let resultado = await myDataBase.query('DELETE FROM companias WHERE id_ciudad = ?', {
    //   replacements: [idCiudad[0].id],
    //   type: QueryTypes.DELETE
    // });

    


    // return resultado;
  }

  async function borrarContacto(contacto){
    console.log("contaco en la BD: " , contacto);
    console.log("y entonces ? " , contacto.nombre);
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

    await myDataBase.query('DELETE FROM contactos_trabajan_en_companias WHERE id_contacto = ?', {
        replacements: [id_contacto[0].id],
        type: QueryTypes.DELETE
    });

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
    console.log("hola ?? ", contacto);
    // let id_contacto = await myDataBase.query('SELECT id FROM contactos WHERE nombre = ?, apellido = ?, email = ?', {
    //   replacements: [contacto.contacto_anterior.nombre, contacto.contacto_anterior.apellido, contacto.contacto_anterior.email],
    //   type: QueryTypes.SELECT
    // });
    console.log("el contacto en actualizar: ", contacto);
    console.log("canales en actualizar: ", contacto.contacto_nuevo.canal);
    console.log("tamaño de canales en actualizar: ", contacto.contacto_nuevo.canal.length);
    let id_canales_anteriores = await myDataBase.query('SELECT * FROM tienen_canales WHERE id_contacto = ?',{
      replacements: [contacto.contacto_anterior.id],
      type: QueryTypes.SELECT
    });

    console.log("los id de los canales anteriores: ", id_canales_anteriores);

    let canales_anteriores = [];
    for (let i = 0; i < id_canales_anteriores.length; i++)
      canales_anteriores.push(await myDataBase.query('SELECT * FROM canales WHERE id = ?', {
          replacements: [id_canales_anteriores[i].id_canal],
          type: QueryTypes.SELECT
        })
      );
      console.log("CANALES ANTERIORES MAN POR FAVOR: ", canales_anteriores);
      console.log("tamaño CANALES ANTERIORES MAN POR FAVOR: ", canales_anteriores.length);
      // por si agrega canales nuevos en la edicion del contacto
    if (canales_anteriores.length != contacto.contacto_nuevo.canal.length){
      for (let i = canales_anteriores.length; i < contacto.contacto_nuevo.canal.length; i++){
        console.log("tamaño de la i: %o, posicion en contacto nuevo: %o", i, contacto.contacto_nuevo.canal[i])
        // console.log("contacto_anterior => canal: %o, cuenta_usuario: %o, preferencia: %o", canales_anteriores[i][0].canal, canales_anteriores[i][0].cuenta_usuario, canales_anteriores[i][0].preferencia);
        console.log("contacto_nuevo => canal: %o, cuenta_usuario: %o, preferencia: %o", contacto.contacto_nuevo.canal[i].canal, contacto.contacto_nuevo.canal[i].cuentaUsuario, contacto.contacto_nuevo.canal[i].preferencia);
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
    console.log("y aca no? id_compania: ", id_compania[0]);
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
    console.log(id_canal);
    for (let i = 0; i < id_canal.length; i++){
      resultado.push(await myDataBase.query('SELECT * FROM canales WHERE id = ?', {
                        replacements: [id_canal[i].id_canal],
                        type: QueryTypes.SELECT
                      })
      );
    }

    if (resultado.length != 0){
      console.log("el resulTADOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOoooooooooooooooooooooooooooooOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOoooooooooooooooooo")
      console.log(resultado);
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

    console.log("paso esto?");
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
      console.log("el id papurroooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
      console.log(id_canal[0].id);
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
    console.log("holi: pais");
    console.log(pais);
    let idCiudad = await myDataBase.query('SELECT id FROM ciudades WHERE id_pais = ?', {
      replacements: [pais],
      type: QueryTypes.SELECT
    });

    if (idCiudad.length != 0){
      // idCiudad.forEach(async ciudad => {
        console.log("y el idCiudad meeeen: ", idCiudad);
        console.log("y el idCiudad meeeen[0]: ", idCiudad[0]);
        for (let i = 0; i < idCiudad.length; i++){
        // await myDataBase.query('DELETE FROM contactos WHERE id_ciudad = ?', {
        //   replacements: [ciudad.id],
        //   type: QueryTypes.DELETE
        // });
        console.log("por cargar contactos: ");
        let contactos = await myDataBase.query('SELECT * FROM contactos WHERE id_ciudad = ?', {
          replacements: [idCiudad[i].id],
          type: QueryTypes.SELECT
        });
        console.log("a ver el contacto papurron: ", contactos)
        console.log("a ver el contacto papurron: ", contactos[0])
        for (let i = 0; i < contactos.length; i++){
          await borrarContacto(contactos[i]);
        }
        
      }
      // });
    }
  }

  async function borrarContactoCiudad(id_ciudad){
    console.log("el id de la ciudad en borrar contacto ciudad: ", id_ciudad);
    let contactos = await myDataBase.query('SELECT * FROM contactos WHERE id_ciudad = ?', {
      replacements: [id_ciudad[0].id],
      type: QueryTypes.SELECT
    })
    for (let i = 0; i < contactos.length; i++){
      await borrarContacto(contactos[i]);
    }
    // return await myDataBase.query('DELETE FROM contactos WHERE id_ciudad = ?', {
    //   replacements: [id_ciudad[0].id],
    //   type: QueryTypes.DELETE
    // });
  }

  async function borrarContactoCompania(compania){
    //DELETE FROM companias WHERE id_ciudad = ?'
    // return await myDataBase.query('DELETE FROM contactos WHERE compania = ?', {
    //   replacements: [compania.nombre],
    //   type: QueryTypes.DELETE
    // });
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
  