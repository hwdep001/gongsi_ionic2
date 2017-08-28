import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVar {

  // temporary variable for sign in check.
  isSignedIn: boolean = false;

  constructor(
    private storage: Storage
  ) {
    this.asyncIsSignedIn();
  }

  getIsSignedIn(): boolean {
    return this.isSignedIn;
  }

  setIsSignedIn(isSignedIn) {
    this.storage.set('isSignedIn', isSignedIn).then(val => {
      this.isSignedIn = val;
    });
  }

  asyncIsSignedIn() {
    this.storage.get('isSignedIn').then(val => {
      this.isSignedIn = val;
    });
  }

}
