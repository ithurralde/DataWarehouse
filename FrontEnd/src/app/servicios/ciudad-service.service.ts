import { Injectable } from '@angular/core';
import { CiudadModule } from '../model/ciudad/ciudad.module';
import { PaisModule } from '../model/pais/pais.module';
import { RegionModule } from '../model/region/region.module';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  constructor(private dbService: DataBaseServices) { }

  obtenerCiudades(pais: PaisModule){
    return this.dbService.obtenerCiudades(pais);
  }

  agregarCiudad(ciudad: CiudadModule, pais: PaisModule, region: RegionModule){
    return this.dbService.agregarCiudad(ciudad, pais, region);
  }

  borrarCiudad(ciudad: CiudadModule){
    return this.dbService.borrarCiudad(ciudad);
  }

  actualizarCiudad(ciudad: CiudadModule, pais: PaisModule){
    return this.dbService.actualizarCiudad(ciudad, pais);
  }
}
