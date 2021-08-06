import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class CanalModule { 

  constructor(public canal:string,
              public cuentaUsuario:string, 
              public preferencia:string) {

  }
}
