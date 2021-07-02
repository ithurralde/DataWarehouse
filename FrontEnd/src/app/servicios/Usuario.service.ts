import { Injectable } from "@angular/core";
import { Usuario } from "../model/Usuario.model";
import { DataBaseServices } from "./DataBase.service";

@Injectable()
export class UsuarioService {
    usuarios: Usuario[];

    constructor(private dbService: DataBaseServices){
    }
    
    // carga todos los usuarios que hay en la base de datos
    cargarUsuarios(usuarios: Usuario[]){
        this.usuarios = usuarios;
    }

    // obtiene los usuarios que estane en la base de datos
    obtenerUsuarios(){
        return this.dbService.obtenerUsuarios();
    }
}