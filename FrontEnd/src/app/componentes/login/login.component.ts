import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario.model';
import { DataBaseServices } from 'src/app/servicios/DataBase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:string;
  contrasenia:string;

  constructor(private dbService: DataBaseServices) { }

  ngOnInit(): void {
  }

  async mostrar(){
    console.log(this.usuario);
    console.log(this.contrasenia);
    let user = new Usuario(this.usuario, "Wayne", "brenwayne13@gmail.com", "Argentina", "Buenos Aires");
    this.dbService.crearUsuario(user);
  }
}
