import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MensajesPrivadosComponent } from './pages/mensajes-privados/mensajes-privados.component';
import { MuroUsuarioComponent } from './pages/muro-usuario/muro-usuario.component';
import { TendenciasComponent } from './pages/tendencias/tendencias.component';


const routes: Routes = [
  { path: '', component: TendenciasComponent },
  { path: 'tablon', component: HomeComponent },
  { path: 'mp', component: MensajesPrivadosComponent },
  { path: 'muro/:alias', component: MuroUsuarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }