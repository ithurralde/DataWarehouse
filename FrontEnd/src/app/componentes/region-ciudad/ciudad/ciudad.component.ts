import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  constructor() { }

  ngOnInit(): void {
  }

  preEditar(){
    this.puedeEditar = true;
  }
  
  editar(){
    this.puedeEditar = false;
    this.actualizarCiudad.emit(this.ciudad);
  }

  borrar(){
    this.borrarCiudad.emit(this.ciudad);
  }
  
}
