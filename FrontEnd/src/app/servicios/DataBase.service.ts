import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { PaisModule } from "../model/pais/pais.module";
import { RegionModule } from "../model/region/region.module";
import { Usuario } from "../model/Usuario.model"

@Injectable()
export class DataBaseServices {
    url: string = "http://localhost:3000/";
    constructor(private httpClient: HttpClient){

    }

    login(user: string, contrasenia: string){
        this.httpClient.post(this.url, {user, contrasenia})
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
        // no funciona con json, le tengo que mandar el objeto (con json me llega un body vacio)
        // let json = JSON.stringify(user);
        // console.log("[DataBaseService] soy el json: " + json);
        return this.httpClient.post( this.url + "usuarios/crear", user);
    }

    obtenerUsuarios(){
        return this.httpClient.get<Usuario[]>(this.url + "usuarios");
    }

    obtenerUsuario(){
        // no funciona nada de esto
        let param = new HttpParams();
        let id = param.get("id");
        console.log("quien concha soy");
        console.log(id);
        this.httpClient.get<Usuario>(this.url + "usuarios/:id").subscribe(
            (user: Usuario) => {
            console.log("pero quien poronga me mando a hacer esto?");
            console.log(user);
            console.log(id);
            }
        );
         
        return this.httpClient.get<Usuario>(this.url + "usuarios/:id");
    }
    

    obtenerRegiones(){
        return this.httpClient.get<RegionModule[]>(this.url + "regiones");
    }

    obtenerPaises(){
        return this.httpClient.get<PaisModule[]>(this.url + "paises");
    }
}