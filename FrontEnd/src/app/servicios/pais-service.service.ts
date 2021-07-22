import { Injectable } from '@angular/core';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(private dbService: DataBaseServices) { }

  obtenerPaises(){
    return this.dbService.obtenerPaises();
  }
}
