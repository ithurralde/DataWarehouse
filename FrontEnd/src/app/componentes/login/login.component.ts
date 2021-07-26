import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:string;
  contrasenia:string;
  log = document.querySelector<HTMLElement>(".lista");
  admin = document.querySelector<HTMLElement>(".usuarios");

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
  }

  async mostrar(){
    console.log(this.usuario);
    console.log(this.contrasenia);
    console.log(this.log);
    // if (this.log)
    //   this.log.style.display = "block";
    // let user = new Usuario(this.usuario, "Wayne", "brenwayne13@gmail.com", "Argentina", "Buenos Aires");
    // this.dbService.crearUsuario(user);
    let existe = this.usuarioService.existeUsuario(this.usuario, this.contrasenia);
    if (existe == true){
      if (this.log)
      this.log.style.display = "block";
      this.usuarioService.logear(this.usuario, this.contrasenia)
      .subscribe(
        response => 
            {console.log("Exito al loguear: " + response);
            console.log(response);
            this.router.navigate(["contactos"]);
            this.usuarioService.isAdmin(this.usuario).subscribe(
              (admin:any) => {
                console.log(admin);
                if (this.admin && admin[0].admin === 1)
                  this.admin.style.display = "block";
              }
            )
            },
        error => {console.log("Error al loguear: " + error);
                  console.log(error);}
    );
      // this.router.navigate(["usuarios"]);
    }
  }
}
