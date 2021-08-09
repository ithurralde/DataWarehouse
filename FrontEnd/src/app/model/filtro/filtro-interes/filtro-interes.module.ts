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
export class FiltroInteresModule extends FiltroModule{
  
  constructor(contactos: ContactoModule[]){
    super(contactos);
  }

  public filtrar(element: any) {
    if (element == undefined || element < 0)
      return this.contactos;
    let resultado: ContactoModule[] = [];
    this.contactos.forEach(contacto => {
      if (contacto.interes === element)
        resultado.push(contacto);
    });
    return resultado;
  } 

}
