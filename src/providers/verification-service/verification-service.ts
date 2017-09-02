import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { CommonUtil } from './../../utils/commonUtil';
import { UserService } from './../user-service/user-service';
import { AuthService } from './../auth-service/auth-service';

import { Verification } from './../../model/Verification';

@Injectable()
export class VerificationService {

  vRef: firebase.database.Reference;

  constructor(
    private _user: UserService,
    private _auth: AuthService
  ) {
    this.vRef = firebase.database().ref('/verifications');
  }

  /**
   * Create verification.
   */
  async createVerificationCode() {
    let pushRef = this.vRef.push();
    let newCode: Verification = new Verification();
    newCode.key = pushRef.key,
    newCode.createDate = CommonUtil.getCurrentDate()
    
    await pushRef.set(newCode);
  }


  /**
   * Read verification.
   * @param key 
   */
  async getVerification(key: string) {
    let result: Verification;
    
    await this.vRef.child(`${key}`).once('value', snapshot => {
      result = snapshot.val();
    });

    return result;
  }


  /**
   * Update verification.
   * @param verification 
   */
  async updateVerification(verification: Verification) {
    let result: boolean = false;
    
    await this.vRef.child(`${verification.key}`).update(verification)
    .then( () => result = true)
    .catch(err => console.log(err));

    return result;
  }


  /**
   * Delete verification.
   * @param key 
   */
  async deleteVerificationCode(key: string) {
    await this.vRef.child(`${key}`).remove();
  }


  /**
   * Register verification code.
   * @param uid 
   * @param key 
   */
  async registerVerification(uid: string, key: string) {
    let result: boolean = false;

    let verification: Verification = {
      key: key,
      vUid: uid,
      vDate: CommonUtil.getCurrentDate()
    }

    await this.updateVerification(verification)
    .then( () => result = true)
    .catch(err => console.log(err));

    if(result) {
      result = false;

      await this._user.signupUser(verification)
      .then( () => result = true)
      .catch(err => console.log(err));
    }

    if(result){
      await this._auth.setUser();
    }

    return result;
  }
}
