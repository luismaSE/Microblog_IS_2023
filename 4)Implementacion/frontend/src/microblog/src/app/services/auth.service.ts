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
    
    //! Login
    login(dataLogin:any): Observable<any> {  
      return this.httpClient.post(this.url + '/login', dataLogin).pipe(take(1))
    }
    
    //! Register
    register(dataLogin:any): Observable<any>  {
      return this.httpClient.post(this.url + '/register', dataLogin).pipe(take(1))
    }

    //! Logout
    logout() {
      console.log("Cerrando sesion")
      localStorage.clear()
      this.router.navigate([""])
    }

}