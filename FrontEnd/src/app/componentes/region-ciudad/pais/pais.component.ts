import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CiudadAnteriorModule } from 'src/app/model/ciudad/ciudad-anterior.module';
import { CiudadModule } from 'src/app/model/ciudad/ciudad.module';
import { actPaisModule } from 'src/app/model/pais/actPais.module';
import { PaisModule } from 'src/app/model/pais/pais.module';
import { RegionModule } from 'src/app/model/region/region.module';
import { CiudadService } from 'src/app/servicios/ciudad-service.service';
import { CompaniaService } from 'src/app/servicios/compania.service';

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
  ciudad_ant: CiudadModule;
  prePais: actPaisModule;
  editable: boolean;
  boton:string = "Add city";
  ciudades: CiudadModule[] = [];
  ciudad: string;
  puedoAgregar = false;
  constructor(private ciudadService: CiudadService, private companiaService: CompaniaService) { }

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
    if (!this.puedoAgregar){
      this.puedoAgregar = true;
      this.boton = "Cancelar";
    }
    else{
      this.puedoAgregar = false;
      this.boton = "Add city";
    }
  }

  cancelar(){
    this.editable = false;
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
    // podria mandarle la region y el pais para que no borre todas las ciudades con el mismo nombre
    for (let i = 0; i < this.ciudades.length; i++){
      console.log(this.ciudades[i].nombre);
      console.log(ciudad.nombre);
      if (this.ciudades[i] === ciudad){
        this.companiaService.borrarCompaniaPais(ciudad.nombre).subscribe(
          () => {
            this.ciudadService.borrarCiudad(this.ciudades[i]).subscribe(
              () => {
                console.log("Ciudad " + this.ciudades[i] + " eliminada correctamente.");
                this.ciudades.splice(i,1);
              }
            );
          });
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

  update(ciudad_ant: CiudadAnteriorModule){
    for (let i = 0; i < this.ciudades.length; i++){
      console.log(ciudad_ant);
      console.log(this.ciudades[i]);
      if (this.ciudades[i].nombre === ciudad_ant.nombre){
        this.ciudadService.actualizarCiudad(ciudad_ant, this.pais).subscribe(
          () => {
            console.log("Ciudad " + ciudad_ant.nombre_anterior + " actualizada correctamente.");
            this.ciudades[i] = new CiudadModule(ciudad_ant.nombre);
          }
        );
      }
    }
  }

  deletePais(){
    // le mando la region para los casos en que haya paises con el mismo nombre
    // primero borro los contactos y despues el pais (con sus ciudades)
    this.borrarPais.emit(this.pais);
    // this.contactoService.borrarContactosPais(this.pais.nombre).subscribe(
    //   () => {
    //     console.log("Los contactos relacionados al pais: " + this.pais.nombre + " fueron eliminados");
    //     this.borrarPais.emit(this.pais);
    //   },
    //   (error) => {
    //     console.error("No se pudieron eliminar los contactos relacionados al pais: " + this.pais.nombre + ". " + error);
    //   }
    // )

  }

}
