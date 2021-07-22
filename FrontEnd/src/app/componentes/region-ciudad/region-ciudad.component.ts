import { Component, OnInit } from '@angular/core';
import { RegionModule } from 'src/app/model/region/region.module';
import { RegionService } from 'src/app/servicios/Region.service';

@Component({
  selector: 'app-region-ciudad',
  templateUrl: './region-ciudad.component.html',
  styleUrls: ['./region-ciudad.component.css']
})
export class RegionCiudadComponent implements OnInit {
  regiones: RegionModule[] = [];
  puedoAgregar = false;
  region: string;
  constructor(private regionService: RegionService) { }

  ngOnInit(): void {
    this.regionService.obtenerRegiones().subscribe(
      (regiones: RegionModule[]) => {
        this.regiones = regiones;
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }

  preAgregarRegion(){
    this.puedoAgregar = true;
  }

  agregarRegion(){
    this.puedoAgregar = false;
    console.log("Estoy agregando?");
    let region = new RegionModule(this.region);
    // let region = new RegionModule("holanda");
    console.log(this.region);
    this.regiones.push(region);
  }

}
