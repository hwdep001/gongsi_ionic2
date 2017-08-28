import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html'
})
export class Tab2Page {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad Tab2Page');
  }
}
