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
export class FiltroCanalModule extends FiltroModule{

  constructor(contactos: ContactoModule[]){
    super(contactos);
  }

  public filtrar(element: string) {
    if (element == "Todos")
      return this.contactos;
    if (element == undefined)
      return this.contactos;
    let resultado: ContactoModule[] = [];
    this.contactos.forEach(contacto => {
      contacto.canal.forEach(canal => {
        // console.log("datos de cada canal: ", canal)
        if (canal.canal == element && canal.preferencia == 'Canal favorito'){
          console.log("Estoy entrando?");
          resultado.push(contacto);
        }
      })
    });
    return resultado;
  } 

}
