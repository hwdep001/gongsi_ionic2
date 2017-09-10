import { CommonUtil } from './../../../utils/commonUtil';
import { User } from './../../../model/User';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad Tab1Page');
  }

  createUser() {
    for(let i=1; i<=10; i++){
      const currentDate = CommonUtil.getCurrentDate();
      const idx = (i<10 ? "0"+i.toString(): i);
      const user: User = {
        uid: `test${idx}`,
        email: `test${idx}`,
        name: `name${idx}`,
        createDate: currentDate,
        lastSigninDate: currentDate,
        authenticated: false
      }
      firebase.database().ref(`/users/${user.uid}`).set(user);
    }
  }

  removeUser() {
    for(let i=1; i<=10; i++){
      const idx = "test" + (i<10 ? "0"+i.toString(): i);
      firebase.database().ref(`/users/${idx}`).remove();
    }
  }
}
