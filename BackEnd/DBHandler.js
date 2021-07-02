const { response } = require('express');
const { QueryTypes } = require('sequelize');
const myDataBase = require('./conectionDB');

async function crearUsuario(usuario) {
    let existe = await myDataBase.query('SELECT nombre FROM usuarios WHERE nombre = ?', {
      replacements: [usuario.nombre],
      type: QueryTypes.SELECT
    });
    if (existe.length == 0){
      existe = await myDataBase.query('SELECT email FROM usuarios WHERE email = ?', {
        replacements: [usuario.email],
        type: QueryTypes.SELECT
      });
      if (existe.length == 0){
        await myDataBase.query('INSERT INTO usuarios (nombre, apellido, email, region, ciudad) VALUES (?, ?, ?, ?, ?)', {
          replacements: [usuario.nombre, usuario.apellido, usuario.email, usuario.region, usuario.ciudad],
        });
        return {message: 'Usuario registrado exitosamente.'};
      }
    }
    return status(404);
  }
    
  async function loginUsuario(usuario) {
      let resultado = await myDataBase.query('SELECT * FROM usuarios WHERE user = ? AND password = ?', {
          replacements: [usuario.user, usuario.password],
          type: QueryTypes.SELECT
      });
      if (resultado.length == 0)
        return status(401);
      else
        return resultado;
  }
  
  async function getUsuario(id){
    return await myDataBase.query('SELECT * FROM usuarios WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT
    });
  }

  async function getUsuarios(){
    let datos = await myDataBase.query('SELECT * FROM usuarios', {
      replacements: QueryTypes.SELECT
    });
    return datos[0];
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
    });
  
    return { message: "Contraseña actualizada."}
  }
  
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
  
  module.exports = { crearUsuario, loginUsuario, getUsuario, getUsuarios, setPassword, crearPlato, getPlatos, actualizarPrecio, borrarPlato, crearPedido, actualizar_estado, getPedido, borrarPedido };