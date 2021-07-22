import { Component, Input, OnInit } from '@angular/core';
import { PaisModule } from 'src/app/model/pais/pais.module';
import { RegionModule } from 'src/app/model/region/region.module';
import { PaisService } from 'src/app/servicios/pais-service.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  @Input() region: RegionModule;
  nombrePais: string;
  paises: PaisModule[] = [];
  puedeAgregar = false;
  constructor(private paisService: PaisService) { }

  ngOnInit(): void {
    this.paisService.obtenerPaises().subscribe(
      (paises: RegionModule[]) => {
        this.paises = paises;
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }

  preAgregarPais(){
    this.puedeAgregar = true;
  }

  agregarPais(){
    this.puedeAgregar = false;
    let pais = new PaisModule(this.nombrePais);
    console.log(pais.nombre);
    this.paises.push(pais);
  }
}
