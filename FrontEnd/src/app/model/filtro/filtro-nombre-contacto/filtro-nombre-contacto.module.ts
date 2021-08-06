import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroModule } from '../filtro.module';
import { ContactoModule } from '../../contacto/contacto.module';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class FiltroNombreContactoModule extends FiltroModule {

  constructor(contactos: ContactoModule[]){
    super(contactos);
  }

  public filtrar(element: string) {
    if (element != undefined){
      element = element.toLowerCase();
      let nombreCompleto = element.split(" ");
      for (let i = 0; i < this.contactos.length; i++){
        let nombreContacto = this.contactos[i].nombre.toLowerCase();
        let apellidoContacto = this.contactos[i].apellido.toLowerCase();
        if (nombreContacto == nombreCompleto[0] && apellidoContacto == nombreCompleto[1] || // nombre y apellido
            nombreContacto == nombreCompleto[1] && apellidoContacto == nombreCompleto[0] || // apellido y nombre
            nombreContacto == nombreCompleto[0] || apellidoContacto == nombreCompleto[0]) // solo nombre o solo apellido
          return [this.contactos[i]];
      }
    }
    return this.contactos;
  }
}
