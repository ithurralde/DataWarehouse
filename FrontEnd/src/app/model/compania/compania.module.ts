import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class CompaniaModule { 
  constructor(public nombre:string, public direccion:string, public email:string, public telefono:string, public ciudad:string){

  }
}
