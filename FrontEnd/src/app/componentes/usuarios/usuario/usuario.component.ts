import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario.model';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @Input() user: Usuario;
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // creo que no necesito el get usuario, ya que no es necesario entrar a un usuario. Eso es para compañias
    // this.usuarioService.obtenerUsuario().subscribe(
    //   (usuario: Usuario) =>{
    //     console.log("hola soy el supuesto usuario o id: " + usuario);
    //     console.log(usuario.apellido);
    //     this.user = usuario;
    //   }
    // ,
    // error => { 
    //   console.log(error);
    //   console.error("Error: " + error.error.message)}
    // );
  }
}
