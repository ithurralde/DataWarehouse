import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompaniaAnteriorModule } from 'src/app/model/compania/compania-anterior.module';
import { CompaniaModule } from 'src/app/model/compania/compania.module';


@Component({
  selector: 'app-compania',
  templateUrl: './compania.component.html',
  styleUrls: ['./compania.component.css']
})
export class CompaniaComponent implements OnInit {
  @Input() compania: CompaniaModule;
  @Input() ciudades: string[] = [];
  @Output() editarCompania = new EventEmitter();
  @Output() borrarCompania = new EventEmitter();
  compania_ant: CompaniaAnteriorModule;
  editable: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  preEditar(){
    this.editable = true;
    this.compania_ant = new CompaniaAnteriorModule("null", "null", "null", "null", "null", 
                              this.compania.nombre, this.compania.direccion, this.compania.email, this.compania.telefono, this.compania.ciudad);
  }
  
  editar(){
    this.editable = false;
    this.compania_ant.nombre = this.compania.nombre;
    this.compania_ant.direccion = this.compania.direccion;
    this.compania_ant.email = this.compania.email;
    this.compania_ant.telefono = this.compania.telefono;
    this.compania_ant.ciudad = this.compania.ciudad;
    this.editarCompania.emit(this.compania_ant);
  }

  borrar(){
    this.borrarCompania.emit(this.compania);
  }
}
