import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanalModule } from 'src/app/model/canal/canal.module';
import { CompaniaModule } from 'src/app/model/compania/compania.module';
import { ContactoModule } from 'src/app/model/contacto/contacto.module';
import { RegionModule } from 'src/app/model/region/region.module';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-crear-contacto',
  templateUrl: './crear-contacto.component.html',
  styleUrls: ['./crear-contacto.component.css']
})
export class CrearContactoComponent implements OnInit {
  @Output() cerrarVentana = new EventEmitter();
  @Output() crearContacto = new EventEmitter();
  @Input() contactos:ContactoModule[] = [];
  // datos de regiones, paises y ciudades:
  regiones:string[] = [];
  regionElegida:string;
  paises:string[] = [];
  paisElegido:string;
  ciudades:string[] = [];
  ciudadElegida:string;
  // fin datos de regiones, paises y ciudades

  companias: string[] = [];

  @Input() nombre:string;
  @Input() apellido:string;
  @Input() cargo:string;
  @Input() email:string;
  @Input() compania:string;
  @Input() direccion:string;
  @Input() interes:number;  
  @Input() canal:CanalModule[] = [];
  // datos particulares para cada canal
  nombreCanal:string;
  cuentaUsuario:string;
  preferencia:string;
  // fin de los datos particulares para cada canal
  id_ciudad:number;

  // los pasos para ir habilitando las categorias: cuenta de usuario, 
  // preferencias y el boton de agregar canal
  paso1:boolean;
  paso2:boolean;
  paso3:boolean;
  constructor(private contactoService: ContactoService) { }

  ngOnInit(): void {
    this.cargarRegiones();
    this.cargarCompanias();
  }

  getRegionSeleccionada(){
    // let region = document.querySelector<HTMLSelectElement>(".selectRegion");
    // if (region)
    //   this.regionElegida = region.value;
    console.log("la region elegida: " + this.regionElegida);
    this.cargarPaises();
  }

  cargarRegiones(){
    this.contactoService.obtenerRegiones().subscribe(
      (regiones: any[]) => {
        if (regiones != null)
          regiones.forEach(region => {
            this.regiones.push(region.region);
          });
      }
    );
  }

  getPaisSeleccionado(){
    // let pais = document.querySelector<HTMLSelectElement>(".selectPais");
    // if (pais)
    //   this.paisElegido = pais.value;
    console.log("la pais elegido: " + this.paisElegido);
    this.cargarCiudades();
  }

  cargarPaises(){
    this.contactoService.obtenerPaises(this.regionElegida).subscribe(
      (paises: any[]) => {
        this.paises = [];
        if (paises != null)
          paises.forEach(pais => {
            if (pais.nombre != null)
              this.paises.push(pais.nombre);
          });
        console.log(this.paises);
      }
    );
  }

  getCiudadSeleccionada(){
    // let ciudad = document.querySelector<HTMLSelectElement>(".selectCiudad");
    // if (ciudad)
    //   this.ciudadElegida = ciudad.value;
    console.log("la ciudad elegida: " + this.ciudadElegida);
    this.contactoService.obtenerIdCiudad(this.ciudadElegida).subscribe(
      (ciudad: any) => {
        this.id_ciudad = ciudad[0].id;
      }
    )
  }

  cargarCiudades(){
    this.contactoService.obtenerCiudades(this.paisElegido).subscribe(
      ((ciudades: any[]) => {
        this.ciudades = [];
        if (ciudades != null)
          ciudades.forEach(ciudad => {
            console.log(ciudad);
            this.ciudades.push(ciudad.nombre);
          });
      })
    );
  }

  cargarCompanias(){
    this.contactoService.obtenerCompanias().subscribe(
      (companias: any) => {
        console.log(companias);
        console.log(companias.companias);
        for (let i = 0 ; i < companias.companias.length; i++)
          this.companias.push(companias.companias[i].nombre);
      }
    );
  }
  
  crear(){
    this.inicializarCompania();
    console.log("id ciudad: " + this.id_ciudad);
    console.log("compania: " + this.compania);
    console.log(this.canal);
    this.crearContacto.emit(new ContactoModule( this.nombre, 
                                                this.apellido,
                                                this.cargo,
                                                this.email,
                                                this.compania,
                                                this.direccion,
                                                this.interes,
                                                this.canal,
                                                this.id_ciudad))
  }

  inicializarCompania(){
    let compania = document.querySelector<HTMLSelectElement>(".selectCompania");
    if (compania)
      this.compania = compania.value
  }

  agregarCanal(){
    this.canal.push(new CanalModule(this.nombreCanal, this.cuentaUsuario, this.preferencia));
  }

  cerrar(){
    this.cerrarVentana.emit(false);
  }
}
