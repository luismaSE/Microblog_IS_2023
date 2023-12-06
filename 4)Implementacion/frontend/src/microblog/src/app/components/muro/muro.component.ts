import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {MensajesService} from './../../services/post.service'
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-muro',
  templateUrl: './muro.component.html',
  styleUrls: ['./muro.component.css']
})
export class MuroComponent implements OnInit {

  alias: any;
  mensajes: any;
  token: any
  arrayMensajes: any;

  constructor(
    private MensajesService: MensajesService
  ) { }

  ngOnInit(): void {
    
    this.token = localStorage.getItem("token") || undefined
    this.MensajesService.getMensajes(this.token).subscribe(
      (data:any) => {
        this.arrayMensajes = data;
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
}
