import { Component, OnInit } from '@angular/core';
import { CompaniaAnteriorModule } from 'src/app/model/compania/compania-anterior.module';
import { CompaniaModule } from 'src/app/model/compania/compania.module';
import { CompaniaService } from 'src/app/servicios/compania.service';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-companias',
  templateUrl: './companias.component.html',
  styleUrls: ['./companias.component.css']
})
export class CompaniasComponent implements OnInit {
  companias: CompaniaModule[] = [];
  nombre:string;
  direccion:string;
  email:string;
  telefono:string;
  ciudad:string;
  editable:boolean;
  constructor(private companiaService: CompaniaService, private contactoService: ContactoService) { }

  ngOnInit(): void {
    this.companiaService.obtenerCompanias().subscribe(
      (companias: any) => {
        let i = 0;
        console.log("companias tamaño");
        console.log(companias.ciudades.length);
        for (let i = 0; i < companias.ciudades.length /*&& companias.ciudades.length === companias.companias.length*/; i++){
          this.companias.push(new CompaniaModule(companias.companias[i].nombre, companias.companias[i].direccion,
                                                companias.companias[i].email, companias.companias[i].telefono,
                                                companias.ciudades[i][0].nombre));

          console.log(companias.companias[i].nombre);
          console.log(companias.ciudades[i][0].nombre);
          console.log("el tamaño del i cajeta este es de: " + i);
        }
        // this.companias = companias;
      }
    );
  }

  cargar(){
    if (this.editable)
      this.editable = false;
    else
      this.editable = true;
  }

  agregar(){
    this.editable = false;
    let compania = new CompaniaModule(this.nombre, this.direccion, this.email, this.telefono, this.ciudad)
    console.log(this.ciudad);
    this.companiaService.agregar(compania).subscribe(
      () => {
        console.log("Compañia " + compania.nombre + " agregada.")
        this.companias.push(compania);
      }
    );
  }

  delete(compania: CompaniaModule){
    for (let i = 0; i < this.companias.length; i++){  
      if (this.companias[i] == compania)  
        this.companiaService.borrarCompania(compania).subscribe(
          () => {
            console.log("Compañia " + compania + " borrada con exito.");
            this.companias.splice(i, 1);
            // this.contactoService.borrarContactosCompania(compania).subscribe(
            //   () => {
            //     console.log("Los contactos relacionados a la compania: " + compania.nombre + " fueron eliminados.");
            //   },
            //   (error) => {
            //     console.error("No se pudieron eliminar los contactos relacionados a la compañia: " + compania.nombre + ". " + error);
            //   }
            // )
          }
        );
    }
  }

  update(compania_ant: CompaniaAnteriorModule){
    for (let i = 0; i < this.companias.length; i++){  
      if (this.companias[i].nombre == compania_ant.nombre &&
          this.companias[i].direccion == compania_ant.direccion &&
          this.companias[i].email == compania_ant.email &&
          this.companias[i].telefono == compania_ant.telefono &&
          this.companias[i].ciudad == compania_ant.ciudad){
              this.companiaService.editarCompania(compania_ant).subscribe(
                () => {
                  console.log("Compañia " + compania_ant + " editada con exito.");
                  this.companias[i] = new CompaniaModule(compania_ant.nombre, compania_ant.direccion, 
                                                        compania_ant.email, compania_ant.telefono, compania_ant.ciudad);
                }
              );
            }
    }
  }
}
