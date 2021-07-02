import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario.model';
import { DataBaseServices } from 'src/app/servicios/DataBase.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  usuario: string;
  apellido: string;
  email: string;
  region: string;
  ciudad: string;
  constructor(private dbService: DataBaseServices, private router: Router) { 

  }

  ngOnInit(): void {
  }

  async mostrar(){
    console.log(this.usuario);
    console.log(this.apellido);
    let user = new Usuario(this.usuario, this.apellido, this.email, this.region, this.ciudad);
    this.dbService.crearUsuario(user)
    .subscribe(
      response => console.log(response),
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );

    this.router.navigate(["usuarios"]);
  }

}
