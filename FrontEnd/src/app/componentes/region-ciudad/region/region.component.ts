import { Component, Input, OnInit } from '@angular/core';
import { actPaisModule } from 'src/app/model/pais/actPais.module';
import { PaisModule } from 'src/app/model/pais/pais.module';
import { RegionModule } from 'src/app/model/region/region.module';
import { CompaniaService } from 'src/app/servicios/compania.service';
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
  boton: string = "Add country";
  constructor(private paisService: PaisService, private companiaService: CompaniaService) { }

  ngOnInit(): void {
    this.paisService.obtenerPaises(this.region).subscribe(
      (paises: PaisModule[]) => {
        // let i = 0;
        paises.forEach(element => {
          if (element.nombre != null){
            this.paises.push(new PaisModule(element.nombre));
          }
          // i++;
        });
        // this.paises = paises;
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }

  preAgregarPais(){
    if (!this.puedeAgregar){
      this.puedeAgregar = true;
      this.boton = "Cancelar";
    }
    else{
      this.puedeAgregar = false;
      this.boton = "Add country"
    }
  }

  agregarPais(){
    this.puedeAgregar = false;
    this.boton = "Add country"
    let pais = new PaisModule(this.nombrePais);
    console.log(pais.nombre);
    console.log(this.region);
    this.paises.push(pais);
    this.paisService.agregarPais(this.region, pais).subscribe(
      ()=> console.log("Agregado el pais " + pais.nombre + " a la BD."),
      (error) => {
        console.error("Hubo un error: ", error)
      }
    )
  }

  deletePais(pais: PaisModule){
    for (let i = 0; i < this.paises.length; i++){
      if (this.paises[i] == pais){
        this.companiaService.borrarCompaniaRegion(pais.nombre).subscribe(
          () => {
            this.paisService.borrarPais(this.paises[i]).subscribe(
              () => {
                console.log("Pais " + this.paises[i] + " eliminado correctamente.")
                this.paises.splice(i,1);
              },
              (error) => {
                console.error("Hubo un error: ", error)
              }
            );
          },
          (error) => {
            console.error("Hubo un error: ", error)
          }
        )
      }
    }
  }

  updatePais(pais: actPaisModule){
    console.log("se puede o no pa??");
    for (let i = 0; i < this.paises.length; i++){
      if (this.paises[i].nombre == pais.nombre){
        this.paisService.actualizarPais(this.region, pais).subscribe(
          () => {
            console.log("Pais " + pais + " eliminado correctamente.");
            this.paises[i].nombre = pais.nombre;
          },
          (error) => {
            console.error("Hubo un error: ", error)
          }
        );
      }
    }
  }

}
