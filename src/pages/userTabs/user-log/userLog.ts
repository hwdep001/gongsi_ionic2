import { ChatBubble } from './../../../model/ChatBubble';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../providers/loading-service/loading-service';
import { UserService } from './../../../providers/user-service/user-service';

import { UserDetailPage } from './../user/detail/userDetail';
import { UserPhotoPage } from './../user/photo/userPhoto';

@Component({
  selector: 'page-userLog',
  templateUrl: 'userLog.html',
})
export class UserLogPage {
  @ViewChild(Content) content: Content

  logRef: firebase.database.Reference;
  userRef: firebase.database.Reference;

  logList: Array<any>;
  loadedLogList: Array<any>;

  typeMap: Map<string, string>;

  constructor(
    private navCtrl: NavController,
    private _loading: LoadingService,
    private _user: UserService
  ) {
    this.setTypeMap()
    this.logRef = firebase.database().ref("/logs/user");
    this.userRef = firebase.database().ref("/users");
    this.getLogList();
  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad UserLogPage');
    this.scrollToBottom();
  }

  ionViewWillEnter() {
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 300);
  }

  setTypeMap() {
    this.typeMap = new Map();
    this.typeMap.set("ex", "종료");
    this.typeMap.set("su", "가입");
    this.typeMap.set("si", "로그인");
    this.typeMap.set("so", "로그아웃");
  }

  getTypeMap(type) {
    return this.typeMap.get(type);
  }

  getLogList() {
    const loader = this._loading.getLoader(null, null);
    loader.present();
    
    
    this.logRef.orderByChild("createDate").limitToLast(30).on('value', snapList => {
      let logs: ChatBubble[] = [];
     
      snapList.forEach( snapshot => {
        const userLog = snapshot.val();
        let log: ChatBubble = {
          uid: userLog.uid,
          position: userLog.type,
          time: userLog.createDate,
          content: this.getTypeMap(userLog.type)
        }

        this._user.getUser(log.uid).then(user => {
          log.img = user.photoURL;
          log.senderName = user.name;
          logs.push(log);
        });
            
        return false;
      });

      this.loadedLogList = logs;
      this.logList = this.loadedLogList;

      this.scrollToBottom();
      loader.dismiss();
    });
  }

  showUserPhoto(photoURL: string) {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

  showUserInfo(key: string){
    this.navCtrl.push(UserDetailPage, {key: key});
  }

}
