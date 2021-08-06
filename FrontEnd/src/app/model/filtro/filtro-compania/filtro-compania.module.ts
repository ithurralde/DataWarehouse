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
export class FiltroCompaniaModule extends FiltroModule{ 
  constructor(contactos: ContactoModule[]){
    super(contactos);
  }

  public filtrar(element: string) {
    let resultado:any[] = [];
    if (element != undefined)
      if (element != "Todos"){
        element = element.toLowerCase();
        for (let i = 0; i < this.contactos.length; i++){
          if (this.contactos[i].compania.toLowerCase() == element)
            resultado.push(this.contactos[i]);
        }
        return resultado;
      }
    console.log("estoy retornando todos?");
    console.log(this.contactos);
    return this.contactos;
  }
}
