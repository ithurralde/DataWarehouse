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

}
