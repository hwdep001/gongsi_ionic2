import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../../providers/loading-service/loading-service';

import { User } from './../../../../model/User';

import { UserPhotoPage } from './../photo/userPhoto';

@Component({
  selector: 'page-userDetail',
  templateUrl: 'userDetail.html'
})
export class UserDetailPage {

  key: string;
  user: User = new User();
  userRef: firebase.database.Reference;

  constructor(
    private param: NavParams,
    private navCtrl: NavController,
    private _loading: LoadingService
  ) {
    this.key = this.param.get('key');
    this.userRef = firebase.database().ref(`/users/${this.key}`);

    this.getUser();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserDetailPage');
  }

  ionViewWillUnload() {
    // console.log('==> ionViewWillUnload UserDetailPage');
    this.userRef.off();
  }

  getUser() {
    const loader = this._loading.getLoader(null, null);
    loader.present();

    this.userRef.on('value', user => {
      this.user = user.val();
      loader.dismiss();
    });
  }

  showUserPhoto(photoURL: string) {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

}
