import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { identifierName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

//T* Usuario Service: Get, Put
export class UsuarioService {
  private url = "http://127.0.0.1:7500/usuario"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Cargar info usuario
  getUsuario(alias: string) {
    return this.httpClient.get(this.url + "/" + alias);
  }

  //! Seguir o dejar de seguir
  putUsuario(alias: any, token:any) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.put(this.url + "/" + alias,{}, {headers: heads});
  }
}

//T* Usuarios Service: Get
export class UsuariosService {
  url = "usuarios"

  constructor(
    private httpClient: HttpClient
  ) { }

  getUsuarios(token: string) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(this.url, {headers: heads});
  }
}

@Injectable({
  providedIn: 'root'
})

//T* Usuarios Encontrados Service: Get
export class UsuariosEncontradosService {
  url = "http://127.0.0.1:7500/usuariosencontrados"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Buscar usuarios por alias
  getUsuario(alias: string) {
    return this.httpClient.get(this.url + "/" + alias);
  }

}


@Injectable({
  providedIn: 'root'
})

//T* Mensajes Service: Post, Get
export class MensajesService {
  url = "http://localhost:7500/mensajes"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Publicar mensaje
  postMensajes(data: any, token: any) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(this.url, data, {headers: heads})
  }

  //! Ver mensajes para el muro de un usuario
  getMensajes(token: string) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(this.url, {headers: heads});
  }

}


@Injectable({
  providedIn: 'root'
})

//T* Mensaje Service: Delete, Put
export class MensajeService {
  url = "http://localhost:7500/mensaje"

  constructor(
    private httpClient: HttpClient
  ) { }
  
  deleteMensaje(token: string, id: string) { 
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.delete(this.url + "/" + id.toString(), {headers: heads})
  }  

  putMensaje(data: any, token:string, id: string) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.put(this.url + "/" + id.toString(), data, {headers: heads});
  }
}


@Injectable({
  providedIn: 'root'
})

//T* Mensajes Autor Service: Get
export class MensajesAutorService {
  url = "http://localhost:7500/mensajes"

  constructor(
    private httpClient: HttpClient
  ) { }

  getMensajes(alias: string) {
    return this.httpClient.get(this.url + "/" + alias);
  }
}

@Injectable({
  providedIn: 'root'
})

//T* Dias Service: Get, Put
export class DiasService {
  url = "http://127.0.0.1:7500/dias"

  constructor(
    private httpClient: HttpClient
  ) { }

  getDias() {
    return this.httpClient.get(this.url);
  }

  putDias(data: any, token:any) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.put(this.url, data, {headers: heads});
  }

}


@Injectable({
  providedIn: 'root'
})

//T* Hashtag Tendencia Service: Get, Post
export class HashtagTendenciaService {
  url = "http://localhost:7500/hashtagtendencia"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Ver tendencias
  getHashtagTendencia() {
    return this.httpClient.get(this.url);
  }

  //! Enviar email con tendencias
  postHashtagTendencia(token: any) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(this.url, {}, {headers: heads})
  }
}


@Injectable({
  providedIn: 'root'
})

//T* Mensajes Tendencia Service: Get
export class MensajesTendenciaService {
  url = "http://localhost:7500/mensajestendencia"

  constructor(
    private httpClient: HttpClient
  ) { }
  
  //! Ver mensajes en tendencia
  getMensajesTendencia() {
    return this.httpClient.get(this.url);
  }

}


@Injectable({
  providedIn: 'root'
})

//T* Mensaje Privado Service: Post
export class MensajePrivadoService {
  url = "http://localhost:7500/mensajeprivado"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Enviar mensaje privado
  postMensajePrivado(data: any, token: string) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(this.url, data, {headers: heads})
  }

}


@Injectable({
  providedIn: 'root'
})

//T* Mensajes Privados Contacto Service: Get
export class MensajesPrivadosContactoService {
  url = "http://localhost:7500/mensajesprivadoscontacto"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Ver mensajes privados de un contacto
  getMensajes(contacto: string, token: string) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(this.url + "/" + contacto, {headers: heads});
  }

}

@Injectable({
  providedIn: 'root'
})

//T* Contactos Service: Get
export class ContactosService {
  url = "http://localhost:7500/contactos"

  constructor(
    private httpClient: HttpClient
  ) { }

  //! Ver contactos
  getContactos(token: string) {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(this.url, {headers: heads});
  }

}