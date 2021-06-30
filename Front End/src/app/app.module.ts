import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { RegionCiudadComponent } from './componentes/region-ciudad/region-ciudad.component';
import { CompaniasComponent } from './componentes/companias/companias.component';
import { ContactosComponent } from './componentes/contactos/contactos.component';
import { ContactoComponent } from './componentes/contactos/contacto/contacto.component';
import { UsuarioComponent } from './componentes/usuarios/usuario/usuario.component';
import { CrearUsuarioComponent } from './componentes/usuarios/crear-usuario/crear-usuario.component';
import { CrearContactoComponent } from './componentes/contactos/crear-contacto/crear-contacto.component';
import { RegionComponent } from './componentes/region-ciudad/region/region.component';
import { PaisComponent } from './componentes/region-ciudad/pais/pais.component';
import { CiudadComponent } from './componentes/region-ciudad/ciudad/ciudad.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    UsuariosComponent,
    RegionCiudadComponent,
    CompaniasComponent,
    ContactosComponent,
    ContactoComponent,
    UsuarioComponent,
    CrearUsuarioComponent,
    CrearContactoComponent,
    RegionComponent,
    PaisComponent,
    CiudadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
