import { Injectable } from '@angular/core';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private dbService: DataBaseServices) { }

  obtenerRegiones(){
    return this.dbService.obtenerRegiones();
  }
}
