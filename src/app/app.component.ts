import { WordMngTabsPage } from './../pages/wordMngTabs/wordMngTabs';
import { UserTabsPage } from './../pages/userTabs/userTabs';
import { SplashPage } from './../pages/splash/spash';
import { AngularFireAuth } from 'angularfire2/auth';
import { MenuTitleInterface } from './../model/MenuTitleInterface';
import { PageInterface } from './../model/PageInterface';
import { ViewChild, Component } from '@angular/core';
import { Nav, Platform, App, AlertController, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserLogService } from './../providers/userLog-service/userLog-service';
import { AuthService } from './../providers/auth-service/auth-service';
import { LoadingService } from './../providers/loading-service/loading-service';

import { UserLog } from './../model/UserLog';

import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { StudyPage } from './../pages/study/study';
import { TabsPage } from './../pages/tabs/tabs';
import { MyInfoPage } from './../pages/myInfo/myInfo';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = SplashPage;
  lastBack: any;

  navigatePages: PageInterface[];
  adminPages: PageInterface[];
  accountPages: PageInterface[];
  menuTitle: MenuTitleInterface = {
    header: null,
    navigate: null,
    admin: null,
    account: null
  }
  
  constructor(
    private platform: Platform,
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    private app: App,
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private menu: MenuController,
    private _auth: AuthService,
    private _loading: LoadingService,
    private _userLog: UserLogService
  ) {
    this.initializeApp();
    this.subscribeAuth();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => this.exitApp());
      this.savePlatform();
    });
  }

  subscribeAuth() {
    this.afAuth.authState.subscribe((auth) => {
      this.initializeMenu(auth);
    });
  }

  async initializeMenu(auth: firebase.User) {
    let loader = this._loading.getLoader(null, null);
    loader.present();

    await this._auth.signinProcess(auth);
    this.setPages();

    loader.dismiss();
    if(auth != null && this._auth.authenticated) {
      this.nav.setRoot(HomePage);
    } else if (auth != null && !this._auth.authenticated) {
      this.showAprovalToast();
    } else {
      this.nav.setRoot(SigninPage);
    }
  }

  private setPages(): void {
    const homePage: PageInterface = { title: '대시보드', name: 'HomePage',  component: HomePage, icon: 'home' };
    const ewPage: PageInterface = { title: '영단어', name: 'EwPage',  component: StudyPage, param: {key: "ew"}, icon: 'book' };
    const lwPage: PageInterface = { title: '외래어', name: 'LwPage',  component: StudyPage, param: {key: "lw"}, icon: 'book' };
    const tabsPage: PageInterface = { title: 'Tabs', name: 'TabsPage', component: TabsPage, icon: 'home'};
    const userTabsPage: PageInterface = { title: '사용자 관리', name: 'UserTabsPage', component: UserTabsPage, icon: 'people' };
    const wordMngTabsPage: PageInterface = { title: '단어 관리', name: 'WordMngTabsPage', component: WordMngTabsPage, icon: 'logo-wordpress' };
    const myInfoPage: PageInterface = { title: '내 정보', name: 'MyInfoPage', component: MyInfoPage, icon: 'information-circle' };

    if(this._auth.authenticated){
      this.navigatePages = [];
      this.navigatePages.push(homePage);
      this.navigatePages.push(ewPage);
      this.navigatePages.push(lwPage);
      this.navigatePages.push(tabsPage);
    }

    if(this._auth.min) {
      this.adminPages = [];
      this.adminPages.push(userTabsPage);
      this.adminPages.push(wordMngTabsPage);
    }

    if(this._auth.authenticated){
      this.accountPages = [];
      this.accountPages.push(myInfoPage);
    }

    this.menuTitle.header = "Menu";
    this.menuTitle.navigate = "Navigate";
    this.menuTitle.admin = "Admin";
    this.menuTitle.account = "Account";
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

  private exitApp() {
    
    
    const overlay = this.app._appRoot._overlayPortal.getActive();
    const nav = this.app.getActiveNavs()[0];

    if(this.menu.isOpen()) {
      this.menu.close();
    }else if(overlay && overlay.dismiss) {
      overlay.dismiss();
    } else if(nav.getActive().name == "TestCardPage"){
      this.showConfirmAlert("종료하시겠습니까?", ()=> {
        nav.pop();  
      });
    } else if(nav.canGoBack()){
      nav.pop();
    } else if(Date.now() - this.lastBack < 500) {
      this.showConfirmAlert("EXIT?", () => {
        if(this._auth.authenticated){
          const userLog: UserLog = {
            createDate: new Date().yyyy_MM_dd_HH_mm_ss(),
            type: "ex",
            uid: this._auth.uid
          }
          this._userLog.createUserLog(userLog);
        }
        this.platform.exitApp();
      });
    }
    this.lastBack = Date.now();
  }

  openPage(page: PageInterface) {
    this.nav.setRoot(page.component, page.param);
  }

  isActive(page: PageInterface) {
    // let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    // if (childNav) {
    //   if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
    //     return 'primary';
    //   }
    //   return;
    // }
    
    if (this.nav.getActive()) {
      if(this.nav.getActive().name === page.name) {
        return 'primary';
      } else if(this.nav.getActive().name == "StudyPage" && (page.name == "EwPage" || page.name == "LwPage") 
                && this.nav.getActive().getNavParams().get("key") == page.param.key) {
        return 'primary';
      }
    }
    return;
  }

  showAprovalToast() {
    const toast = this.toastCtrl.create({
      message: "승인 대기 중 입니다.",
      showCloseButton: true,
      closeButtonText: '확인'
    });

    toast.onDidDismiss(() => {
      this._auth.signOut();
    });

    toast.present();
  }

  showConfirmAlert(message: string, yesHandler) {
    let confirm = this.alertCtrl.create({
      message: message,
      buttons: [
        { text: 'No' },
        {
          text: 'Yes',
          handler: () => {
            yesHandler();
          }
        }
      ]
    });
    confirm.present();
  }

}