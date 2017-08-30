import { User } from './../../model/User';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {
  
  // authState: any = null;
  user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private storage: Storage
  ) {

  }

  get uid(): string {
    return this.isSignedIn ? this.user.uid : null;
  }

  get email(): string {
    return this.isSignedIn ? this.user.email : null;
  }

  get name(): string {
    return this.isSignedIn ? this.user.name : null;
  }

  get createDate(): string {
    return this.isSignedIn ? this.user.createDate : null;
  }

  get lastSigninDate(): string {
    return this.isSignedIn ? this.user.lastSigninDate : null;
  }

  get signinCnt(): number {
    return this.isSignedIn ? this.user.signinCnt : null;
  }

  get signupCode(): string {
    return this.isSignedIn ? this.user.signupCode : null;
  }

  get isSignedIn(): boolean {
    return this.user != null;
  }

  get isAuthenticated(): boolean {
    return (this.signupCode == '-1') ? false : true;
  }

  // // // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user data
  get currentUser(): any {
    return this.isAuthenticated ? this.user : null;
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.isAuthenticated ? this.afAuth.auth.currentUser.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.user) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.user['name'] || 'User without a Name' }
  }



  //// Social Auth ////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  async socialSignIn(provider) {
    switch(await this.storage.get("platform")) {
      case 'browser':
      case 'core':
        return this.afAuth.auth.signInWithPopup(provider);
      case 'android':
      case 'ios':
      default:
        return this.afAuth.auth.signInWithRedirect(provider); 
    }
  }



  //// Sign Out ////

  signOut() {
    return this.afAuth.auth.signOut();
  }


  //// Helpers ////

  async updateUserDB() {
    let stepResult = false;
    const currentUser = this.afAuth.auth.currentUser;
    let path;
    let tempUser: CustomObject;
    
    // 로그인 유저 확인
    if(this.afAuth.auth.currentUser == null) {
      this.user = null;
    } else {
      path = `users/${currentUser.uid}`;
      stepResult = true;
    }

    // 업데이트 할 tempUser 저장
    if(stepResult){
      stepResult = false;
      tempUser = {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        lastSigninDate: new Date()
      }
  
      await firebase.database().ref(path).once('value')
      .then(snapshot => {
        if(snapshot.exists()) {
          tempUser.signinCnt = ++snapshot.val().signinCnt;
          tempUser.signupCode = snapshot.val().signupCode;
        } else {
          tempUser.createDate = new Date();
          tempUser.signinCnt = 0;
          tempUser.signupCode = -1;
        }
        stepResult = true;
      })
      .catch(err => {
        console.log(err);
        stepResult = false;
      });
    }

    // tempUser db에 업데이트
    if(stepResult){
      stepResult = false;
      await firebase.database().ref(path).update(tempUser)
      .then(() => {
        stepResult = true;
      })
      .catch(err => {
        console.log(err);
        stepResult = false;
      })
    }

    // user 조회하여 변수에 저장
    if(stepResult){
      stepResult = false;
      await firebase.database().ref(path).once('value')
      .then(snapshot => {
        if(snapshot.exists()) {
          this.user = new User();
          this.user.uid = snapshot.val().uid;
          this.user.email = snapshot.val().email;
          this.user.name = snapshot.val().name;
          this.user.createDate = snapshot.val().createDate;
          this.user.lastSigninDate = snapshot.val().lastSigninDate;
          this.user.signinCnt = snapshot.val().signinCnt;
          this.user.signupCode = snapshot.val().signupCode;
        } else {
          this.user = null;
        }
        stepResult = true;
      })
      .catch(err => {
        console.log(err);
        stepResult = false;
      });
    }
    
    return new Promise((resolve, reject) => resolve(stepResult));
  }

}
