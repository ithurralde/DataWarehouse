export class Usuario{
    id: number;
    constructor(public usuario:string,
                public nombre:string, 
                public apellido:string, 
                public email:string, 
                public perfil:string,
                public admin:boolean, 
                public contrasenia:string){
        
    }
}