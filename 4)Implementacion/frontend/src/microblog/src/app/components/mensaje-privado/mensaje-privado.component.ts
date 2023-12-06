import { Component, OnInit } from '@angular/core';
import {MensajesPrivadosContactoService, ContactosService, MensajePrivadoService} from './../../services/post.service'
import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-mensaje-privado',
  templateUrl: './mensaje-privado.component.html',
  styleUrls: ['./mensaje-privado.component.css']
})
export class MensajePrivadoComponent implements OnInit {

  token: any
  arrayContactos: any;
  cantidadContactos: any;
  numbers: any;
  arrayMensajes: any;
  contacto: any
  mensajeForm: any;
  primero: any;
  contactoNuevo: any

  constructor(

    private MensajesPrivadosContactoService: MensajesPrivadosContactoService,
    private ContactosService: ContactosService,
    private MensajePrivado: MensajePrivadoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.contactoNuevo = localStorage.getItem("contactoNuevo") || undefined
    localStorage.removeItem("contactoNuevo")
    
    this.token = localStorage.getItem("token") || undefined
    this.ContactosService.getContactos(this.token).subscribe(
      (data:any) => {
        this.arrayContactos = data;
        this.cantidadContactos = data.contactos.length
        this.numbers = Array.from({ length: this.cantidadContactos }, (_, i) => i);

        if (this.contactoNuevo != null) {
          this.primero= this.contactoNuevo
        }
        else {
          this.primero= this.arrayContactos["contactos"][0]
        }

        this.MensajesPrivadosContactoService.getMensajes(this.primero,this.token).subscribe(
          (data:any) => {
            this.arrayMensajes = data;
            this.contacto = this.primero
            
          }
        )
      }
    )
    this.mensajeForm = this.formBuilder.group({
      texto: ["", Validators.required],
    
    } )
  
  }

  submit(alias:any) {
    this.MensajesPrivadosContactoService.getMensajes(alias,this.token).subscribe(
      (data:any) => {
        this.arrayMensajes = data;
        this.contacto = alias
        
      }
    )

  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  send(destinatario:any) {
    if(this.mensajeForm.valid) {
      this.MensajePrivado.postMensajePrivado({texto:this.mensajeForm.value.texto, destinatario:destinatario},this.token).subscribe()
    }
    alert("Mensaje enviado")
    window.location.reload();
    this.mensajeForm = this.formBuilder.group(
      {
        texto: ["", Validators.required],
      } 
    )
  }
}