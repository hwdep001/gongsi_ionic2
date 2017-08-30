import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserPage');
  }
}
