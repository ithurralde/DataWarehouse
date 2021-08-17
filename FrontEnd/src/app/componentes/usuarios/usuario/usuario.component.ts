import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Usuario } from 'src/app/model/Usuario.model';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @Input() user: Usuario;
  editable:boolean = false;
  edit:string;
  @Output() borrarUsuario = new EventEmitter<Usuario>();
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.edit = "Editar"
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

  preEditar(){
    if (!this.editable){
      this.editable = true;
      this.edit = "Cancelar";
    }
    else{
      this.editable = false;
      this.edit = "Editar";
    }
  }

  editar(){
      this.editable = false;
      this.usuarioService.updateUsuario(this.user).subscribe(
        (respuesta:Usuario )=> {
          this.user = respuesta;
        }
      );
  }

  borrar(){
    this.borrarUsuario.emit(this.user);
  }
}
