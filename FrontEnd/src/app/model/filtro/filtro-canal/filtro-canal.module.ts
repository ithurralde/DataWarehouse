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
    let resultado: ContactoModule[] = [];
    this.contactos.forEach(contacto => {
      contacto.canal.forEach(canal => {
        if (canal.canal == element)
          resultado.push(contacto);
      })
    });
    if (resultado.length === 0)
      return this.contactos;
    return resultado;
  } 

}
