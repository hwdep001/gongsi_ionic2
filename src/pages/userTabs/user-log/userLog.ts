import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../providers/loading-service/loading-service';

@Component({
  selector: 'page-userLog',
  templateUrl: 'userLog.html'
})
export class UserLogPage {
  @ViewChild(Content) content: Content

  logRef: firebase.database.Reference;

  logList: Array<any>;
  loadedLogList: Array<any>;

  constructor(
    private _loading: LoadingService
  ) {
    this.logRef = firebase.database().ref("/logs/user");
    this.getLogList();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserLogPage');
  }

  ionViewWillEnter() {
    this.content.scrollToBottom(0);
  }

  getLogList() {
    const loader = this._loading.getLoader(null, null);
    loader.present();
    
    this.logRef.orderByChild("createDate").on('value', snapList => {
      let logs = [];
     
      snapList.forEach( v => {
        logs.push(v.val());
        return false;
      });

      this.loadedLogList = logs;
      // this.initializeVs();
      this.logList = this.loadedLogList;
      loader.dismiss();
    });
  }

}
