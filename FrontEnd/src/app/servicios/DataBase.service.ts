import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { stringify } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { PaisModule } from "../model/pais/pais.module";
import { RegionModule } from "../model/region/region.module";
import { Usuario } from "../model/Usuario.model"
import { ActivatedRoute} from '@angular/router'

@Injectable()
export class DataBaseServices {
    url: string = "http://localhost:3000/";
    header = new HttpHeaders({
        'content-type': 'application/json',
        //  'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJyZW4iLCJpYXQiOjE1MTYyMzkwMjJ9.WSyqCRiTEDWEshWnkyLOqC2zqzN8irFQFdLnGhUnApc",
        //  'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJyZW4iLCJpYXQiOjE1MTYyMzkwMjJ9.WSyqCRiTEDWEshWnkyLOqC2zqzN8irFQFdLnGhUnApc'
    });
    tokenJWT:Object;
    id:String;


    
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.pPblodGgwKxB3YDA5LHdYsx3LYiGjUUEjTkeIHUKKsU delilah
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJyZW4iLCJpYXQiOjE1MTYyMzkwMjJ9.WSyqCRiTEDWEshWnkyLOqC2zqzN8irFQFdLnGhUnApc google
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiYWFhcyIsImlhdCI6MTYxOTMwMDcyNX0.Edn7ZsCQl8RpNTQsY6VM19HQ2u5myuA6e5zi-EFasfw postman

    constructor(private httpClient: HttpClient, private route:ActivatedRoute){
    }

    login(user: string, contrasenia: string){
        let resultado = this.httpClient.post(this.url + "login", {user, contrasenia});
        this.httpClient.post(this.url + "token", {user})
                        .subscribe(async response => {    
                                                    this.tokenJWT = await JSON.stringify(response);
                                                    this.tokenJWT = String(this.tokenJWT).split(":")[1];
                                                    this.tokenJWT = String(this.tokenJWT).split("\"")[1];
                                                    this.header = new HttpHeaders({
                                                        'content-type': 'application/json',
                                                        // 'Authorization': jwt,
                                                        'Authorization': String(this.tokenJWT),
                                                    });

                                                },
                                    error =>  {
                                                console.log("rompi por todos lados");
                                                console.log(error)
                                            });
        return resultado;
    }

    crearUsuario(user: Usuario){
        console.log("[DataBaseService] nombre: " + user.nombre);
        console.log("[DataBaseService] apellido: " + user.apellido);
        console.log("[DataBaseService] email: " + user.email);
        // no funciona con json, le tengo que mandar el objeto (con json me llega un body vacio)
        // let json = JSON.stringify(user);
        // console.log("[DataBaseService] soy el json: " + json);
        return this.httpClient.post( this.url + "usuarios/crear", user, {headers: this.header});
    }

    obtenerUsuarios(){
        return this.httpClient.get<Usuario[]>(this.url + "usuarios" , {headers: this.header});
    }

    obtenerUsuarioPreLog(){
        return this.httpClient.get<Usuario[]>(this.url + "usuarios_log");
    }

    obtenerUsuario(){
        // no funciona nada de esto
        // let param = new HttpParams();
        // let id = param.get("id");
        // console.log("quien concha soy");
        // console.log(id);
        // this.httpClient.get<Usuario>(this.url + "usuarios/:id").subscribe(
        //     (user: Usuario) => {
        //     console.log("pero quien poronga me mando a hacer esto?");
        //     console.log(user);
        //     console.log(id);
        //     }
        // );
         
        // return this.httpClient.get<Usuario>(this.url + "usuarios/:id");
        // this.id = this.route.snapshot.paramMap.get('id');



        // console.log("HOLANDAAAAAAAAAAAAAAAAAAAAAA");
        // console.log(this.route.snapshot.paramMap.get('id'));
        return this.httpClient.get<Usuario>(this.url + "usuario");
    }
    

    obtenerRegiones(){
        return this.httpClient.get<RegionModule[]>(this.url + "regiones", {headers:this.header});
    }

    obtenerPaises(){
        return this.httpClient.get<PaisModule[]>(this.url + "paises",  {headers:this.header});
    }

    isAdmin(usuario:string){
        console.log("el username desde el front antes de ir al back: " + usuario);
        console.log(usuario);
        return this.httpClient.post<Usuario>(this.url + "isAdmin", {usuario});
    }

    updateUsuario(user: Usuario){
        return this.httpClient.put<Usuario>(this.url + "usuarios", user, {headers:this.header});
    }
}