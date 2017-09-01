import { Component } from '@angular/core';
import { NavController, MenuController, ToastController } from 'ionic-angular';

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

  loader: any;

  constructor(
    private navCtrl: NavController,
    private menu: MenuController,
    private toastCtrl: ToastController,
    private _auth: AuthService,
    private _verification: VerificationService,
    private _loading: LoadingService
  ) {
    this.loader = _loading.getLoader(null, "Please wait...", true);
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad SignupPage');
  }

  clickSignOutBtn() {
    this._auth.signOut();
  }

  async getAuth() {
    this.loader.present();
    const code = this.verificationCode;

    if(CommonUtil.isStringEmpty(code)){
      this.errFlag = true;
      this.errMsg = "Please enter your verification code.";
    }else {
      let stepResult: any = await this._verification.isUsableVerificationCode(code);

      if(stepResult == false){
        this.showToast('top', "This is an unusable authentication code.");
        this.errFlag = true;
        this.errMsg = "This is an unusable authentication code.";
      } else{
        stepResult = await this._verification.registerVerificationCode(code, this._auth.uid);
        this.showToast('top', "Verification success!");
        this.menu.enable(true, 'menu');
        this.navCtrl.setRoot(HomePage)  
      }
    }
    this.isSubmitClick = true;
    this.loader.present();
  }

  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }
}
