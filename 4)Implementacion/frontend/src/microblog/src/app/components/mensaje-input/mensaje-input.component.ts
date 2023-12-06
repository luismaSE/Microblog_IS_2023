import { Component, OnInit } from '@angular/core';
import {MensajesService} from './../../services/post.service'
import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-mensaje-input',
  templateUrl: './mensaje-input.component.html',
  styleUrls: ['./mensaje-input.component.css']
})
export class MensajeInputComponent implements OnInit {

  token:any;
  mensajeForm: any;
  foto:any;

  constructor(
    private MensajesService: MensajesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.token = localStorage.getItem("token")

    this.mensajeForm = this.formBuilder.group({
      texto: ["", Validators.required],
      }    
    )
  }

  submit() {
    if(this.mensajeForm.valid) {
      this.MensajesService.postMensajes({texto:this.mensajeForm.value.texto},this.token).subscribe(
        {
          next: (rta) => {
            alert('Mensaje Publicado');
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
    
    this.mensajeForm = this.formBuilder.group(
      {
        texto: ["", Validators.required],
      } 
    )
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
}