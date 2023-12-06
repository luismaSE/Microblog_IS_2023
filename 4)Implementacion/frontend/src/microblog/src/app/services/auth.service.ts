import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
// import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = "http://localhost:7500/auth"

  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) { }
    
    //TODO No se si el register va aca o en post.services.ts 
    register(dataLogin:any): Observable<any>  {
      return this.httpClient.post(this.url + '/register', dataLogin).pipe(take(1))
    }

    login(dataLogin:any): Observable<any> {  
      return this.httpClient.post(this.url + '/login', dataLogin).pipe(take(1))
    }


    logout() {
      console.log("Cerrando sesion")
      localStorage.clear()
      this.router.navigate([""])
    }

}