import { Injectable, OnInit } from '@angular/core';
import { RegionModule } from '../model/region/region.module';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService implements OnInit{
  regiones: RegionModule[];

  constructor(private dbService: DataBaseServices) {
    
   }

  ngOnInit(){
    this.obtenerRegiones().subscribe(
      (regiones: RegionModule[]) => {
        this.regiones = regiones;
        console.log("[Region.service] que onda con esto, lo carga o no lo carga?")
        console.log(this.regiones)
      }
    )
  }

  obtenerRegiones(){
    return this.dbService.obtenerRegiones();
  }

  agregarRegion(region: RegionModule){
    return this.dbService.agregarRegion(region);
  }
}
