import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVar {

  // platform: string;

  constructor(
    private storage: Storage
  ) {
    // this.syncPlatform();
  }

  // syncPlatform() {
  //   this.storage.get("platform")
  //   .then(val => this.platform = val)
  //   .catch(err => console.log(err));
  // }

  get(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
      .then((val) => {
        resolve(true);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  set(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.storage.set(key, value)
      .then((val) => {
        resolve(true);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }
}
