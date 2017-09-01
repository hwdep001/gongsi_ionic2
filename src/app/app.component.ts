import { UserPage } from './../pages/userTabs/user/user';
import { MenuTitle, PageInterface } from './app.component';
import { UserTabsPage } from './../pages/userTabs/userTabs';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import { AuthService } from './../providers/auth-service/auth-service';

import { SigninPage } from './../pages/signin/signin';
import { SignupPage } from './../pages/signup/signup';
import { HomePage } from './../pages/home/home';
import { TabsPage } from './../pages/tabs/tabs';

export interface PageInterface {
  title: string;
  name?: string;
  component: any;
  icon: string;
  signout?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

export interface MenuTitle {
  header: string;
  navigate: string;
  admin: string;
  account: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  navigatePages: PageInterface[];
  adminPages: PageInterface[];
  accountPages: PageInterface[];
  menuTitle: MenuTitle = {
    header: null,
    navigate: null,
    admin: null,
    account: null
  }

  
  constructor(
    private platform: Platform,
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    private menu: MenuController,
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private _auth: AuthService
  ) {
    console.log("MyApp - =======================");
    console.log("MyApp - Create a component.");
    this.initializeApp();
    this.subscribeAuth();
  }

  initializeApp() {
    console.log("MyApp - Initialize App.");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log("MyApp - Platform ready.");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.savePlatform();
    });
  }

  private setPages(): void {
    const homePage: PageInterface = { title: '대시보드', name: 'HomePage',  component: HomePage, icon: 'home' };
    const tabsPage: PageInterface = { title: 'Tabs', name: 'TabsPage', component: TabsPage, icon: 'home'};
    const userTabsPage: PageInterface = { title: '사용자 관리', name: 'UserTabsPage', component: UserTabsPage, icon: 'people' };
    const signOut: PageInterface = { title: '로그아웃', name: 'signOut', component: UserTabsPage, icon: 'log-out', signout: true };

    this.navigatePages = [];
    this.navigatePages.push(homePage);
    this.navigatePages.push(tabsPage);

    this.adminPages = [];
    this.adminPages.push(userTabsPage);

    this.accountPages = [];
    this.accountPages.push(signOut);
  }

  subscribeAuth() {
    this.afAuth.authState.subscribe((auth) => {
      this.initializeMenu(auth);
    });
  }
  
  async initializeMenu(auth) {
    this.menu.enable(false, 'menu');
    this.menuTitle.header = "Menu";
    this.menuTitle.navigate = "Navigate";
    this.menuTitle.admin = "Admin";
    this.menuTitle.account = "Account";
    this.setPages();

    const updateUserResult = await this._auth.updateUserDB();

    if (updateUserResult && this._auth.isAuthenticated) {
      
      this.menu.enable(updateUserResult == true, 'menu');
      this.rootPage = UserPage;

      console.log("MyApp - authenticated: Sign in");
    } else if (updateUserResult && this._auth.isSignedIn) {
      this.rootPage = SignupPage;
      console.log("MyApp - authenticated: Sign in");
    } else {
      this.rootPage = SigninPage;
      console.log("MyApp - authenticated: Sign out");
    }
  }

  async savePlatform() {

    let thisPlatform = null;

    if(this.platform.is('browser')) {
      thisPlatform = "browser";
    } else if (this.platform.is('core')) {
      thisPlatform = "core";
    } else if (this.platform.is('android')) {
      thisPlatform = "android";
    } else if (this.platform.is('ios')) {
      thisPlatform = "ios";
    }

    await this.storage.set("platform", thisPlatform)
    .then(platform => {
      console.log("MyApp - Current platform: " + platform);
    });
  }

  async openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if(page.signout){
      await this._auth.signOut();
    }else {
      this.nav.setRoot(page.component);
    }

  };

  isActive(page: PageInterface) {
    // let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    // if (childNav) {
    //   if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
    //     return 'primary';
    //   }
    //   return;
    // }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}

