import { Injectable } from "@angular/core";
import { Usuario } from "../model/Usuario.model";
import { DataBaseServices } from "./DataBase.service";

@Injectable()
export class UsuarioService {
    usuarios: Usuario[];

    constructor(private dbService: DataBaseServices){
        this.dbService.obtenerUsuarioPreLog().subscribe(
            (response: Usuario[]) => {
                this.cargarUsuarios(response);
            }
        );
    }

    crearUsuario(usuario: Usuario){
        this.usuarios.push(usuario);
        return this.dbService.crearUsuario(usuario);
    }
    
    // carga todos los usuarios que hay en la base de datos
    cargarUsuarios(usuarios: Usuario[]){
        this.usuarios = usuarios;
    }

    existeUsuario(usuario: string, contraseña: string): boolean{
        let retorno = false;
        if (this.usuarios != null)
            this.usuarios.forEach(user => {
                if (user.usuario == usuario && user.contrasenia == contraseña)
                    retorno = true;
                });
        return retorno;
    }

    logear(usuario: string, contrasenia: string) {
        return this.dbService.login(usuario, contrasenia);
      }

    // no funciona este
    obtenerUsuario(){
        return this.dbService.obtenerUsuario();
    }

    // obtiene los usuarios que estan en la base de datos
    obtenerUsuarios(){
        return this.dbService.obtenerUsuarios();
    }

    isAdmin(username: string){
        return this.dbService.isAdmin(username);
    }

    updateUsuario(user: Usuario){
        for (let i = 0; i < this.usuarios.length; i++){
            if (this.usuarios[i].usuario == user.usuario)
              this.usuarios[i] = user;
        }
        return this.dbService.updateUsuario(user);
    }

    borrarUsuario(user: Usuario){
        for (let i = 0; i < this.usuarios.length; i++){
            if (this.usuarios[i].usuario == user.usuario)
              this.usuarios.splice(i,1);
        }
        return this.dbService.borrarUsuario(user);
    }
}