import { Component } from '@angular/core';

import { UserPage } from './user/user';
import { UserLogPage } from './user-log/userLog';
import { VerificationPage } from './verification/verification';

@Component({
  selector: 'page-userTabs',
  templateUrl: 'userTabs.html',
})
export class UserTabsPage {

  tab1Root: any = UserPage;
  tab2Root: any = VerificationPage;
  tab3Root: any = UserLogPage;

  constructor() {
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserTabsPage');
  }
}
