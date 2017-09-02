import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../../providers/loading-service/loading-service';

import { Verification } from './../../../../model/Verification';

@Component({
  selector: 'page-verificationDetail',
  templateUrl: 'verificationDetail.html'
})
export class VerificationDetailPage {

  key: string;
  verification: Verification = new Verification();
  vRef: firebase.database.Reference;

  constructor(
    private param: NavParams,
    private _loading: LoadingService
  ) {
    this.key = this.param.get('key');
    this.vRef = firebase.database().ref(`/verifications/${this.key}`);

    this.getVerification();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad VerificationDetailPage');
  }

  ionViewWillUnload() {
    // console.log('==> ionViewWillUnload VerificationDetailPage');
    this.vRef.off();
  }

  getVerification() {
    const loader = this._loading.getLoader(null, null);
    loader.present();

    this.vRef.on('value', verification => {
      this.verification = verification.val();
      loader.dismiss();
    });
  }
  
}
