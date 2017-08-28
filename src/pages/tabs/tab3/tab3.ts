import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-tab3',
  templateUrl: 'tab3.html'
})
export class Tab3Page {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad Tab3Page');
  }
}
