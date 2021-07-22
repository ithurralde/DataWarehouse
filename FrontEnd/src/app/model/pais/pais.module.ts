// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { CiudadModule } from '../ciudad/ciudad.module';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class PaisModule { 
  constructor(public nombre:string){

  }

  set(nombre:string){
    this.nombre = nombre;
  }
}
