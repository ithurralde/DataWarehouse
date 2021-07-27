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
  
  // isAdmin: Boolean;
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        // this.isAdmin = true;
        // this.usuarioService.cargarUsuarios(usuarios);
      },
      error => { 
        console.log(error);
        console.error("Error: " + error.error.message)}
    );
  }
  
 async borrar(usuario: Usuario){
    for (let i = 0; i < this.usuarios.length; i++){
      if (this.usuarios[i].usuario === usuario.usuario){
        this.usuarios.splice(i,1);
        this.usuarioService.borrarUsuario(usuario).subscribe(
         () => console.log("Usuario eliminado: " + usuario.usuario)
        );
      }
    }
  }
}
