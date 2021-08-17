import { Injectable } from '@angular/core';
import { CompaniaAnteriorModule } from '../model/compania/compania-anterior.module';
import { CompaniaModule } from '../model/compania/compania.module';
import { PaisModule } from '../model/pais/pais.module';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniaService {

  constructor(private dbService: DataBaseServices) { }

  obtenerCompanias(){
    return this.dbService.obtenerCompanias();
  }

  agregar(compania: CompaniaModule){
    return this.dbService.agregarCompania(compania);
  }

  borrarCompania(compania: CompaniaModule){
    return this.dbService.borrarCompania(compania);
  }

  borrarCompaniaPais(compania: string){
    return this.dbService.borrarCompaniaPais(compania);
  }

  borrarCompaniaRegion(pais: string){
    return this.dbService.borrarCompaniaRegion(pais);
  }

  editarCompania(compania_ant: CompaniaAnteriorModule){
    return this.dbService.editarCompania(compania_ant);
  }

  obtenerCiudades(){
    return this.dbService.obtenerTodasCiudades();
  }
}
