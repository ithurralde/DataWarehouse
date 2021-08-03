import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';

@Component({
  selector: 'app-crear-contacto',
  templateUrl: './crear-contacto.component.html',
  styleUrls: ['./crear-contacto.component.css']
})
export class CrearContactoComponent implements OnInit {
  @Output() cerrarVentana = new EventEmitter();
  nombre:string;
  apellido:string;
  cargo:string;
  email:string;
  compania:string;
  direccion:string;
  interes:number;  
  canal:string;
  preferencias:string;
  d_ciudad:number;
  constructor() { }

  ngOnInit(): void {
  }
  
  crear(){
    // let nuevoContacto = new ContactoModule()
  }

  cerrar(){
    this.cerrarVentana.emit(false);
  }
}
