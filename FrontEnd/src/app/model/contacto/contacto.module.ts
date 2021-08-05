import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanalModule } from '../canal/canal.module';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class ContactoModule {

  constructor(public nombre:string,
              public apellido:string,
              public cargo:string,
              public email:string,
              public compania:string,
              public direccion:string,
              public interes:number,
              public canal:CanalModule[],
              public preferencias:string,
              public id_ciudad:number){

  }
 }
