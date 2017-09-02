import { Component } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController } from 'ionic-angular';

import { AuthService } from './../../providers/auth-service/auth-service';
import { VerificationService } from './../../providers/verification-service/verification-service';
import { LoadingService } from './../../providers/loading-service/loading-service';
import { CommonUtil } from './../../utils/commonUtil';

import { HomePage } from './../home/home';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  verificationCode: string;
  isSubmitClick: boolean = false;
  errMsg: string = "";
  errFlag: boolean = false;

  constructor(
    private navCtrl: NavController,
    private menu: MenuController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private _auth: AuthService,
    private _verification: VerificationService,
    private _loading: LoadingService
  ) {
    
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad SignupPage');
  }

  clickSignOutBtn() {
    this._auth.signOut();
  }

  async getAuth(code: string) {
    let loader = this._loading.getLoader(null, "Please wait...", true);
    loader.present();

    let errCode: string = null;

    if(CommonUtil.isStringEmpty(code)){
      errCode = "empty";

    }else {
      // verification 조회
      let verification: any = await this._verification.getVerification(code);

      if(verification != null && verification.vUid == null) {

        // 인증 처리
        if(await this._verification.registerVerification(this._auth.uid, code)) {
          this.showToast('top', "Verification success!");
          this.menu.enable(true, 'menu');
          this.navCtrl.setRoot(HomePage);

        } else {
          this.showUpdateFailAlert();
        }
        
      } else{
        errCode = "unusable";
      }
    }

    switch(errCode) {
    case "empty":
      this.errFlag = true;
      this.errMsg = "인증 코드를 입력해 주십시오.";
      break;
    case "unusable":
      this.errFlag = true;
      this.errMsg = "사용할 수 없는 인증 코드 입니다.";
      this.showToast('top', "This is an unusable authentication code.");
      break;
    }

    this.isSubmitClick = true;
    loader.dismiss();
  }

  /**
   * show update fail alert.
   */
  showUpdateFailAlert() {
    let alert = this.alertCtrl.create({
      title: '인증 실패!',
      subTitle: '잠시 후 다시 시도해 주십시오.',
      buttons: ['Close']
    });
    alert.present();
  }

  /**
   * Show toast.
   * @param position 
   * @param message 
   */
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }
}
