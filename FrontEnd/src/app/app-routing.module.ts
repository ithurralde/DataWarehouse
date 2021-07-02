import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompaniasComponent } from './componentes/companias/companias.component';
import { ContactoComponent } from './componentes/contactos/contacto/contacto.component';
import { ContactosComponent } from './componentes/contactos/contactos.component';
import { CrearContactoComponent } from './componentes/contactos/crear-contacto/crear-contacto.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegionCiudadComponent } from './componentes/region-ciudad/region-ciudad.component';
import { CrearUsuarioComponent } from './componentes/usuarios/crear-usuario/crear-usuario.component';
import { UsuarioComponent } from './componentes/usuarios/usuario/usuario.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

const routes: Routes = [
  { path:"", component: LoginComponent},
  { path:"contactos", component: ContactosComponent, children:[
    { path:"crear", component: CrearContactoComponent},
    { path:":id", component: ContactoComponent}
  ]},
  { path:"companias", component: CompaniasComponent},
  { path:"usuarios", component: UsuariosComponent, children:[
    { path:"crear", component: CrearUsuarioComponent},
    { path:":id", component: UsuarioComponent}
  ]},
  { path:"region-ciudad", component: RegionCiudadComponent},
  { path:"login", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
