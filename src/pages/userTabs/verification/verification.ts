import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

import { LoadingService } from './../../../providers/loading-service/loading-service';
import { VerificationService } from './../../../providers/verification-service/verification-service';

import { VerificationDetailPage } from './detail/verificationDetail';

@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html'
})
export class VerificationPage {

  vRef: firebase.database.Reference;
  
  vList: Array<any>;
  loadedVList: Array<any>;

  searchClicked: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _loading: LoadingService,
    private _verification: VerificationService
  ) {
    this.vRef = firebase.database().ref("/verifications");
    this.getVList();
  }

  ionViewDidLoad() {
    console.log('==> ionViewDidLoad VerificationPage');
  }

  ionViewWillUnload() {
    console.log('==> ionViewWillUnload VerificationPage');
    this.vRef.off();
  }

  getVList() {
    const loader = this._loading.getLoader(null, null);
    loader.present();
    
    this.vRef.orderByChild("createDate").on('value', vList => {
      let vs = [];
     
      vList.forEach( v => {
        vs.push(v.val());
        return false;
      });

      this.loadedVList = vs.reverse();
      this.initializeVs();
      
      loader.dismiss();
    });
  }

  initializeVs(): void {
    this.vList = this.loadedVList;
  }

  searchVs(ev: any) {
    // Reset items back to all of the items
    this.initializeVs();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.vList = this.vList.filter((item) => {

        return item.key.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    }
  }

  clearSearch(ev: any) {
    ev.target.value = null;
  }

  cancelSearch() {
    this.searchClicked = false;
    this.initializeVs();
  }

  createV() {
    let confirm = this.alertCtrl.create({
      title: '인증 코드 생성',
      message: '인증 코드를 생성하시겠습니까?',
      buttons: [
        { text: 'No' },
        {
          text: 'Yes',
          handler: () => {
            const loader = this._loading.getLoader(null, null);
            loader.present();
            this._verification.createVerificationCode();
            this.showToast('top', `인증 코드를 생성하였습니다.`);
            this.cancelSearch();
            loader.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }

  showVInfo(key: string){
    this.navCtrl.push(VerificationDetailPage, {key: key});
  }

  deleteV(key: string){
    let confirm = this.alertCtrl.create({
      title: '인증 코드 삭제',
      message: `인증 코드(${key})를 삭제하시겠습니까?`,
      buttons: [
        { text: 'No' },
        {
          text: 'Yes',
          handler: () => {
            const loader = this._loading.getLoader(null, null);
            loader.present();
            this._verification.deleteVerificationCode(key);
            this.showToast('top', `인증 코드(${key})를 삭제하였습니다.`);
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
}
