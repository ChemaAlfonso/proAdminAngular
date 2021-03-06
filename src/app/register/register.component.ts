import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert';

// Services
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor( public _usuarioService: UsuarioService,
               private router: Router ) { }

  ngOnInit() {
    init_plugins();

    // Ejemplo FormGroup
    // let form = new FormGroup(
    // {
    //    key: new FormControl( valorPorDefecto, [...Validators] ),
    // },
    // {
    //   validators: funcionDeVValidacion()
    // });

    this.forma = new FormGroup({
      nombre: new FormControl(),
      apellidos: new FormControl(null, Validators.required ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, [Validators.required]),
      terms: new FormControl( false ),
    }, { validators: this.areEquals( 'password', 'password2' ) });

    this.forma.setValue({
      nombre: 'Test',
      apellidos: 'SurTest',
      email: 'test@test.com',
      password: '1234567',
      password2: '123456',
      terms: true,
    });

  }

  areEquals( campo1: string, campo2: string){
    return ( group: FormGroup ) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if( pass1 === pass2 ){
        return null;
      }

      return {
        areEquals: true
      };


    };
  }

  registrarUsuario(){

    if( this.forma.invalid ){
      return;
    }

    if( !this.forma.value.terms ){
      swal('Importante', 'Debe aceptar las condiciones', 'warning');
      return;
    }

    let usuario = new Usuario( 
      this.forma.value.nombre,
      this.forma.value.apellidos,
      this.forma.value.email,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario( usuario )
      .subscribe( 
        resp => {
          console.log(resp);
          if( resp.status == 200 ){
            this.router.navigate(['/login']);
          }
        },
        error => {
          console.log(error);
          swal('Error', error.error.errors.message, 'error');
        }
      );

  }

}
