import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingService {

  constructor(
    private loadingCtrl: LoadingController
  ) {
    
  }

  getLoader(spinner: string, content: string, dismissOnPageChange?: boolean) {
    spinner = spinner ? spinner : "bubbles";
    content = content ? content : "Please wait...";
    dismissOnPageChange = dismissOnPageChange == true ? true : false;
    
    return this.loadingCtrl.create({
      spinner: spinner,
      content: content,
      dismissOnPageChange: dismissOnPageChange
    });
  }

}
