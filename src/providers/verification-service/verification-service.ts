import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { CommonUtil } from './../../utils/commonUtil';
import { UserService } from './../user-service/user-service';
import { AuthService } from './../auth-service/auth-service';
import { LogUserService } from './../log-user-service/log-user-service';

import { Verification } from './../../model/Verification';
import { LogUser } from './../../model/LogUser';

@Injectable()
export class VerificationService {

  vRef: firebase.database.Reference;

  constructor(
    private _user: UserService,
    private _auth: AuthService,
    private _logUser: LogUserService
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
    let returnVal: string = "fail";
    const currentDate = CommonUtil.getCurrentDate();

    // verification 조회
    let verification: any = await this.getVerification(key);

    // 존재하는지 사용가능한지 확인
    if(verification != null && verification.vUid == null) {
      verification.vUid = uid;
      verification.vDate = currentDate;

      // verification 업데이트
      await this.updateVerification(verification)
      .then( () => result = true)
      .catch(err => console.log(err));
    } else {
      returnVal = "unusable";
    }

    // user 업데이트
    if(result) {
      result = false;

      await this._user.signupUser(verification)
      .then( () => result = true)
      .catch(err => console.log(err));
    }

    let logUser: LogUser = {
      createDate: currentDate,
      type: "vs",
      uid: uid,
      vKey: key
    }
    
    // auth 서비스에 유저 정보 set
    if(result){
      await this._auth.setUser().then( () => returnVal = "suc");
    } else {
      logUser.type = "vf"
    }

    // log 추가
    this._logUser.createLogUser(logUser);

    return returnVal;
  }
}
