import { AuthService } from './../auth-service/auth-service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { CommonUtil } from './../../utils/commonUtil';

import { Verification } from './../../model/Verification';

@Injectable()
export class VerificationService {

  vBasicRef = firebase.database().ref('verificationCodes');

  constructor(
    private _auth: AuthService
  ) {
    
  }

  async isUsableVerificationCode(code: string) {
    let result: boolean = false;

    await this.vBasicRef.orderByKey().equalTo(code).once('value')
    .then(snapshot => {

      if(snapshot.val() != null) {
        snapshot.forEach(sub => {
          console.log(sub);
          if(sub.val().vDate == false) result = true;
        });
      }

    })
    .catch(err => {
      console.log(err);
    });

    return result;
  }

  async registerVerificationCode(code: string, uid: string) {
    let result: boolean = false;

    const currentDate = CommonUtil.getCurrentDate();

    let ref = this.vBasicRef.child(code);
    await ref.update({
      vDate: currentDate,
      vUid: uid
    }).then(() => {
      result = true;
    }).catch(err => {
      console.log(err);
    });

    if(result) {
      result = false;
      await firebase.database().ref(`users/${uid}`).update({
        vCode: code,
        vDate: currentDate
      }).then(() => {
        result = true;
      }).catch(err => {
        ref.update({
          vDate: false,
          vUid: false
        })
        console.log(err);
      })
    }

    await this._auth.updateUserDB();
    
    return result;
  }

  async createVerificationCode() {
    let pushRef = this.vBasicRef.push();
    let newCode: Verification = new Verification();
    newCode.key = pushRef.key,
    newCode.createDate = CommonUtil.getCurrentDate()
    
    await pushRef.set(newCode);
  }

  async deleteVerificationCode(key: string) {
    await this.vBasicRef.child(`${key}`).remove();
  }
}
