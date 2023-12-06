import { Component, OnInit } from '@angular/core';
import {HashtagTendenciaService, MensajesTendenciaService, DiasService} from './../../services/post.service'
import jwt_decode from 'jwt-decode';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {
  arrayTendencias: any;
  arrayMensajes: any
  dias: any
  admin: any = 0;
  diasForm: any
  token: any = null;
  

  constructor(
    private HashtagTendenciaService: HashtagTendenciaService,
    private MensajesTendenciaService: MensajesTendenciaService,
    private DiasService: DiasService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token") || undefined

    this.HashtagTendenciaService.getHashtagTendencia().subscribe(
      (data:any) => {
        this.arrayTendencias = data;
      }
    )

    this.DiasService.getDias().subscribe(
      (data:any) => {
        this.dias = data;
      }
    )
    
    if (this.token) {
      this.admin = this.getDecodedAccessToken(this.token).admin
    }

    this.MensajesTendenciaService.getMensajesTendencia().subscribe(
      (data:any) => {
        this.arrayMensajes = data;
      }
    )

    this.diasForm = this.formBuilder.group({
      dias: [this.dias, Validators.required],
      }    
    )

  }
  
  submit() {
    this.DiasService.putDias({"dias":this.diasForm.value.dias}, localStorage.getItem("token")).subscribe(
      (response) => {
        alert(response);
        window.location.reload();
      }
    )

    this.HashtagTendenciaService.postHashtagTendencia(this.token).subscribe();
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
}