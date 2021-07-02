import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Usuario } from "../model/Usuario.model"

@Injectable()
export class DataBaseServices {
    url: string = "http://localhost:3000/";
    constructor(private httpClient: HttpClient){

    }

    login(user: Usuario){
        this.httpClient.post(this.url, user)
        .subscribe(
            response => 
                console.log("Exito: " + response),
                error => console.log("Erroraso: " + error)
        )
    }

    crearUsuario(user: Usuario){
        console.log("[DataBaseService] nombre: " + user.nombre);
        console.log("[DataBaseService] apellido: " + user.apellido);
        console.log("[DataBaseService] email: " + user.email);
        console.log("[DataBaseService] region: " + user.region);
        console.log("[DataBaseService] ciudad: " + user.ciudad);
        // no funciona con json, le tengo que mandar el objeto (con json me llega un body vacio)
        // let json = JSON.stringify(user);
        // console.log("[DataBaseService] soy el json: " + json);
        return this.httpClient.post( this.url + "usuarios/crear", user);
    }

    obtenerUsuarios(){
        return this.httpClient.get<Usuario[]>(this.url + "usuarios");
    }
}