import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactoModule } from '../../contacto/contacto.module';
import { FiltroModule } from '../filtro.module';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class FiltroCargoModule extends FiltroModule{ 
  constructor(contactos: ContactoModule[]){
    super(contactos);
  }

  public filtrar(element: string) {
    let resultado:any[] = [];
    if (element != undefined){
      element = element.toLowerCase();
      for (let i = 0; i < this.contactos.length; i++){
        if (this.contactos[i].cargo.toLowerCase() == element)
          resultado.push(this.contactos[i]);
      }
      return resultado;
    }
    return this.contactos;
  }
}
