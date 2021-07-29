import { Injectable } from '@angular/core';
import { CiudadModule } from '../model/ciudad/ciudad.module';
import { actPaisModule } from '../model/pais/actPais.module';
import { PaisModule } from '../model/pais/pais.module';
import { RegionModule } from '../model/region/region.module';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})

export class PaisService {
  paises: PaisModule[] = [];
  region: RegionModule;

  constructor(private dbService: DataBaseServices) { 
    // this.obtenerPaises(this.region).subscribe(
    //   (paises: PaisModule[]) => {
    //     this.paises = paises;
    //   }
    // );
  }

  obtenerPaises(region: RegionModule){
    return this.dbService.obtenerPaises(region);
  }

  agregarPais(region:RegionModule, pais: PaisModule){
    this.paises.push(pais);
    return this.dbService.agregarPais(region, pais);
  }

  borrarPais(pais: PaisModule){
    return this.dbService.borrarPais(pais);
  }

  actualizarPais(region: RegionModule, pais: actPaisModule){
    return this.dbService.actualizarPais(region, pais);
  }
}
