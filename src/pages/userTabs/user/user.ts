import { Component } from '@angular/core';
import { ModalController, NavController, AlertController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../providers/loading-service/loading-service';

import { UserPhotoPage } from './photo/userPhoto';
import { UserDetailPage } from './detail/userDetail';


@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  userRef: firebase.database.Reference;
  
  userList: Array<any>;
  loadedUserList: Array<any>;

  searchClicked: boolean = false;
  // infiniteScrollCnt: number = 2;
  

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _loading: LoadingService
  ) {
    this.userRef = firebase.database().ref("/users");
    this.getUserList();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserPage');
  }

  ionViewWillUnload() {
    // console.log('==> ionViewWillUnload UserPage');
    // this.userRef.off();
  }

  getUserList() {
    const loader = this._loading.getLoader(null, null);
    loader.present();

    this.userRef.orderByChild("name").on('value', userList => {
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

  clearSearch(ev: any) {
    ev.target.value = null;
  }

  cancelSearch() {
    this.searchClicked = false;
    this.initializeUsers();
  }

  showUserPhoto(photoURL: string) {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

  showUserInfo(key: string){
    this.navCtrl.push(UserDetailPage, {key: key});
  }

  deleteUser(key: string){
    let confirm = this.alertCtrl.create({
      title: '사용자 삭제',
      message: `사용자(${key})를 삭제하시겠습니까?`,
      buttons: [
        { text: 'No' },
        {
          text: 'Yes',
          handler: () => {
            const loader = this._loading.getLoader(null, null);
            loader.present();
            // this._verification.deleteVerificationCode(key);
            this.showToast('top', `사용자(${key})를 삭제하였습니다.`);
            this.cancelSearch();
            loader.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }


  private showToast(position: string, message: string, duration?: number) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: (duration == null) ? 2500 : duration
    });

    toast.present(toast);
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
