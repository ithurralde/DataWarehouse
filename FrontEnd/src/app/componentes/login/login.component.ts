import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:string;
  contrasenia:string;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
  }

  async mostrar(){
    console.log(this.usuario);
    console.log(this.contrasenia);
    // let user = new Usuario(this.usuario, "Wayne", "brenwayne13@gmail.com", "Argentina", "Buenos Aires");
    // this.dbService.crearUsuario(user);
    let existe = this.usuarioService.existeUsuario(this.usuario, this.contrasenia);
    if (existe == true){
      this.usuarioService.logear(this.usuario, this.contrasenia);
      this.router.navigate(["usuarios"]);
    }
  }
}
