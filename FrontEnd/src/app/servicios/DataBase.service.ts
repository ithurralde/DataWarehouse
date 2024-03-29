import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { stringify } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { PaisModule } from "../model/pais/pais.module";
import { RegionModule } from "../model/region/region.module";
import { Usuario } from "../model/Usuario.model"
import { ActivatedRoute} from '@angular/router'
import { CiudadModule } from "../model/ciudad/ciudad.module";
import { actPaisModule } from "../model/pais/actPais.module";
import { CompaniaModule } from "../model/compania/compania.module";
import { CiudadAnteriorModule } from "../model/ciudad/ciudad-anterior.module";
import { CompaniaAnteriorModule } from "../model/compania/compania-anterior.module";
import { ContactoModule } from "../model/contacto/contacto.module";
import { CanalModule } from "../model/canal/canal.module";

@Injectable()
export class DataBaseServices {
    url: string = "http://localhost:3000/";
    header = new HttpHeaders({
        'content-type': 'application/json',
    });
    tokenJWT:Object;
    id:String;

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
                                                        'Authorization': String(this.tokenJWT),
                                                    });

                                                },
                                    error =>  {
                                                console.error("Hubo un error: ", error)
                                            });
        return resultado;
    }

    crearUsuario(user: Usuario){
        return this.httpClient.post( this.url + "usuarios/crear", user, {headers: this.header});
    }

    obtenerUsuarios(){
        return this.httpClient.get<Usuario[]>(this.url + "usuarios" , {headers: this.header});
    }

    obtenerUsuarioPreLog(){
        return this.httpClient.get<Usuario[]>(this.url + "usuarios_log");
    }

    obtenerUsuario(){
        return this.httpClient.get<Usuario>(this.url + "usuario");
    }
    

    obtenerRegiones(){
        return this.httpClient.get<RegionModule[]>(this.url + "regiones", {headers:this.header});
    }

    obtenerPaises(region: RegionModule){
        return this.httpClient.get<PaisModule[]>(this.url + "paises/?region=" + region.nombre,  {headers:this.header});
    }

    isAdmin(usuario:string){
        return this.httpClient.post<Usuario>(this.url + "isAdmin", {usuario});
    }

    updateUsuario(user: Usuario){
        return this.httpClient.put<Usuario>(this.url + "usuarios", user, {headers: this.header});
    }

    borrarUsuario(user: Usuario){
        return this.httpClient.delete<Usuario>(this.url + "usuarios/?user=" + user.usuario, {headers: this.header});
    }

    agregarRegion(region: RegionModule){
        return this.httpClient.post<RegionModule>(this.url + "regiones", region, {headers: this.header});
    }

    agregarPais(region: RegionModule, pais: PaisModule){
        return this.httpClient.post(this.url + "paises", {region, pais}, {headers: this.header});
    }

    borrarPais(pais: PaisModule){
        return this.httpClient.delete(this.url + "paises/?pais=" + pais.nombre, { headers:this.header });
    }

    actualizarPais(region: RegionModule, pais: actPaisModule){
        return this.httpClient.put(this.url + "paises", {region, pais}, {headers:this.header});
    }

    obtenerCiudades(pais: PaisModule){
        return this.httpClient.get<CiudadModule[]>(this.url + "ciudad/?pais=" + pais.nombre, { headers: this.header});
    }

    obtenerTodasCiudades(){
        return this.httpClient.get<string[]>(this.url + "ciudades", {headers : this.header});
    }

    obtenerIdCiudad(ciudad: string){
        return this.httpClient.get<string>(this.url + "id_ciudad/?get_ciudad=" + ciudad, {headers:this.header});
    }

    agregarCiudad(ciudad: CiudadModule, pais: PaisModule, region: RegionModule){
        return this.httpClient.post(this.url + "ciudad", {ciudad, pais, region}, {headers: this.header})
    }

    borrarCiudad(ciudad: CiudadModule){
        return this.httpClient.delete(this.url + "ciudad/?ciudad=" + ciudad.nombre, { headers:this.header });
    }

    actualizarCiudad(ciudad_ant:CiudadAnteriorModule, pais: PaisModule){
        return this.httpClient.put(this.url + "ciudad", {ciudad_ant, pais}, {headers: this.header});
    }

    obtenerCompanias(){
        return this.httpClient.get<CompaniaModule[]>(this.url + "companias", {headers:this.header});
    }

    agregarCompania(compania: CompaniaModule){
        return this.httpClient.post(this.url + "companias", compania, {headers:this.header});
    }

    borrarCompania(compania: CompaniaModule){
        return this.httpClient.delete(this.url + "companias/?compania=" + JSON.stringify(compania), {headers: this.header} );
    }

    borrarCompaniaPais(ciudad: string){
        return this.httpClient.delete(this.url + "companiasPais/?ciudad=" + ciudad, {headers: this.header} );
    }

    borrarCompaniaRegion(pais: string){
        return this.httpClient.delete(this.url + "companiasRegion/?pais=" + pais, {headers: this.header} );
    }

    editarCompania(compania_ant: CompaniaAnteriorModule){
        return this.httpClient.put(this.url + "companias", compania_ant, {headers: this.header});
    }

    obtenerContactos(){
        return this.httpClient.get<ContactoModule[]>(this.url + "contactos", {headers: this.header});
    }

    obtenerRegion(id_ciudad:number){
        return this.httpClient.get<string>(this.url + "contactos/region?id_ciudad=" + id_ciudad, {headers: this.header});
    }

    obtenerPais(id_ciudad:number){
        return this.httpClient.get<string>(this.url + "contactos/pais?id_ciudad=" + id_ciudad, {headers: this.header});
    }

    crearContacto(contacto: ContactoModule){
        return this.httpClient.post(this.url + "contactos", contacto, {headers:this.header});
    }

    actualizarContacto(contacto_anterior: ContactoModule, contacto_nuevo: ContactoModule){
        return this.httpClient.put(this.url + "contactos", {contacto_anterior, contacto_nuevo}, {headers: this.header});
    }

    eliminarContacto(contacto: ContactoModule){
        return this.httpClient.delete(this.url + "contactos/?contacto=" + JSON.stringify(contacto), {headers: this.header});
    }

    getCanalesContacto(contacto: ContactoModule){
        return this.httpClient.get<CanalModule[]>(this.url + "contactosCanales/?contacto=" + JSON.stringify(contacto), { headers:this.header });
    }

    // borrarContactosCompania(compania: CompaniaModule){
    //     return this.httpClient.delete(this.url + "contactos/compania?dato=" + compania, {headers:this.header});
    // }

    // borrarContactosPais(pais:string){
    //     return this.httpClient.delete(this.url + "contactos/pais?dato=" + pais, {headers:this.header});
    // }

    // borrarContactosCiudad(ciudad:string){
    //     return this.httpClient.delete(this.url + "contactos/ciudad?dato=" + ciudad, { headers:this.header });
    // }
}