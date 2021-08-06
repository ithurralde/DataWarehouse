import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactoModule } from '../contacto/contacto.module';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export abstract class FiltroModule {
  protected contactos: ContactoModule[]
  constructor(contactos: ContactoModule[]){
    this.contactos = contactos;
  }

  public abstract filtrar(element: any):any;
}
