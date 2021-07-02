import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @Input() user: Usuario;
  constructor() { }

  ngOnInit(): void {
  }

}
