import { Component, OnInit } from '@angular/core';
import { RegionModule } from 'src/app/model/region/region.module';
import { DataBaseServices } from 'src/app/servicios/DataBase.service';
import { RegionService } from 'src/app/servicios/Region.service';

@Component({
  selector: 'app-region-ciudad',
  templateUrl: './region-ciudad.component.html',
  styleUrls: ['./region-ciudad.component.css']
})
export class RegionCiudadComponent implements OnInit {
  regiones: RegionModule[] = [];
  puedoAgregar:boolean = false;
  region: string;
  btn_add_cancel: string = "Agregar región";
  constructor(private regionService: RegionService) { }

  ngOnInit(): void {
    this.regionService.obtenerRegiones().subscribe(
      (regiones: any[]) => {
        console.log("las regiones que me da el back: ");
        console.log(regiones);
        // let i = 0;
        regiones.forEach(element => {
          this.regiones.push(new RegionModule(element.region));
          // i++;
        });
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }

  preAgregarRegion(){
    if (this.puedoAgregar){
      this.puedoAgregar = false;
      this.btn_add_cancel = "Agregar región";
      console.log("no tengo que estar entrando aca en la primera");
    }
    else{
      this.puedoAgregar = true;
      this.btn_add_cancel = "Cancelar";
    }
  }

  agregarRegion(){
    this.puedoAgregar = false;
    let region = new RegionModule(this.region);
    this.regiones.push(region);
    this.regionService.agregarRegion(region).subscribe(
      ()=> { console.log("Agregada la region " + region.nombre + " a la BD.")}
    );
  }

}
