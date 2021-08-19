import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  @Input() contacto: ContactoModule;
  @Input() contactos: ContactoModule[]; // los necesito para editar el contacto, necesito conocer todas las companias
  @Output() eliminarSeleccionados = new EventEmitter();
  @Output() eliminarContacto = new EventEmitter();
  pais:string;
  region:string;
  interes:number;
  acciones:boolean;
  edit:boolean;
  modalEliminarContacto:boolean;
  constructor(private contactoService: ContactoService) { }

  ngOnInit() {
    console.log("la direccion del contacto ?? ", this.contacto.direccion);
    this.interes = this.contacto.interes;
    this.contactoService.obtenerRegion(this.contacto.id_ciudad).subscribe(
      (region:any) => {
        this.region = region[0].region;
        console.log("la region es: " + region[0].region);
        console.log(region[0].region);
      }
    );
    this.contactoService.obtenerPais(this.contacto.id_ciudad).subscribe(
      (pais:any) => {
        this.pais = pais[0].nombre;
        console.log("el pais es: " + pais[0].nombre);
        console.log(pais[0].nombre);
      }
    );
  }

  checkbox(){
    this.eliminarSeleccionados.emit(this.contacto);
  }

  desplegarAcciones(){
    if (!this.acciones)
      this.acciones = true;
    else
      this.acciones = false;
  }

  preEliminar(){
    this.modalEliminarContacto = true;
    this.acciones = false;
  }

  cancelarEliminar(){
    this.modalEliminarContacto = false;
  }

  eliminar(){
    this.modalEliminarContacto = false;
    this.eliminarContacto.emit(this.contacto);
  }

  editar(){
    if (!this.edit){
      this.edit = true;
      this.acciones = false;
    }
  }

  actualizarContacto(contacto: ContactoModule){
    console.log("Contacto anterior: ", this.contacto);
    console.log("Contacto nuevo: ", contacto);
    this.contactoService.actualizarContacto(this.contacto, contacto).subscribe(
      (response) => {
        console.log("Contacto creado %o.", response);
      },
      (error) => {
        console.error("No se pudo crear el contacto. Error: ", error)
      }
    )
  }

  cerrarVentana(bool: boolean){
    let html = document.querySelector<HTMLElement>(".body");
     this.edit = bool;
    if (html)
      html.style.backgroundColor = "transparent";
  }
}
