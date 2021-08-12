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
    console.log(this.contactofull);
    if (element == "Todos")
      return this.contactos;
    
    for (let i=0; i < this.contactos.length; i++){
      this.contactofull.forEach(contacto => {
        if (this.contactos[i].nombre == contacto.contacto.nombre &&
            this.contactos[i].apellido == contacto.contacto.apellido){
              if (this.contactofull[i].pais == element /*|| this.contactofull[i].region == element*/)
                resultado.push(this.contactos[i]);
              else if (this.contactofull[i].region == element)
                resultado.push(this.contactos[i]);
              
        }
      });
    }
    return resultado;
  }
}
