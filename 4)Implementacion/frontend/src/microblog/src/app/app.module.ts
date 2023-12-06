import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// paginas
import { HomeComponent } from './pages/home/home.component';
import { TendenciasComponent } from './pages/tendencias/tendencias.component';
import { MuroUsuarioComponent } from './pages/muro-usuario/muro-usuario.component';



// componentes
import { HeaderComponent } from './components/header/header.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { DatosUsuarioComponent } from './components/datos-usuario/datos-usuario.component';
import { MensajeComponent } from './components/mensaje/mensaje.component';
import { MensajeInputComponent } from './components/mensaje-input/mensaje-input.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';

import { MensajePrivadoComponent } from './components/mensaje-privado/mensaje-privado.component';
import { MensajesPrivadosComponent } from './pages/mensajes-privados/mensajes-privados.component';


// duda
import { MuroComponent } from './components/muro/muro.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrendingComponent } from './components/trending/trending.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    BienvenidaComponent,
    DatosUsuarioComponent,
    MensajeComponent,
    MensajeInputComponent,
    TendenciasComponent,
    PerfilUsuarioComponent,

    MensajesPrivadosComponent,
    MensajePrivadoComponent,

    MuroComponent,
    MuroUsuarioComponent,
    TrendingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
