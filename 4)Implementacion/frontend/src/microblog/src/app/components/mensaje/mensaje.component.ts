import { UsuarioService, MensajeService } from './../../services/post.service'
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit {

  @Input() mensaje:any;
  token: any;
  alias: any;
  modificarForm: any;

  constructor(
    private usuarioService: UsuarioService,
    private MensajeService: MensajeService,
    private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void{
      this.token = localStorage.getItem("token") || undefined 
      if (this.token) {
        this.alias = this.getDecodedAccessToken(this.token).alias
      }
      this.modificarForm = this.formBuilder.group({
        texto: [this.mensaje["texto"],Validators.required]
      })
    }

    getDecodedAccessToken(token: any): any {
      try {
        return jwt_decode(token);
      } catch(Error) {
        return null;
      }
    }
    
    delete(id: any) {
      this.MensajeService.deleteMensaje(this.token, id).subscribe()
      alert("Mensaje eliminado")
      window.location.reload();
    }

    update(id: any) {
      this.MensajeService.putMensaje({texto:this.modificarForm.value.texto},this.token, id).subscribe(
        {
          next: (rta) => {
            alert('Mensaje Modificado');
            console.log('rta: ', rta);
            window.location.reload();
          }, 
          
          error: (error) =>{
            alert(error.error);
            console.log('Error: ', error);
          }
        }
      )
    }
}