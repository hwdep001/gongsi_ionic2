import { Component } from '@angular/core';

import { UserPage } from './user/user';
import { ApprovePage } from './approval/approval';
import { UserLogPage } from './user-log/userLog';

@Component({
  selector: 'page-userTabs',
  templateUrl: 'userTabs.html',
})
export class UserTabsPage {

  tab1Root: any = UserPage;
  tab2Root: any = ApprovePage;
  tab3Root: any = UserLogPage;

  constructor() {
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad UserTabsPage');
  }
}
