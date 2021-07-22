import { Injectable } from '@angular/core';
import { DataBaseServices } from './DataBase.service';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  constructor(private dbService: DataBaseServices) { }
}
