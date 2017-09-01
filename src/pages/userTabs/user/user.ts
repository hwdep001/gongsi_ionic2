import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../providers/loading-service/loading-service';

import { User } from './../../../model/User';

import { UserPhotoPage } from './photo/userPhoto';
import { UserDetailPage } from './detail/userDetail';


@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  userRef: firebase.database.Reference;
  loader: any;

  searchClicked: boolean = false;
  infiniteScrollCnt: number = 2;

  userList: Array<any>;
  loadedUserList: Array<any>;
  

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
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
    this.userRef.orderByChild("name").once('value', userList => {
      let users = [];
     
      userList.forEach( user => {
        users.push(user.val());
        return false;
      });

      this.loadedUserList = users;
      this.initializeUsers();
      
      this.loader.dismiss();
    });
  }

  initializeUsers(): void {
    this.userList = this.loadedUserList;

    console.log();
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

  clearSearch(ev: any) {
    ev.target.value = null;
  }

  cancelSearch() {
    this.searchClicked = !this.searchClicked;
    this.initializeUsers();
  }

  showUserPhoto(photoURL: string) {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

  showUserInfo(uid: string){
    // let modal = this.modalCtrl.create(UserDetailPage, {uid: uid});
    // modal.present();
    this.navCtrl.push(UserDetailPage, {uid: uid});
  }

  deleteUser(userKey: string){
    console.log("deleteUser: " + userKey);
  }

  // doInfinite(infiniteScroll) {

  //   if(this.userList.length == this.loadedUserList.length) {
  //     infiniteScroll.complete();
  //     return;
  //   }

  //   setTimeout(() => {
  //     for(let i=0; i<this.infiniteScrollCnt; i++){
  //       if(this.userList.length == this.loadedUserList.length){
  //         break;
  //       }
  
  //       this.userList.push(this.loadedUserList[this.userList.length]);
  //     }
      
  //     infiniteScroll.complete();
  //   }, 300);
  // }
}
