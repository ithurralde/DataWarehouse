import { Component, OnInit } from '@angular/core';
import { CanalModule } from 'src/app/model/canal/canal.module';
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

  // los datos que necesito para saber por que ordenar o filtrar
  regionesPaises: any[] = [];
  companias: string[] = [];
  canales: string[] = [];
  intereses: number[] = [];

  // los datos que obtengo del filtro desplegable
  nombreContacto:string;
  cargo:string;
  pais:string;
  compania:string;
  canal:string;
  interes:number;
  constructor(private contactoService: ContactoService) { }

  ngOnInit(): void {
    this.contactoService.obtenerContactos().subscribe(
      (contactos: ContactoModule[]) => {
        // this.contactos = contactos;
        // this.filtroContactos = contactos;
        
        console.log("contactos");
        console.log(contactos);
      }
    );
    this.filtroContactos.push(new ContactoModule("Bren", "Wayne", "Senior", "andatealaremierda1994@gmail.com", "TeraCode", "Alberdi 1008", 25, [new CanalModule("Facebook", "www.facebook.com/bren", "Sin preferencia"), new CanalModule("Bobita", "www.whatsapp.com/aagus", "TuVieja")], "Sin preferencia", 19),
                                  new ContactoModule("Alicia", "Maravilla", "UX Designer","as@gmail.com", "Grupo Assa", "Paz 451", 50, [new CanalModule("LinkedIn", "www.LinkedIn.com/alicia", "LinkedIn")], "LinkedIn", 5),
                                  new ContactoModule("Agus", "Ggrz", "UI Designer", "aasd@gmail.com", "Sony", "Alberdi 1008", 25, [new CanalModule("Twitter", "www.twitter.com/aagus", "Twitter")], "Twitter", 6),
                                  new ContactoModule("Dark", "Souls", "Product","ads@gmail.com", "TeraCode", "Alberdi 1008", 0, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], "LinkedIn", 15),
                                  new ContactoModule("Argentum", "Onlain", "Developer", "afd@gmail.com", "TeraCode", "9 de julio 52", 100, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], "LinkedIn", 13),
                                  new ContactoModule("Devil", "MayCry",  "Developer","agg@gmail.com", "Sony", "Locura automatica 1545", 75, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], "LinkedIn", 19),
                                  new ContactoModule("AgeOf", "Empires",  "Sales","ahg@gmail.com", "Globant", "High 956", 0, [new CanalModule("TuVieja", "www.whatsapp.com/aagus", "TuVieja")], "TuVieja", 19));
    
    this.contactos = this.filtroContactos;
    this.contactos.forEach(element => {

      // agrego paises y regiones
      this.contactoService.obtenerRegion(element.id_ciudad).subscribe(
        (region: any) => {
          let existe = false;
          this.regionesPaises.forEach(regionPais => {
            if (regionPais == region[0].region)
              existe = true;
          });
          if (!existe)
            this.regionesPaises.push(region[0].region);    
          this.regionesPaises = this.regionesPaises.sort();      
        }
      );

      this.contactoService.obtenerPais(element.id_ciudad).subscribe(
        (pais: any) => {
          let existe = false;
          this.regionesPaises.forEach(regionPais => {
            if (regionPais == pais[0].nombre)
              existe = true;
          });
          if (!existe)
            this.regionesPaises.push(pais[0].nombre); 
          this.regionesPaises = this.regionesPaises.sort();
        }
      );

      // agrego companias
      let existe = false;
      this.companias.forEach(compania => {
        if (compania == element.compania)
          existe = true;
      });
      if (!existe){
        this.companias.push(element.compania);
        this.companias = this.companias.sort();
      }

      // agrego canales
      existe = false;

      element.canal.forEach(canalElement => {
          this.canales.push(canalElement.canal);
        });

      // elimina los repetidos
      this.canales = this.canales.filter((item, index) => {
        return this.canales.indexOf(item) == index;
      });

      this.canales = this.canales.sort();

      

      // agrego intereses
      existe = false;
      this.intereses.forEach(interes => {
        if (interes == element.interes)
          existe = true;
      });


      if (!existe){
        this.intereses.push(element.interes);
    }
      this.intereses = this.intereses.sort((n1, n2) => n1 - n2);
      existe = false;
    });

    
    
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
      this.interes = 0;
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
      console.log("Hubo un click! " + this.regionesPaises[compania.selectedIndex-1]);
      this.pais = this.regionesPaises[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

  cargarCompanias(){
    let compania = document.querySelector<HTMLSelectElement>(".compania");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.companias[compania.selectedIndex-1]);
      this.compania = this.companias[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

  cargarCanalFav(){
    let compania = document.querySelector<HTMLSelectElement>(".canal");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.canales[compania.selectedIndex-1]);
      this.canal = this.canales[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

  cargarInteres(){
    let compania = document.querySelector<HTMLSelectElement>(".interes");
    if (this.selector && compania){
      console.log("Hubo un click! " + this.intereses[compania.selectedIndex-1]);
      this.interes = this.intereses[compania.selectedIndex-1];
      this.selector = false;
    }
    else
      this.selector=true;
  }

}
