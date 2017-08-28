import { GlobalVar } from './../../providers/global-var/global-var';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(
    public navCtrl: NavController,
    private _gv: GlobalVar
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  clickSignBtn() {
    this._gv.setIsSignedIn(true);
    this.navCtrl.setRoot(HomePage);
  }
}
