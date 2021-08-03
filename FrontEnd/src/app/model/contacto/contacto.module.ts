import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class ContactoModule {

  constructor(public nombre:string,
              public apellido:string,
              public email:string,
              public compania:string,
              public direccion:string,
              public interes:number,
              public canal:string,
              public preferencias:string,
              public id_ciudad:number){

  }
 }
