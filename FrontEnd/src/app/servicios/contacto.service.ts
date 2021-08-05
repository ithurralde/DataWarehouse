import { Injectable } from '@angular/core';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private dbServices: DataBaseServices) { }

  obtenerContactos(){
    return this.dbServices.obtenerContactos();
  }

  obtenerRegion(id_ciudad:number){
    return this.dbServices.obtenerRegion(id_ciudad);
  }

  obtenerPais(id_ciudad:number){
    return this.dbServices.obtenerPais(id_ciudad);
  }
}
