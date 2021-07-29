import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CiudadModule } from 'src/app/model/ciudad/ciudad.module';
import { actPaisModule } from 'src/app/model/pais/actPais.module';
import { PaisModule } from 'src/app/model/pais/pais.module';
import { RegionModule } from 'src/app/model/region/region.module';
import { CiudadService } from 'src/app/servicios/ciudad-service.service';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {
  @Input() pais: PaisModule;
  @Input() borrarCiudad: CiudadModule;
  @Input() region: RegionModule;
  @Output() borrarPais = new EventEmitter;
  @Output() actualizarPais = new EventEmitter;
  prePais: actPaisModule;
  editable: boolean;
  ciudades: CiudadModule[] = [];
  ciudad: string;
  puedoAgregar = false;
  constructor(private ciudadService: CiudadService) { }

  ngOnInit(): void {
    this.ciudadService.obtenerCiudades(this.pais).subscribe(
      (ciudades: CiudadModule[]) => {
        if (ciudades != null)
          ciudades.forEach(element => {
              this.ciudades.push(new CiudadModule(element.nombre));
          });
        // this.paises = paises;
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }

  preAgregarCiudad(){
    this.puedoAgregar = true;
  }

  agregarCiudad(){
    this.puedoAgregar = false;
    console.log("Estoy agregando?");
    let ciudad = new CiudadModule(this.ciudad);
    // let region = new RegionModule("holanda");
    console.log(this.ciudad);
    this.ciudadService.agregarCiudad(ciudad, this.pais, this.region).subscribe(
      () => {
        console.log("Ciudad " + ciudad + " agregada correctamente.");
        this.ciudades.push(ciudad);
      }
    );
  }

  delete(ciudad: CiudadModule){
    for (let i = 0; i < this.ciudades.length; i++){
      console.log(this.ciudades[i].nombre);
      console.log(ciudad.nombre);
      if (this.ciudades[i] === ciudad){
        this.ciudadService.borrarCiudad(this.ciudades[i]).subscribe(
          () => {
            console.log("Ciudad " + this.ciudades[i] + " eliminada correctamente.");
            this.ciudades.splice(i,1);
          }
        );
      }
    }
  }

  preEditPais(){
    this.editable = true;
    this.prePais = new actPaisModule("null", this.pais.nombre);
  }

  EditPais(){
    this.editable = false;
    this.prePais.nombre = this.pais.nombre;
    console.log("dale la re concha de tu madre");
    this.actualizarPais.emit(this.prePais);
  }

  update(ciudad: CiudadModule){
    for (let i = 0; i < this.ciudades.length; i++){
      console.log(this.ciudades[i].nombre);
      console.log(ciudad.nombre);
      if (this.ciudades[i] === ciudad){
        this.ciudadService.actualizarCiudad(ciudad, this.pais).subscribe(
          () => {
            console.log("Ciudad " + ciudad + " eliminada correctamente.");
            this.ciudades[i] = ciudad;
          }
        );
      }
    }
  }

  deletePais(){
    this.borrarPais.emit(this.pais);
  }

}
