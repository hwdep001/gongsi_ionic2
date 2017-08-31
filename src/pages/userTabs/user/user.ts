import { User } from './../../../model/User';
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  users: FirebaseListObservable<any[]>;
  userPath: string = "/users";

  constructor(
    private db: AngularFireDatabase
  ) {
    this.getUsers();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserPage');
  }

  getUsers() {
    this.users = this.db.list(this.userPath);
  }
}
