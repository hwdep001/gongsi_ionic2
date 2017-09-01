import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import * as firebase from 'firebase';

import { User } from './../../../../model/User';

import { UserPhotoPage } from './../photo/userPhoto';

@Component({
  selector: 'page-userDetail',
  templateUrl: 'userDetail.html'
})
export class UserDetailPage {

  uid: string;
  user: User = new User();
  userRef: firebase.database.Reference;

  constructor(
    private param: NavParams,
    private navCtrl: NavController
  ) {
    this.uid = this.param.get('uid');
    this.userRef = firebase.database().ref("/users");

    this.getUser();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserDetailPage');
  }

  getUser() {
    this.userRef.child(`${this.uid}`).on('value', user => {
      this.user = user.val();
    });
  }

  showUserPhoto(photoURL: string) {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

}
