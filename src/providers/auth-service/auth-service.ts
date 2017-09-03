import { UserService } from './../user-service/user-service';
import { User } from './../../model/User';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { CommonUtil } from './../../utils/commonUtil';
import { LogUserService } from './../log-user-service/log-user-service';

import { LogUser } from './../../model/LogUser';

@Injectable()
export class AuthService {
  
  // authState: any = null;
  user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private storage: Storage,
    private _user: UserService,
    private _logUser: LogUserService
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
  
  get signinCnt(): number {
    return this.isSignedIn ? this.user.signinCnt : null;
  }
  
  get vKey(): any {
    return this.isSignedIn ? this.user.vKey : null;
  }

  get vDate(): any {
    return this.isSignedIn ? this.user.vDate : null;
  }
  
  get isSignedIn(): boolean {
    return this.user == null ? false : true;
  }
  
  get isAuthenticated(): boolean {
    const key = this.vKey
    return (key == null || key == false) ? false : true;
  }

  get min(): boolean {
    return this.isSignedIn ? this.user.ad : false;
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
    if(this.isAuthenticated){
      const logUser: LogUser = {
        createDate: CommonUtil.getCurrentDate(),
        type: "so",
        uid: this.uid
      }
      this._logUser.createLogUser(logUser);
    }
    return this.afAuth.auth.signOut();
  }


  //// Helpers ////

  /**
   * 로그인 처리
   */
  async signinProcess() {
    let result:boolean = false;
    const currentDate = CommonUtil.getCurrentDate();
    const currentUser = this.afAuth.auth.currentUser;
    
    if(currentUser == null){
      this.user = null;
      return result;
    }

    // user 조회
    let user: any = await this._user.getUser(currentUser.uid);
    const user_copy = user;

    if(user == null || user.vKey == null) {
      // sign up
      user = new User();
      user.createDate = currentDate;
      user.signinCnt = 0;
    } else {
      // sign in
      user.signinCnt += 1;
    }
    // sign up && sign in
    user.uid = currentUser.uid;
    user.email = currentUser.email;
    user.name = currentUser.displayName;
    user.photoURL = currentUser.photoURL;
    user.lastSigninDate = currentDate;

    // user save
    if(await this._user.saveUser(user)) {
      await this.setUser();
      result = true;
    }

    // create logUser
    let logUser: LogUser = {
      createDate: user.lastSigninDate,
      type: "su",
      uid: user.uid
    }
    if(user_copy == null) {
      this._logUser.createLogUser(logUser);
    } else if(user_copy.vKey !=null) {
      logUser.type = "si";
      logUser.cnt = user.signinCnt;
      this._logUser.createLogUser(logUser);
    }
    
    return result;
  }

  async setUser() {
    this.user = await this._user.getUser(this.afAuth.auth.currentUser.uid);
  }

}
