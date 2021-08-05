import { Component, Input, OnInit } from '@angular/core';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  @Input() contacto: ContactoModule;
  pais:string;
  region:string;
  constructor(private contactoService: ContactoService) { }

  ngOnInit(): void {
    this.contactoService.obtenerRegion(this.contacto.id_ciudad).subscribe(
      (region:any) => {
        this.region = region[0].region;
        console.log("la region es: " + region[0].region);
        console.log(region[0].region);
      }
    );
    this.contactoService.obtenerPais(this.contacto.id_ciudad).subscribe(
      (pais:any) => {
        this.pais = pais[0].nombre;
        console.log("el pais es: " + pais[0].nombre);
        console.log(pais[0].nombre);
      }
    );
  }

}
