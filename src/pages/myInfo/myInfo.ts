import { User } from './../../model/User';
import { AuthService } from './../../providers/auth-service/auth-service';
import { UserService } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';

@Component({
  selector: 'page-myInfo',
  templateUrl: 'myInfo.html',
})
export class MyInfoPage {

  info: User = new User();

  constructor(
    private _auth: AuthService,
    private _user: UserService
  ) {
    this.getInfo();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MyInfoPage');
  }

  getInfo() {
    this._user.getUser(this._auth.uid).then(user => {
      this.info = user;
    });
  }

  signOut() {
    this._auth.signOut();
  }

}
