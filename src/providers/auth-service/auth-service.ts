import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
  
  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {

  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }



  //// Social Auth ////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    // switch(this._gv.platform) {
    //   case 'browser':
    //   case 'core':
    //     // return this.afAuth.auth.signInWithPopup(provider);
    //   case 'android':
    //   case 'ios':
    //   default:
    //     return this.afAuth.auth.signInWithRedirect(provider); 
    // }
    return this.afAuth.auth.signInWithRedirect(provider); 
  }



  //// Sign Out ////

  signOut() {
    return this.afAuth.auth.signOut();
  }


  //// Helpers ////

  updateUserData(): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features

    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data: CustomObject = {
                  email: this.authState.email,
                  name: this.authState.displayName,
                  last_login_date: new Date()
                }


    this.db.object(path, {preserveSnapshot: true})
    .subscribe(snapshot => {
      if(!snapshot.exists()) {
        data.create_date = new Date();
      } 
      this.db.object(path).update(data)
      .catch(error => console.log(error));
    });
    
  }
}
