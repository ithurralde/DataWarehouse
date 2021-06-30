import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:string;
  contrasenia:string;

  constructor() { }

  ngOnInit(): void {
  }

  mostrar(){
    console.log(this.usuario);
    console.log(this.contrasenia);
  }
}
