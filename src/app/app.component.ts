import { Storage } from '@ionic/storage';
import { GlobalVar } from './../providers/global-var/global-var';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { TabsPage } from './../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any;
  pages: Array<{title: string, component: any}>;
  isSignedIn = false;
  
  constructor(
    private platform: Platform,
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    private _gv: GlobalVar,
    private storage: Storage
  ) {
    this.initializeApp();
    this.initializePages();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initializePages() {
    const homePage = { title: 'Home', component: HomePage };
    const tabsPage = { title: 'Tabs', component: TabsPage };
    this.pages = [];
    this.pages.push(homePage);
    this.pages.push(tabsPage);

    this.storage.get('isSignedIn').then(val => {
      if(val){
        this.rootPage = HomePage;
      } else {
        this.rootPage = SigninPage;
      }
    })
  }
}

