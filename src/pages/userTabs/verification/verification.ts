import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html'
})
export class VerificationPage {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad VerificationPage');
  }
}
