import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CiudadAnteriorModule } from 'src/app/model/ciudad/ciudad-anterior.module';
import { CiudadModule } from 'src/app/model/ciudad/ciudad.module';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css']
})
export class CiudadComponent implements OnInit {
  @Input() ciudad: CiudadModule;
  puedeEditar = false;
  @Output() borrarCiudad = new EventEmitter();
  @Output() actualizarCiudad = new EventEmitter();
  ciudad_ant: CiudadAnteriorModule;
  constructor() { }

  ngOnInit(): void {
  }

  preEditar(){
    this.ciudad_ant = new CiudadAnteriorModule("null", this.ciudad.nombre);
    this.puedeEditar = true;
  }
  
  editar(){
    this.puedeEditar = false;
    this.ciudad_ant.nombre = this.ciudad.nombre;
    this.actualizarCiudad.emit(this.ciudad_ant);
  }

  borrar(){
    // primero borro los contactos y despues elimino la ciudad
    this.borrarCiudad.emit(this.ciudad);
  }
  
}
