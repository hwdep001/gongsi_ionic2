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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  menuTitle: string;
  pages: Array<{title: string, component: any}>;
  
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
    const homePage = { title: 'Home', component: HomePage };
    const tabsPage = { title: 'Tabs', component: TabsPage };
    this.pages = [];
    this.pages.push(homePage);
    this.pages.push(tabsPage);
  }

  subscribeAuth() {
    this.afAuth.authState.subscribe((auth) => {
      this.initializeMenu(auth);
    });
  }
  
  async initializeMenu(auth) {
    this.menu.enable(false, 'menu');
    this.menuTitle = "Menu";
    this.setPages();

    const updateUserResult = await this._auth.updateUserDB();

    if (updateUserResult && this._auth.isAuthenticated) {
      this.menu.enable(updateUserResult == true, 'menu');
      this.rootPage = HomePage;
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  };
}

