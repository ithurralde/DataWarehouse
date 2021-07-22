import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class RegionModule { 
  constructor(public nombre:string){
  }

  set(nombre:string){
    this.nombre = nombre;
  }
}
