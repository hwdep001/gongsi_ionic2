import { Component } from '@angular/core';

import { AuthService } from './../../providers/auth-service/auth-service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  authCode: string;

  constructor(
    private _auth: AuthService
  ) {
    
  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad SignupPage');
  }

  clickSignOutBtn() {
    this._auth.signOut();
  }

  getAuth() {

  }

}
