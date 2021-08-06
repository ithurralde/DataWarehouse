import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroModule } from '../filtro.module';
import { ContactoModule } from '../../contacto/contacto.module';
import { ContactoService } from 'src/app/servicios/contacto.service';


// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
export class FiltroRegionPaisModule extends FiltroModule{
  constructor(contactos: ContactoModule[], private contactofull:any[]/*private regionesPaises: any[], private contactoService: ContactoService*/){
    super(contactos);
  }

  public filtrar(element: string) {
    let resultado: any[] = [];
    let i = 0;
    if (element == "Todos")
      return this.contactos;
    this.contactofull.forEach(contacto => {
      if (contacto.pais == element || contacto.region == element)
        resultado.push(this.contactos[i]);
      i++;
    })
    return resultado;
  }
}
