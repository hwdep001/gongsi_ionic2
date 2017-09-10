import { NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import * as firebase from 'firebase';

import { UserService } from './../../../providers/user-service/user-service';
import { LoadingService } from './../../../providers/loading-service/loading-service';

import { User } from './../../../model/User';

import { UserPhotoPage } from './../user/photo/userPhoto';
import { UserDetailPage } from './../user/detail/userDetail';

@Component({
  selector: 'page-approval',
  templateUrl: 'approval.html'
})
export class ApprovePage {

  userRef: firebase.database.Reference;

  userList: Array<any>;
  loadedUserList: Array<any>;

  searchClicked: boolean = false;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private _loading: LoadingService,
    private _user: UserService
  ) {
    this.userRef = firebase.database().ref("/users");
    this.getUserList();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserLogPage');
  }
  
  ionViewWillEnter() {
  }

  getUserList() {
    const loader = this._loading.getLoader(null, null);
    loader.present();

    this.userRef.orderByChild("authenticated").equalTo(false).on('value', userList => {
      let users = [];
     
      userList.forEach( user => {
        users.push(user.val());
        return false;
      });

      this.loadedUserList = users;
      this.initializeUsers();
      
      loader.dismiss();
    });
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

  showUserPhoto(photoURL: string) {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

  showUserInfo(key: string){
    this.navCtrl.push(UserDetailPage, {key: key});
  }

  async approveSignUp(uid: string) {
      const user: User = {
        uid: uid,
        authenticated: true
      }
      let resutl = await this._user.saveUser(user);
      let message: string;
      if(resutl) {
        message = "가입 승인";
      } else {
        message = "가입 승인 실패";
      }
      this.showToast("top", message);
  }

  clearSearch(ev: any) {
    ev.target.value = null;
  }

  cancelSearch() {
    this.searchClicked = false;
    this.initializeUsers();
  }


  private showToast(position: string, message: string, duration?: number) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: (duration == null) ? 2500 : duration
    });

    toast.present(toast);
  }
}
