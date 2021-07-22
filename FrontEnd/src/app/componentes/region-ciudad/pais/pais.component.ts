import { Component, Input, OnInit } from '@angular/core';
import { CiudadModule } from 'src/app/model/ciudad/ciudad.module';
import { PaisModule } from 'src/app/model/pais/pais.module';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {
  @Input() pais: PaisModule;
  @Input() borrarCiudad: CiudadModule;
  ciudades: CiudadModule[] = [];
  ciudad: string;
  puedoAgregar = false;
  constructor() { }

  ngOnInit(): void {
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
    this.ciudades.push(ciudad);
  }

  delete(ciudad: CiudadModule){
    for (let i = 0; i < this.ciudades.length; i++){
      console.log(this.ciudades[i].nombre);
      console.log(ciudad.nombre);
      if (this.ciudades[i] === ciudad)
          this.ciudades.splice(i,1);
    }
  }
}
