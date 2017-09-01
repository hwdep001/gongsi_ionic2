import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { LoadingService } from './../../../providers/loading-service/loading-service';
import { User } from './../../../model/User';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  userList: Array<any>;
  loadedUserList: Array<any>;
  userRef: firebase.database.Reference;

  loader: any;

  constructor(
    private db: AngularFireDatabase,
    private _loading: LoadingService
  ) {
    this.loader = _loading.getLoader(null, null);
    this.loader.present();

    this.userRef = firebase.database().ref("/users");
    this.getUserList();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserPage');
  }

  getUserList() {
    this.userRef.orderByChild("name").on('value', userList => {
      let users = [];
     
      userList.forEach( user => {
        users.push(user.val());
        return false;
      });

      this.loadedUserList = users;
      this.initializeUsers();
      
      this.loader.dismiss();
    })
  }

  initializeUsers(): void {
    this.userList = this.loadedUserList;
  }

  searchUsers(ev: any) {
    // Reset items back to all of the items
    this.initializeUsers();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.userList = this.userList.filter((item) => {
        return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1 
          || item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
