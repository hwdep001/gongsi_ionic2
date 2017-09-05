import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { UserLog } from './../../model/UserLog';

@Injectable()
export class UserLogService {

  logRef: firebase.database.Reference;

  constructor(
  ) {
    this.logRef = firebase.database().ref("/logs/user");
  }

  createUserLog(userLog: UserLog) {
    this.logRef.push(userLog);
  }

}
