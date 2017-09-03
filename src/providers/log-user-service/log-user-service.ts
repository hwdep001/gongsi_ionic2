import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { LogUser } from './../../model/LogUser';

@Injectable()
export class LogUserService {

  logRef: firebase.database.Reference;

  constructor(
  ) {
    this.logRef = firebase.database().ref("/logs/user");
  }

  createLogUser(logUser: LogUser) {
    this.logRef.push(logUser);
  }

}
