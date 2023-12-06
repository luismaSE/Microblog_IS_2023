import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuariosEncontradosService } from './../../services/post.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  mostrarLista = false;
  buscarForm: any;
  alias: any
  arrayUsuarios: any;
  token: any = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private UsuariosEncontradosService: UsuariosEncontradosService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")

    this.buscarForm = this.formBuilder.group({
      alias: ["", Validators.required],
      }    
    )
  }

  submitBuscar() {
    if(this.buscarForm.valid) {
      this.alias = this.buscarForm.value.alias
    }

    this.UsuariosEncontradosService.getUsuario(this.alias).subscribe(
      (data:any) => {
        this.arrayUsuarios = data;
      }
    )
  }

  salir() {
    localStorage.clear()
    alert("Cerraste sesión")
    window.location.replace('');
  }

  mensajePriv() {
    this.router.navigate(["mp"])
    
  }

  tablon() {
    this.router.navigate(["tablon"])
    
  }

  trending() {
    this.router.navigate([""])
  }

}
