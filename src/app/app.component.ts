import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from "./services/global";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Musify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
  	this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
  	this._userService.signup(this.user).subscribe(
  	response => {
      let identity = response.user;
      this.identity = identity;
      if (!this.identity._id) {
        alert('El usuario no está correctamente identificado');
      } else {
        // crear session local storage
        localStorage.setItem('identity', JSON.stringify(identity));
        // conseguir token para enviar a cada peticion http
        this._userService.signup(this.user, 'true').subscribe(
          response => {
            let token = response.token;
            this.token = token;
            if (this.token.length <= 0) {
              alert('El token no se ha generado correctamente');
            } else {
              // crear session local storage para tener token disponible
              localStorage.setItem('token',JSON.stringify(token));
              this.user = new User('', '', '', '', '', 'ROLE_USER', '');
            }
          },
          error => {
            var errorMessage = <any>error;
            if (errorMessage != null) {
              var body = JSON.parse(error._body);
              this.errorMessage = body.message;       
            }
          })
      }
  	},
  	error => {
  		var errorMessage = <any>error;
  		if (errorMessage != null) {
        var body = JSON.parse(error._body);
        this.errorMessage = body.message;       
  		}
  	})
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }
      });
  }

}