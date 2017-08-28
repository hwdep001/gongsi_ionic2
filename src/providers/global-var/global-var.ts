import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVar {

  constructor(
    private storage: Storage
  ) {
    
  }
}
