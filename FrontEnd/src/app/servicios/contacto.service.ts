import { Injectable } from '@angular/core';
import { CompaniaModule } from '../model/compania/compania.module';
import { ContactoModule } from '../model/contacto/contacto.module';
import { PaisModule } from '../model/pais/pais.module';
import { RegionModule } from '../model/region/region.module';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private dbServices: DataBaseServices) { }

  obtenerContactos(){
    return this.dbServices.obtenerContactos();
  }

  obtenerRegiones(){
    return this.dbServices.obtenerRegiones();
  }

  obtenerRegion(id_ciudad:number){
    return this.dbServices.obtenerRegion(id_ciudad);
  }

  obtenerPaises(region:string){
    return this.dbServices.obtenerPaises(new RegionModule(region));
  }

  obtenerPais(id_ciudad:number){
    return this.dbServices.obtenerPais(id_ciudad);
  }

  obtenerCiudades(pais:string){
  return this.dbServices.obtenerCiudades(new PaisModule(pais));
  }

  obtenerIdCiudad(ciudad:string){
    return this.dbServices.obtenerIdCiudad(ciudad);
  }

  obtenerCompanias(){
    return this.dbServices.obtenerCompanias();
  }

  crearContacto(contacto: ContactoModule){
    return this.dbServices.crearContacto(contacto);
  }

  getCanales(contacto: ContactoModule){
    return this.dbServices.getCanalesContacto(contacto);
  }
}
