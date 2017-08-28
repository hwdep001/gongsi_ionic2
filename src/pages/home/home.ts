import { GlobalVar } from './../../providers/global-var/global-var';
import { SigninPage } from './../signin/signin';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private _gv: GlobalVar
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  clickSignOutBtn() {
    this._gv.setIsSignedIn(false);
    this.navCtrl.setRoot(SigninPage);
  }

}
