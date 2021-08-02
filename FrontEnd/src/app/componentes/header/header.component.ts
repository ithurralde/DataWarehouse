import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario.model';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAdmin:boolean;
  onClickContactos:boolean = true;
  onClickCompanias:boolean
  onClickUsuarios:boolean
  onClickRegion:boolean
  constructor(private usuarioService: UsuarioService) {
    
   }

  ngOnInit(): void {
  }


  // para saber si el usuario es admin
  cargar(){
    let username:string;
    this.usuarioService.obtenerUsuario().subscribe(
      (usuario: Usuario) => {
        username = usuario.usuario;
        console.log(username);
        this.usuarioService.isAdmin(username).subscribe(
          (admin:any) => {
            console.log(admin[0]);
            console.log(admin[0].admin);
            this.isAdmin = admin[0].admin;
          }
        )
      }
    );
  }

  contactos(){
    this.onClickContactos = true;
    this.onClickCompanias = false;
    this.onClickUsuarios = false;
    this.onClickRegion = false;
  }

  companias(){
    this.onClickContactos = false;
    this.onClickCompanias = true;
    this.onClickUsuarios = false;
    this.onClickRegion = false;
  }

  usuarios(){
    this.onClickContactos = false;
    this.onClickCompanias = false;
    this.onClickUsuarios = true;
    this.onClickRegion = false;
  }

  region(){
    this.onClickContactos = false;
    this.onClickCompanias = false;
    this.onClickUsuarios = false;
    this.onClickRegion = true;
  }

}
