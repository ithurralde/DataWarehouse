import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Usuario } from 'src/app/model/Usuario.model';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @Input() user: Usuario;
  // utilizo una copia para la parte de editar contactos, que no haya error de null
  // cuando justo se quiere cambiar de datos y hay que esperar a que se haga en la BD tiraba error
  // con la variable original
  user_ant: Usuario;
  editable:boolean = false;
  edit:string;
  @Output() borrarUsuario = new EventEmitter<Usuario>();

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.edit = "Editar";
    this.user_ant = this.user;
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
      this.edit = "Editar";
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
