import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { User } from './../../model/User';

@Injectable()
export class UserService {

  userRef: firebase.database.Reference;

  constructor(
  ) {
    this.userRef = firebase.database().ref("/users");
  }

  /**
   * Set user.
   * @param user 
   */
  async createUser(user: User) {
    let result: boolean = false;

    await this.userRef.child(`${user.uid}`).set(user)
    .then()
    .catch(err => console.log("createUser fail - " + err.name + ": " + err.message));

    return result;
  }


  /**
   * Create || update user.
   * @param user 
   */
  async saveUser(user: User) {
    let result: boolean = false;

    await this.userRef.child(`${user.uid}`).update(user)
    .then( () => result = true)
    .catch(err => console.log('saveUser ERROR: ' + err.message));

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

}
