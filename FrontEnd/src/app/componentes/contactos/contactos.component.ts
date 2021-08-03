import { Component, OnInit } from '@angular/core';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';
import { ContactoService } from 'src/app/servicios/contacto.service';
// import { Usuario } from 'src/app/model/Usuario.model';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {
  // usuarios: Usuario[] = [];
  contactos: ContactoModule[] = [];
  filtroContactos: ContactoModule[] = [];
  desplegable:boolean;
  selector:boolean;
  crear:boolean;
  test: string[] = [];

  nombreContacto:string;
  cargo:string;
  pais:string;
  compania:string;
  canal:string;
  interes:string;
  constructor(private contactoService: ContactoService) { }

  ngOnInit(): void {
    this.test.push("Raul");
    this.test.push("Santiago");
    this.test.push("Brenda");
    this.test.push("Lucho");
    this.test.push("Jose");
    this.test.push("Melissa");
    this.contactoService.obtenerContactos().subscribe(
      (contactos: ContactoModule[]) => {
        this.contactos = contactos;
        this.filtroContactos = contactos;
        console.log("contactos");
        console.log(contactos);
      }
    );
  }

  desplegarInput(){
    if (this.desplegable)
      this.desplegable = false;
    else{
      this.desplegable = true;
      // this.nombreContacto = "Todos";
      // this.cargo = "Todos";
      this.pais = "Todos";
      this.compania = "Todos";
      this.canal = "Todos";
      this.interes = "Todos";
    }
  }

  cargarInput(){
    // ejecuta el input, bd
    console.log("Ejecutando...");
    console.log("Nombre del contacto: " + this.nombreContacto);
    console.log("Cargo: " + this.cargo);
    console.log("Pais/region: " + this.pais);
    console.log("Compañia: " + this.compania);
    console.log("Canal favorito: " + this.canal);
    console.log("Interes: " + this.interes);
  }

  agregar(){
    let html = document.querySelector<HTMLElement>(".body");
    if (this.crear && html){
      this.crear = false;
      html.style.backgroundColor = "transparent";
      // html.style.opacity = "1";
    }
    else if (html){
      this.crear = true;
      this.desplegable = false;
      html.style.backgroundColor = "gray";
      // html.style.opacity = "0.4";
    }
  }

  cerrarVentana(bool: boolean){
    let html = document.querySelector<HTMLElement>(".body");
    this.crear = bool;
    if (html)
      html.style.backgroundColor = "transparent";
  }

  cargarRegiones(){
    let compania = document.querySelector<HTMLSelectElement>(".region");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.test[compania.selectedIndex-1]);
      this.pais = this.test[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

  cargarCompanias(){
    let compania = document.querySelector<HTMLSelectElement>(".compania");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.test[compania.selectedIndex-1]);
      this.compania = this.test[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

  cargarCanalFav(){
    let compania = document.querySelector<HTMLSelectElement>(".canal");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.test[compania.selectedIndex-1]);
      this.canal = this.test[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

  cargarInteres(){
    let compania = document.querySelector<HTMLSelectElement>(".interes");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.test[compania.selectedIndex-1]);
      this.interes = this.test[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

}
