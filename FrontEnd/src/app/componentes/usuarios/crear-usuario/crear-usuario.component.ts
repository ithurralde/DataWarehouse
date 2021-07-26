import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario.model';
import { DataBaseServices } from 'src/app/servicios/DataBase.service';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  usuario:string;
  nombre:string;
  apellido:string; 
  email:string;
  perfil:string;
  admin:boolean; 
  contrasenia:string;
  constructor(private router: Router, private usuarioService: UsuarioService) { 

  }

  ngOnInit(): void {
  }

  async mostrar(){
    console.log(this.usuario);
    console.log(this.apellido);
    let user = new Usuario(this.usuario, this.nombre, this.apellido, this.email, this.perfil, this.admin, this.contrasenia);
    this.usuarioService.crearUsuario(user)
    .subscribe(
      response => console.log(response),
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );

    this.router.navigate(["usuarios"]);
  }

}
