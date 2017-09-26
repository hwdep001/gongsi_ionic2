import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AuthService } from '../providers/auth-service/auth-service';
import { GlobalVar } from '../providers/global-var/global-var';
import { LoadingService } from '../providers/loading-service/loading-service';
import { UserService } from './../providers/user-service/user-service';
import { UserLogService } from './../providers/userLog-service/userLog-service';
import { WordService } from '../providers/word-service/word-service';
import { FileService } from '../providers/file-service/file-service';

import { MyApp } from './app.component';
import { SplashPage } from './../pages/splash/spash';
import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { StudyPage } from './../pages/study/study';
import { TestCardPage } from './../pages/study/testCard/testCard';
import { TabsPage } from './../pages/tabs/tabs';
  import { Tab3Page } from './../pages/tabs/tab3/tab3';
  import { Tab2Page } from './../pages/tabs/tab2/tab2';
  import { Tab1Page } from './../pages/tabs/tab1/tab1';
import { UserTabsPage } from './../pages/userTabs/userTabs';
  import { UserPage } from './../pages/userTabs/user/user';
    import { UserPhotoPage } from './../pages/userTabs/user/photo/userPhoto';
    import { UserDetailPage } from './../pages/userTabs/user/detail/userDetail';
  import { ApprovePage } from './../pages/userTabs/approval/approval';
  import { UserLogPage } from './../pages/userTabs/user-log/userLog';
import { WordMngTabsPage } from './../pages/wordMngTabs/wordMngTabs';
  import { WordCrPage } from './../pages/wordMngTabs/word-cr/wordCr';
  import { WordMdPage } from './../pages/wordMngTabs/word-md/wordMd';
import { MyInfoPage } from './../pages/myInfo/myInfo';

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    SigninPage,
    HomePage,
    StudyPage,
      TestCardPage,
    TabsPage,
      Tab1Page,
      Tab2Page,
      Tab3Page,
    UserTabsPage,
      UserPage,
        UserPhotoPage,
        UserDetailPage,
      ApprovePage,
      UserLogPage,
    WordMngTabsPage,
      WordCrPage,
      WordMdPage,
    MyInfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    SigninPage,
    HomePage,
    StudyPage,
      TestCardPage,
    TabsPage,
      Tab1Page,
      Tab2Page,
      Tab3Page,
    UserTabsPage,
      UserPage,
        UserPhotoPage,
        UserDetailPage,
      ApprovePage,
      UserLogPage,
    WordMngTabsPage,
      WordCrPage,
      WordMdPage,
    MyInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVar,
    AuthService,
    LoadingService,
    UserService,
    UserLogService,
    WordService,
    FileService
  ]
})
export class AppModule {}