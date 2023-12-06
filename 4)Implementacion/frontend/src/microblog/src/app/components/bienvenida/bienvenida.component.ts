import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {AuthService} from './../../services/auth.service'
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})

export class BienvenidaComponent implements OnInit {

  registrarForm: any;
  loginForm: any;
  alias: any;
  selectedFile: any;
  base64String: string | null = null;

  constructor(
    private AuthService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["pepe@gmail.com", Validators.required],
      contra: ["123", Validators.required],
    })
    this.registrarForm = this.formBuilder.group({
      email: ["pepe@gmail.com", Validators.required],
      contra: ["123", Validators.required],
      alias: ["pepe", Validators.required],
      nombre: ["Don Pepe", Validators.required],
      foto: [null],
      descripcion: ["Hola como andas? Soy el Pepe"],
    })
  }


  submitlogin() {
    if(this.loginForm.valid) {
      this.login(
        {
          correo:this.loginForm.value.email, 
          password: this.loginForm.value.contra
        }
      )
    }
  }

  submitregistrar() {
    if(this.loginForm.valid) {
    this.registrar(
        {
          correo: this.registrarForm.value.email,
          alias: this.registrarForm.value.alias,
          nombre: this.registrarForm.value.nombre,
          password: this.registrarForm.value.contra,
          descripcion: this.registrarForm.value.descripcion,
          foto: this.registrarForm.value.foto
        }
      )
    }
  }

  login(dataLogin:any) {
    console.log('Comprobando credenciales...');
    this.AuthService.login(dataLogin).subscribe(
      {
        next: (rta) => {
          localStorage.setItem('token', rta.access_token) ;
          this.router.navigate(["tablon"])
        }, 
        
        error: (error) =>{
          alert(error.error);
          console.log('Error: ', error);
          localStorage.removeItem('token');
    
        }, 
        
        complete: () => {
          console.log('Terminó el login.');
        }
      }
    )
  }

  registrar(dataLogin:any) {
    console.log('Comprobando credenciales...');
    this.AuthService.register(dataLogin).subscribe(
      {
        next: (rta) => {
          alert('Usuario creado.');
          console.log('rta: ', rta);
        }, 
        
        error: (error) =>{
          alert(error.error);
          console.log('Error: ', error);
        }, 
        
        complete: () => {
          console.log('Termino el registrado.');
        }
      }
    )
  }
  

  onFileChange(event: any) {
    let file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (allowedTypes.includes(file.type)) {

        let reader = new FileReader();
        reader.onloadend = () => {

          // Cuando la lectura del archivo ha finalizado, actualizamos el campo 'foto' del formulario con el contenido en base64
          this.registrarForm.patchValue({
            foto: reader.result, // La foto en base64 (ya incluye la "data:image/png;base64," parte)
          });
        };
    
        reader.readAsDataURL(file);

      } else {
        alert('Formato de archivo no permitido. Por favor, seleccione una imagen en formato PNG, JPEG o JPG.');
      }
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
}