import { Component, OnInit } from '@angular/core';
import { MensajesAutorService } from './../../services/post.service';
import { UsuarioService } from './../../services/post.service';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';



@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  user: any;
  alias: any;
  token: any;
  arrayMensajes: any;
  username: any;
  seguido: any
  mensajes: any;
  

  constructor(
    private MensajesAutorService: MensajesAutorService,
    private UsuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token") || undefined

    if (this.token) {
      this.username = this.getDecodedAccessToken(this.token).alias
    }

    //! Cargar mensajes
    this.alias = this.route.snapshot.paramMap.get('alias');
    this.MensajesAutorService.getMensajes(this.alias).subscribe(
      (data:any) => {
        this.arrayMensajes = data;
      }
    )

    //! Cargar info usuario
    this.UsuarioService.getUsuario(this.alias).subscribe(
      (data:any) => {
        this.user = data;

        if (this.user['seguidores'].includes(this.username)) {
          this.seguido = true
        } else {
        this.seguido = false
        }
      }
    )
  }

  //! Seguir o dejar de seguir
  seguir() {
    this.token = localStorage.getItem("token")
    this.UsuarioService.putUsuario(this.alias, this.token).subscribe(
      (response) => {
        alert(response);
        window.location.reload();
      }
    )
    
  }

  enviarMp() {
    this.router.navigate(["mp"])
    localStorage.setItem("contactoNuevo", this.alias)
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
      
    } catch(Error) {
      return null;
    }
  }
}