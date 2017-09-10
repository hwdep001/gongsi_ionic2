import { Component } from '@angular/core';

import { UserPage } from './user/user';

@Component({
  selector: 'page-userTabs',
  templateUrl: 'userTabs.html',
})
export class UserTabsPage {

  tab1Root: any = UserPage;
//   tab2Root: any = appo;
//   tab3Root: any = UserLogPage;

  constructor() {
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserTabsPage');
  }
}
