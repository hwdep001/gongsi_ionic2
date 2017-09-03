import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { Verification } from './../../model/Verification';
import { User } from './../../model/User';

@Injectable()
export class UserService {

  userRef: firebase.database.Reference;

  constructor(
  ) {
    this.userRef = firebase.database().ref("/users");
  }


  /**
   * Create || update user.
   * @param user 
   */
  async saveUser(user: User) {
    let result: boolean = false;

    await this.userRef.child(`${user.uid}`).update(user)
    .then( () => result = true)
    .catch(err => console.log(err));

    return result;
  }


  /**
   * Read user.
   * @param key 
   */
  async getUser(key: string) {
    let result: User;
    
    await this.userRef.child(`${key}`).once('value', snapshot => {
      result = snapshot.val();
    });

    return result;
  }


  /**
   * Update sign up data.
   * @param verification 
   */
  async signupUser(verification: Verification) {
    let result: boolean = false;
    const user: User = {
      uid: verification.vUid,
      vKey: verification.key,
      vDate: verification.vDate
    }

    await this.userRef.child(`${verification.vUid}`).update(user)
    .then( () => result = true)
    .catch(err => console.log(err));

    return result;
  }

}
