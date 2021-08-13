import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { CanalModule } from 'src/app/model/canal/canal.module';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';
import { FiltroCanalModule } from 'src/app/model/filtro/filtro-canal/filtro-canal.module';
import { FiltroCargoModule } from 'src/app/model/filtro/filtro-cargo/filtro-cargo.module';
import { FiltroCompaniaModule } from 'src/app/model/filtro/filtro-compania/filtro-compania.module';
import { FiltroInteresModule } from 'src/app/model/filtro/filtro-interes/filtro-interes.module';
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
  eliminarSeleccionados:boolean; // boolean para saber si hay que mostrar eliminar contactos seleccionados
  contactosSeleccionados: ContactoModule[] = [];
  ordenAscendente:boolean = true; // orden en el click de las flechitas

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

        this.contactos = contactos;
        this.filtroContactos = contactos;
        // this.contactos = this.filtroContactos;
        this.contactos.forEach(async element=> {

          // agrego paises y regiones
          this.obtenerRegion(element);
          // this.obtenerPais(element);
    
          // agrego companias
          this.agregarCompanias(element);
    
          // agrego canales
          this.agregarCanales(element);
    
          // agrego intereses
          this.agregarIntereses(element);
        }); 
        
        console.log("contactos");
        console.log(contactos);
      }
    );
    // this.filtroContactos.push(new ContactoModule("Bren", "Wayne", "Senior", "andatealaremierda1994@gmail.com", "TeraCode", "Alberdi 1008", 0.25, [new CanalModule("Facebook", "www.facebook.com/bren", "Sin preferencia"), new CanalModule("Bobita", "www.whatsapp.com/aagus", "TuVieja")], 19),
    //                               new ContactoModule("Alicia", "Maravilla", "UX Designer","as@gmail.com", "Grupo Assa", "Paz 451", 0.50, [new CanalModule("LinkedIn", "www.LinkedIn.com/alicia", "LinkedIn")], 5),
    //                               new ContactoModule("Agus", "Ggrz", "UI Designer", "afNombreAp@gmail.com", "Sony", "Alberdi 1008", 0.25, [new CanalModule("Twitter", "www.twitter.com/aagus", "Twitter")], 6),
    //                               new ContactoModule("Dark", "Souls", "Product","ads@gmail.com", "TeraCode", "Alberdi 1008", 0, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], 15),
    //                               new ContactoModule("Argentum", "Onlain", "Developer", "afd@gmail.com", "TeraCode", "9 de julio 52", 1, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], 13),
    //                               new ContactoModule("Devil", "MayCry",  "Developer","agg@gmail.com", "Sony", "Locura automatica 1545", 0.75, [new CanalModule("Whatsapp", "www.whatsapp.com/aagus", "LinkedIn")], 19),
    //                               new ContactoModule("AgeOf", "Empires",  "Sales","ahg@gmail.com", "Globant", "High 956", 0.5, [new CanalModule("TuVieja", "www.whatsapp.com/aagus", "TuVieja")], 19));
  }

  obtenerRegion(element: ContactoModule){
    this.contactoService.obtenerRegion(element.id_ciudad).subscribe(
      (region: any) => {
        let existe = false;
        this.regionesPaises.forEach(regionPais => {
          if (regionPais == region[0].region)
            existe = true;
        });
        if (!existe){
          this.regionesPaises.push(region[0].region);
        }
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
        this.obtenerPais(element);    
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
        if (!existe){
          this.regionesPaises.push(pais[0].nombre); 
        }
        this.contactoFull.forEach(full => {
          if (full.contacto.nombre == element.nombre &&
              full.contacto.apellido == element.apellido &&
              full.contacto.ciudad == element.id_ciudad){
            full.pais = pais[0].nombre;
              }
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

  // contacto viene de la BD y tiene el id. element es el contacto de la BD tambien, pero al ser de tipo ContactoModule
  // no tengo el id
  agregarCanales(element: ContactoModule){
    this.contactoService.getCanales(element).subscribe(
      (canales: any[]) => {
        element.canal = [];
        if (canales.length != 0){
          canales.forEach(canal => {
            console.log(canal);
            element.canal.push(new CanalModule(canal[0].canal, canal[0].cuenta_usuario, canal[0].preferencia));
          });
        }
        console.log("el canal %o tiene %o canales", element, element.canal);
      }
    );

      
  
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
      this.nombreContacto /*= "Todos"*/;
      this.cargo/* = "Todos"*/;
      this.pais = "Todos";
      this.compania = "Todos";
      this.canal = "Todos";
      this.interes = -1;
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

    
    console.log(this.contactos);
    this.filtroContactos = this.contactos;

    // filtro nombre apellido
    let filtro = new FiltroNombreContactoModule(this.filtroContactos);
    console.log("filtro completo: ");
    console.log(this.filtroContactos);
    console.log(this.nombreContacto)
    this.filtroContactos = filtro.filtrar(this.nombreContacto);
    console.log("filtro por nombre: ");
    console.log(this.filtroContactos);

    console.log("contactos full antes de filtrar");
    console.log(this.contactoFull);

    // filtro region pais
    let filtro2 = new FiltroRegionPaisModule(this.filtroContactos, this.contactoFull);

    this.filtroContactos = filtro2.filtrar(this.pais);
    console.log("filtro por region pais: ");
    console.log(this.filtroContactos);
    console.log("contactos full despues de filtrar");
    console.log(this.contactoFull);
  
    // filtro cargo
    let filtro3 = new FiltroCargoModule(this.filtroContactos);

    this.filtroContactos = filtro3.filtrar(this.cargo);
    console.log("filtro por cargo: ");
    console.log(this.filtroContactos);

    // filtro companias
    let filtro4 = new FiltroCompaniaModule(this.filtroContactos);

    this.filtroContactos = filtro4.filtrar(this.compania);
    console.log("filtro por compania: ");
    console.log(this.filtroContactos);


    // filtro intereses
    let filtro5 = new FiltroInteresModule(this.filtroContactos);
    this.filtroContactos = filtro5.filtrar(this.interes);
    console.log("filtro por interes: ");
    console.log(this.filtroContactos);

    // filtro canales
    let filtro6 = new FiltroCanalModule(this.filtroContactos);
    this.filtroContactos = filtro6.filtrar(this.canal);
    console.log("filtro por canales: ");
    console.log(this.filtroContactos);
  }

  // vista de agregar contacto
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

  crearContacto(contacto:ContactoModule){
    this.contactoService.crearContacto(contacto).subscribe(
      () => {
        this.contactos.push(contacto);
      }
    )
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

  // elimina un contacto a la vez
  eliminarContacto(contacto: ContactoModule){
    // aca tendria que pegarle a la BD para borrar los contactos de a uno
    console.log("contacto a eliminar: ");
    console.log(contacto);
    this.contactos.forEach((element, index) => {
      if (element == contacto)
        this.contactos.splice(index,1);
    });

    // agrego este foreach por si elimina uno en los filtrados, 
    // ya que los filtrados no tienen el mismo arreglo (si borra, pero no muestra que lo borra)
    // para que lo muestre habria que actualizar la pagina, con este foreach no es necesario actualizar
    this.filtroContactos.forEach((element, index) => {
      if (element == contacto)
        this.filtroContactos.splice(index,1);
    })
    this.eliminarSeleccionados = false;
  }

  // elimina todos los contactos seleccionados
  eliminarContactos(){
    let check = document.querySelector<HTMLInputElement>(".globalCheck");
    if (check)
      check.checked = false;
    this.contactosSeleccionados.forEach(contacto => {
      this.eliminarContacto(contacto);
    });
  }

  // precarga los contactos seleccionados para eliminarlos
  cargarEliminarContactos(contacto: ContactoModule){
    this.eliminarSeleccionados = true;
    let checks = document.querySelectorAll<HTMLInputElement>(".check");
    if (checks)
      checks.forEach((check, index) => {
        console.log(check.checked + ", " + check.name);
        if (check.checked==false){
          if (this.filtroContactos[index] == contacto){
            let i = 0;
            while (this.filtroContactos[index] != this.contactosSeleccionados[i])
              i++;
            this.contactosSeleccionados.splice(i, 1);
          }
        }
        else if (check.name == contacto.email){
          if (!this.existe(this.contactosSeleccionados, contacto)){
            this.contactosSeleccionados.push(contacto);
          }
          console.log(this.contactosSeleccionados);
        }
      });
  }

  existe(arreglo:ContactoModule[], dato:ContactoModule){
    let resultado = false;
    arreglo.forEach(elemento => {
      if (dato == elemento)
        resultado = true;
    });
    return resultado;
  }

  seleccionarTodos(){
    let checks = document.querySelectorAll<HTMLInputElement>(".check");
    if (checks)
      if (!this.eliminarSeleccionados){
      this.eliminarSeleccionados = true;
      this.filtroContactos.forEach(contacto => {
        this.contactosSeleccionados.push(contacto);
      });
        checks.forEach(check => {
          check.checked = true;
        });
      }
      else{
        this.eliminarSeleccionados = false;
        checks.forEach(check => {
          check.checked = false;
        });
        this.contactosSeleccionados = [];
      }
  }

  ordenar(dato:string){
    switch(dato){
      case 'contactos':
        this.ordenarContactos();
        break;
      case 'regionpais':
        this.ordenarRegionPais();
        break;
      case 'compania':
        this.ordenarCompania();
        break;
      case 'cargo':
        this.ordenarCargo();
        break;
      case 'interes':
        this.ordenarInteres();
        break;
      default:
        console.log("No se pudo ordenar por " + dato);
    }
  }

  cambiarOrden(){
    return this.ordenAscendente ? false : true;
  }

  ordenarContactos(){
    this.ordenAscendente = this.cambiarOrden();
    for (let i = 0; i < this.filtroContactos.length; i++)
      for (let j = i+1; j < this.filtroContactos.length; j++){
        // debugger;
        if (this.ordenAscendente){
          if (this.filtroContactos[i].nombre > this.filtroContactos[j].nombre){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
        else{
          if (this.filtroContactos[i].nombre < this.filtroContactos[j].nombre){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
      }
  }

  ordenarRegionPais(){
    this.ordenAscendente = this.cambiarOrden();
    for (let i = 0; i < this.filtroContactos.length; i++)
      for (let j = i; j < this.filtroContactos.length; j++){
        // debugger;
        if (this.ordenAscendente){
          if (this.filtroContactos[i].id_ciudad > this.filtroContactos[j].id_ciudad){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
        else{
          if (this.filtroContactos[i].id_ciudad < this.filtroContactos[j].id_ciudad){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
      }
  }

  ordenarCompania(){
    this.ordenAscendente = this.cambiarOrden();
    for (let i = 0; i < this.filtroContactos.length; i++)
      for (let j = i; j < this.filtroContactos.length; j++){
        // debugger;
        if (this.ordenAscendente){
          if (this.filtroContactos[i].compania > this.filtroContactos[j].compania){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
        else{
          if (this.filtroContactos[i].compania < this.filtroContactos[j].compania){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
      }
  }

  ordenarCargo(){
    this.ordenAscendente = this.cambiarOrden();
    for (let i = 0; i < this.filtroContactos.length; i++)
      for (let j = i; j < this.filtroContactos.length; j++){
        // debugger;
        if (this.ordenAscendente){
          if (this.filtroContactos[i].cargo > this.filtroContactos[j].cargo){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
          else{
            if (this.filtroContactos[i].cargo < this.filtroContactos[j].cargo){
              let contacto_auxiliar = this.filtroContactos[i];
              this.filtroContactos[i] = this.filtroContactos[j];
              this.filtroContactos[j] = contacto_auxiliar;
            }
          }
      }
  }

  ordenarInteres(){
    this.ordenAscendente = this.cambiarOrden();
    for (let i = 0; i < this.filtroContactos.length; i++)
      for (let j = i+1; j < this.filtroContactos.length; j++){
        // debugger;
        if (this.ordenAscendente){
          if (this.filtroContactos[i].interes > this.filtroContactos[j].interes){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
        else{
          if (this.filtroContactos[i].interes < this.filtroContactos[j].interes){
            let contacto_auxiliar = this.filtroContactos[i];
            this.filtroContactos[i] = this.filtroContactos[j];
            this.filtroContactos[j] = contacto_auxiliar;
          }
        }
      }
  }
}
