// import { UserLogPage } from './../pages/userTabs/user-log/userLog';
// import { Component, ViewChild } from '@angular/core';
// import { App, Nav, Platform, MenuController, AlertController } from 'ionic-angular';
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { Storage } from '@ionic/storage';

// import { CommonUtil } from './../utils/commonUtil';
// import { AuthService } from './../providers/auth-service/auth-service';
// import { LoadingService } from './../providers/loading-service/loading-service';
// import { UserLogService } from './../providers/userLog-service/userLog-service';

// import { MenuTitleInterface } from './../model/MenuTitleInterface';
// import { PageInterface } from './../model/PageInterface';
// import { UserLog } from './../model/UserLog';

// import { SigninPage } from './../pages/signin/signin';
// import { SignupPage } from './../pages/signup/signup';
// import { HomePage } from './../pages/home/home';
// import { TabsPage } from './../pages/tabs/tabs';
// import { UserTabsPage } from './../pages/userTabs/userTabs';

// @Component({
//   templateUrl: 'app.html'
// })
// export class MyApp {
//   @ViewChild(Nav) nav: Nav;

//   lastBack: any;
//   rootPage: any;
//   navigatePages: PageInterface[];
//   adminPages: PageInterface[];
//   accountPages: PageInterface[];
//   menuTitle: MenuTitleInterface = {
//     header: null,
//     navigate: null,
//     admin: null,
//     account: null
//   }

//   constructor(
//     private platform: Platform,
//     private statusBar: StatusBar, 
//     private splashScreen: SplashScreen,
//     private app: App,
//     private menu: MenuController,
//     private alertCtrl: AlertController,
//     private storage: Storage,
//     private afAuth: AngularFireAuth,
//     private _auth: AuthService,
//     private _loading: LoadingService,
//     private _userLog: UserLogService
//   ) {
//     console.log("MyApp - =======================");
//     console.log("MyApp - Create a component.");
//     this.initializeApp();
//     this.subscribeAuth();
//   }

//   initializeApp() {
//     console.log("MyApp - Initialize App.");
//     this.platform.ready().then(() => {
//       // Okay, so the platform is ready and our plugins are available.
//       // Here you can do any higher level native things you might need.
//       console.log("MyApp - Platform ready.");
//       this.statusBar.styleDefault();
//       this.splashScreen.hide();
//       this.platform.registerBackButtonAction(() => this.exitApp());
//       this.savePlatform();
//     });
//   }

//   private exitApp() {
//     let confirm = this.alertCtrl.create({
//       message: '종료하시겠습니까?',
//       buttons: [
//         { text: 'No' },
//         {
//           text: 'Yes',
//           handler: () => {
//             if(this._auth.isAuthenticated){
//               const userLog: UserLog = {
//                 createDate: CommonUtil.getCurrentDate(),
//                 type: "ex",
//                 uid: this._auth.uid
//               }
//               this._userLog.createUserLog(userLog);
//             }
//             this.platform.exitApp();
//           }
//         }
//       ]
//     });
    
//     const overlay = this.app._appRoot._overlayPortal.getActive();
//     const nav = this.app.getActiveNavs()[0];

//     if(this.menu.isOpen()) {
//       this.menu.close();
//     }else if(overlay && overlay.dismiss) {
//       overlay.dismiss();
//     } else if(nav.canGoBack()){
//       nav.pop();
//     } else if(Date.now() - this.lastBack < 500) {
//       confirm.present();
//     }
//     this.lastBack = Date.now();
//   }

//   private setPages(): void {
//     const homePage: PageInterface = { title: '대시보드', name: 'HomePage',  component: HomePage, icon: 'home' };
//     const tabsPage: PageInterface = { title: 'Tabs', name: 'TabsPage', component: TabsPage, icon: 'home'};
//     const userTabsPage: PageInterface = { title: '사용자 관리', name: 'UserTabsPage', component: UserTabsPage, icon: 'people' };
//     const signOut: PageInterface = { title: '로그아웃', name: 'signOut', component: UserTabsPage, icon: 'log-out', signout: true };

//     this.navigatePages = [];
//     this.navigatePages.push(homePage);
//     this.navigatePages.push(tabsPage);

//     if(this._auth.min) {
//       this.adminPages = [];
//       this.adminPages.push(userTabsPage);
//     }

//     this.accountPages = [];
//     this.accountPages.push(signOut);
//   }

//   subscribeAuth() {
//     this.afAuth.authState.subscribe((auth) => {
//       this.initializeMenu();
//     });
//   }
  
//   async initializeMenu() {
//     let loading = this._loading.getLoader(null, null, true);
//     loading.present();

//     const updateUserResult = await this._auth.signinProcess();

//     this.menu.enable(false, 'menu');
//     this.menuTitle.header = "Menu";
//     this.menuTitle.navigate = "Navigate";
//     this.menuTitle.admin = "Admin";
//     this.menuTitle.account = "Account";
//     this.setPages();

//     if (updateUserResult && this._auth.isAuthenticated) {
      
//       this.menu.enable(updateUserResult == true, 'menu');
//       this.rootPage = UserLogPage;

//       console.log("MyApp - authenticated: Sign in");
//     } else if (updateUserResult && this._auth.isSignedIn) {
//       this.rootPage = SignupPage;
//       console.log("MyApp - authenticated: Sign in");
//     } else {
//       this.rootPage = SigninPage;
//       console.log("MyApp - authenticated: Sign out");
//     }

//     loading.dismiss();
//   }

//   async savePlatform() {

//     let thisPlatform = null;

//     if(this.platform.is('browser')) {
//       thisPlatform = "browser";
//     } else if (this.platform.is('core')) {
//       thisPlatform = "core";
//     } else if (this.platform.is('android')) {
//       thisPlatform = "android";
//     } else if (this.platform.is('ios')) {
//       thisPlatform = "ios";
//     }

//     await this.storage.set("platform", thisPlatform)
//     .then(platform => {
//       console.log("MyApp - Current platform: " + platform);
//     });
//   }

//   async openPage(page) {
//     // Reset the content nav to have just this page
//     // we wouldn't want the back button to show in this scenario

//     if(page.signout){
//       await this._auth.signOut();
//     }else {
//       this.nav.setRoot(page.component);
//     }

//   };

//   isActive(page: PageInterface) {
//     // let childNav = this.nav.getActiveChildNavs()[0];

//     // Tabs are a special case because they have their own navigation
//     // if (childNav) {
//     //   if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
//     //     return 'primary';
//     //   }
//     //   return;
//     // }

//     if (this.nav.getActive() && this.nav.getActive().name === page.name) {
//       return 'primary';
//     }
//     return;
//   }
// }

