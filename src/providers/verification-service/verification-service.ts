import { AuthService } from './../auth-service/auth-service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

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
          if(sub.val().regDate == false) result = true;
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

    let ref = this.vBasicRef.child(code);
    await ref.update({
      regDate: new Date(),
      regUid: uid
    }).then(() => {
      result = true;
    }).catch(err => {
      console.log(err);
    });

    if(result) {
      result = false;
      await firebase.database().ref(`users/${uid}`).update({
        verificationCode: code
      }).then(() => {
        result = true;
      }).catch(err => {
        ref.update({
          regDate: false,
          regUid: false
        })
        console.log(err);
      })
    }

    await this._auth.updateUserDB();
    
    return result;
  }

}
