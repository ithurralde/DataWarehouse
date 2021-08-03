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
}
