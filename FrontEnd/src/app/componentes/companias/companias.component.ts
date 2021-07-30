import { Component, OnInit } from '@angular/core';
import { CompaniaModule } from 'src/app/model/compania/compania.module';
import { CompaniaService } from 'src/app/servicios/compania.service';

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
  constructor(private companiaService: CompaniaService) { }

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
}
