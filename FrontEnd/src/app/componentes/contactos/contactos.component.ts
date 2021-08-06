import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { CanalModule } from 'src/app/model/canal/canal.module';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';
import { FiltroCargoModule } from 'src/app/model/filtro/filtro-cargo/filtro-cargo.module';
import { FiltroCompaniaModule } from 'src/app/model/filtro/filtro-compania/filtro-compania.module';
import { FiltroNombreContactoModule } from 'src/app/model/filtro/filtro-nombre-contacto/filtro-nombre-contacto.module';
import { FiltroRegionPaisModule } from 'src/app/model/filtro/filtro-region-pais/filtro-region-pais.module';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {
  contactos: ContactoModule[] = []; // Son todos los contactos que hay en la base de datos
  filtroContactos: any[] = []; // Es lo que se muestra siempre, cuando no hay filtros es igual a contactos
  desplegable:boolean; // es el desplegable para el filtro
  selector:boolean;
  crear:boolean;
  ocultar:boolean; // oculta un bug de los <i> de fontawesome cuando bajaba el despegable

  // los datos que necesito para saber por que ordenar o filtrar
  regionesPaises: any[] = [];
  companias: string[] = [];
  canales: string[] = [];
  intereses: number[] = [];
  contactoFull:any[] = [] // tiene datos importantes de cada contacto y el nombre de pais y de region. Lo necesito
                          // para filtrar por region o pais (para no volver a llamar a la base de datos, teniendo
                          // los datos en memoria)

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
                                  new ContactoModule("Agus", "Ggrz", "UI Designer", "afNombreAp@gmail.com", "Sony", "Alberdi 1008", 25, [new CanalModule("Twitter", "www.twitter.com/aagus", "Twitter")], "Twitter", 6),
                                  new ContactoModule("Dark", "Souls", "Product","ads@gmail.com", "TeraCode", "Alberdi 1008", 0, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], "LinkedIn", 15),
                                  new ContactoModule("Argentum", "Onlain", "Developer", "afd@gmail.com", "TeraCode", "9 de julio 52", 100, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], "LinkedIn", 13),
                                  new ContactoModule("Devil", "MayCry",  "Developer","agg@gmail.com", "Sony", "Locura automatica 1545", 75, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], "LinkedIn", 19),
                                  new ContactoModule("AgeOf", "Empires",  "Sales","ahg@gmail.com", "Globant", "High 956", 0, [new CanalModule("TuVieja", "www.whatsapp.com/aagus", "TuVieja")], "TuVieja", 19));
    
    this.contactos = this.filtroContactos;
    this.contactos.forEach(element => {

      // agrego paises y regiones
      this.obtenerRegion(element);
      this.obtenerPais(element);

      // agrego companias
      this.agregarCompanias(element);

      // agrego canales
      this.agregarCanales(element);

      // agrego intereses
      this.agregarIntereses(element);
    }); 
  }

  obtenerRegion(element: ContactoModule){
    this.contactoService.obtenerRegion(element.id_ciudad).subscribe(
      (region: any) => {
        let existe = false;
        this.regionesPaises.forEach(regionPais => {
          if (regionPais == region[0].region)
            existe = true;
        });
        if (!existe)
          this.regionesPaises.push(region[0].region);
        this.contactoFull.push({
          "contacto": {
            "nombre": element.nombre,
            "apellido": element.apellido,
            "ciudad": element.id_ciudad
          },
          "pais" : "null",
          "region": region[0].region
        });
        
        this.regionesPaises = this.regionesPaises.sort();      
      }
    );
  }

  obtenerPais(element: ContactoModule){
    this.contactoService.obtenerPais(element.id_ciudad).subscribe(
      (pais: any) => {
        let existe = false;
        this.regionesPaises.forEach(regionPais => {
          if (regionPais == pais[0].nombre)
            existe = true;
        });
        if (!existe)
          this.regionesPaises.push(pais[0].nombre); 
        this.contactoFull.forEach(full => {
          if (full.contacto.nombre == element.nombre &&
              full.contacto.apellido == element.apellido &&
              full.contacto.ciudad == element.id_ciudad)
            full.pais = pais[0].nombre;
        })

        this.regionesPaises = this.regionesPaises.sort();
      }
    );
  }

  agregarCompanias(element: ContactoModule){
    let existe = false;
    this.companias.forEach(compania => {
      if (compania == element.compania)
        existe = true;
    });
    if (!existe){
      this.companias.push(element.compania);
      this.companias = this.companias.sort();
    }
  }

  agregarCanales(element: ContactoModule){
    element.canal.forEach(canalElement => {
        this.canales.push(canalElement.canal);
      });

    // elimina los repetidos
    this.canales = this.canales.filter((item, index) => {
      return this.canales.indexOf(item) == index;
    });

    this.canales = this.canales.sort();
  }

  agregarIntereses(element: ContactoModule){
    let existe = false;
    this.intereses.forEach(interes => {
      if (interes == element.interes)
        existe = true;
    });


    if (!existe){
      this.intereses.push(element.interes);
    }
    this.intereses = this.intereses.sort((n1, n2) => n1 - n2);
  }

  desplegarInput(){
    if (this.desplegable){
      this.desplegable = false;
      console.log("que paso con pais? " + this.pais);
    }
    else{
      this.desplegable = true;
      let compania = document.querySelector<HTMLSelectElement>(".region");
      if (compania){
        compania.name = "fNombreApfNombreApfNombreAp";
        console.log("compania");
        console.log(compania.selectedIndex);
        // console.log(compania.nodeName)
      }
      this.nombreContacto /*= "Todos"*/;
      this.cargo/* = "Todos"*/;
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

    // nombre apellido
    console.log(this.contactos);
    let filtro = new FiltroNombreContactoModule(this.contactos);
    this.filtroContactos = [];
    this.filtroContactos = filtro.filtrar(this.nombreContacto);

    // region pais
    let filtro2 = new FiltroRegionPaisModule(this.contactos, this.contactoFull);
    // this.filtroContactos = [];
    // this.filtroContactos = filtro2.filtrar(this.pais);

    let filtro3 = new FiltroCargoModule(this.contactos);
    // this.filtroContactos = [];
    // this.filtroContactos = filtro3.filtrar(this.cargo);
    let filtro4 = new FiltroCompaniaModule(this.contactos);
    // this.filtroContactos = [];
    this.filtroContactos = filtro4.filtrar(this.compania);
    console.log("los filtros: ");
    console.log(this.filtroContactos);
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
      if (this.regionesPaises[compania.selectedIndex-1] != undefined){
        this.pais = this.regionesPaises[compania.selectedIndex-1];
        console.log("Hubo un click! " + this.regionesPaises[compania.selectedIndex-1]);
      }
      else {this.pais = "Todos";
            console.log("Hubo un click! Todos");}
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
