import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from './../../providers/auth-service/auth-service';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(
    public navCtrl: NavController,
    private _auth: AuthService
  ) {

  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad SigninPage');
  }

  signInWithGoogle() {
    this._auth.googleLogin()
    .then(() =>  {})
    .catch(error => console.log(error));;
  }
}
