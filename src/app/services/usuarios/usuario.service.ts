import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';

import swal from 'sweetalert';

// Config
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import { MapOperator } from 'rxjs/internal/operators/map';

// Services
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = URL_SERVICES;
  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor( private http: HttpClient,
               private router: Router,
               private _subirArchivoService: SubirArchivoService) { 
    this.cargarStorage();
  }

  renuevaToken(){
    let url = URL_SERVICES + '/login/renuevatoken' + '?token=' + this.token;

    return this.http.get( url ).pipe(
      map( (resp: any) => {
        this.token = resp.token;
        localStorage.setItem( 'token', this.token );
        console.log('Token renovado');
        return resp;
      }),
      catchError( err => {
        swal('Error', 'No se pudo renovar el token', 'error');
        this.router.navigate(['/login']);
        return of(err);
      })
    );
  }

  isLogged(){
    return this.token ? true : false;
  }

  cargarStorage(){
    if( localStorage.getItem( 'token' ) ){
      this.token   = localStorage.getItem( 'token' );
      this.usuario = JSON.parse( localStorage.getItem( 'usuario') );
      this.menu    = JSON.parse( localStorage.getItem( 'menu') );
    } else {
      this.limpiarStorage();
    }
  }

  limpiarStorage(){
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'usuario' );
    localStorage.removeItem( 'id' );
    localStorage.removeItem( 'menu' );
  }


  guardarStorage( id: string, token: string, user: Usuario, menu?: any){
    localStorage.setItem( 'id', id );
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'usuario', JSON.stringify( user ) );

    if( menu ){
      localStorage.setItem( 'menu', JSON.stringify( menu ) );
      this.menu    = menu;
    }

    this.usuario = user;
    this.token   = token;
  }

  loginGoogle( token : string ){
    let url = this.url + '/login/google';
    return this.http.post( url, { token }).pipe(
      map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return resp;
      })
    );
  }

  login( usuario: Usuario, remember = false ){

    if( remember ){
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = this.url + '/login';

    return this.http.post( url, usuario ).pipe(
      map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return resp;
      }),
      catchError( err => {
        swal('Error', err.error.mensaje, 'error');
        return of(err);
      })
      
    );
  }

  logout(){
    this.usuario = null;
    this.usuario = null;
    this.menu    = [];
    this.limpiarStorage();
    this.router.navigate(['/login']);
  }

  crearUsuario( usuario: Usuario ){
    let url = this.url + '/usuario';

    return this.http.post( url, usuario ).pipe(
      map( (resp: any) => {

        swal('Éxito', 'Usuario' + usuario.email  + ' creado correctamente', 'success');
        return resp.usuario;

      }),
      catchError( err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return of(err);
      })
    );

  }

  actualizarUsuario( usuario: Usuario ){
    let url = this.url + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario ).pipe(
      map( (resp: any) => {

        if( usuario._id === this.usuario._id ){
          this.guardarStorage( resp.usuario._id, this.token, resp.usuario );
        }
        swal('Éxito', 'Usuario ' + usuario.nombre  + ' actualizado correctamente', 'success');

        return resp;
      }),
      catchError( err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return of(err);
      })
    );
  }

  cambiarImagen( file: File, id: string ){
    this._subirArchivoService.subirArchivo( file, 'usuarios', id )
      .then( (resp: any)=> {
        this.usuario.img = resp.usuario.img;
        swal('Éxito', 'Imagen de ' + resp.usuario.email  + ' actualizada correctamente', 'success');
        this.guardarStorage( resp.usuario._id, this.token, resp.usuario );
      })
      .catch( err => {
        console.log(err);
      });

  }

  cargarUsuarios(desde: number = 0){
    let url = URL_SERVICES + '/usuario?desde=' + desde;
    return this.http.get( url );
  }

  buscarUsuarios( term: string){
    let url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + term;
    return this.http.get( url ).pipe(
      map( (resp: any) => resp.usuarios)
    );
  }

  borrarUsuario( id: string ){
    let url = URL_SERVICES + '/usuario/' + id + '?token=' + this.token;
    return this.http.delete( url );
  }

}
