import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario.model';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {
  usuarios: Usuario[];
  isAdmin: Boolean;
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
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
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.isAdmin = true;
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }

  
  

}
