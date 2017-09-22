import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { Storage } from '@ionic/storage';
import { UserService } from './../user-service/user-service';
import { UserLogService } from './../userLog-service/userLog-service';

import { User } from './../../model/User';
import { UserLog } from './../../model/UserLog';

@Injectable()
export class AuthService {
  
  user: User;

  constructor(
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private _user: UserService,
    private _userLog: UserLogService
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

  get photoURL(): string {
    return this.isSignedIn ? this.user.photoURL : null;
  }

  get createDate(): string {
    return this.isSignedIn ? this.user.createDate : null;
  }

  get lastSigninDate(): string {
    return this.isSignedIn ? this.user.lastSigninDate : null;
  }

  get isSignedIn(): boolean {
    return this.user == null ? false : true;
  }

  get min(): boolean {
    return this.isSignedIn ? this.user.ad : false;
  }

  get authenticated(): boolean {
    return this.isSignedIn ? this.user.authenticated : false;
  }

  // // // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user data
  get currentUser(): any {
    return this.isSignedIn ? this.user : null;
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.isSignedIn ? this.afAuth.auth.currentUser.isAnonymous : false
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
    if(this.authenticated){
      const userLog: UserLog = {
        createDate: new Date().yyyy_MM_dd_HH_mm_ss(),
        type: "so",
        uid: this.uid
      }
      this._userLog.createUserLog(userLog);
    }
    return firebase.auth().signOut();
  }


  //// Helpers ////

  async signinProcess(currentUser: firebase.User) {

    // signOut
    if(!currentUser) {
      this.user = null;
      return;
    }

    const currentDate = new Date().yyyy_MM_dd_HH_mm_ss();
    let user: any;
    let userLog: UserLog = {
      createDate: currentDate,
      type: "si",
      uid: currentUser.uid
    }

    user = await this._user.getUser(currentUser.uid);
    if(user == null) {
      user = new User();
      user.uid = currentUser.uid;
      user.email = currentUser.email;
      user.name = currentUser.displayName;
      user.photoURL = currentUser.photoURL;
      user.createDate = currentDate;
      user.lastSigninDate = currentDate;
      user.authenticated = false;
      userLog.type = "su";

      await this._user.saveUser(user);
      this._userLog.createUserLog(userLog);
    } else if(user.authenticated) {
      user.email = currentUser.email;
      user.name = currentUser.displayName;
      user.photoURL = currentUser.photoURL;
      
      user.lastSigninDate = currentDate;

      await this._user.saveUser(user);
      this._userLog.createUserLog(userLog);
    }
    this.user = user;
  }
}
