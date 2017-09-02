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
import { VerificationService } from '../providers/verification-service/verification-service';
import { UserService } from '../providers/user-service/user-service';

import { MyApp } from './app.component';
import { SigninPage } from './../pages/signin/signin';
import { SignupPage } from './../pages/signup/signup';
import { HomePage } from './../pages/home/home';
import { TabsPage } from './../pages/tabs/tabs';
  import { Tab3Page } from './../pages/tabs/tab3/tab3';
  import { Tab2Page } from './../pages/tabs/tab2/tab2';
  import { Tab1Page } from './../pages/tabs/tab1/tab1';
import { UserTabsPage } from './../pages/userTabs/userTabs';
  import { UserPage } from './../pages/userTabs/user/user';
    import { UserPhotoPage } from './../pages/userTabs/user/photo/userPhoto';
    import { UserDetailPage } from './../pages/userTabs/user/detail/userDetail';
  import { UserLogPage } from './../pages/userTabs/user-log/userLog';
  import { VerificationPage } from './../pages/userTabs/verification/verification';
    import { VerificationDetailPage } from './../pages/userTabs/verification/detail/verificationDetail';

@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    SignupPage,
    HomePage,
    TabsPage,
      Tab1Page,
      Tab2Page,
      Tab3Page,
    UserTabsPage,
      UserPage,
        UserPhotoPage,
        UserDetailPage,
      UserLogPage,
      VerificationPage,
        VerificationDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    SignupPage,
    HomePage,
    TabsPage,
      Tab1Page,
      Tab2Page,
      Tab3Page,
    UserTabsPage,
      UserPage,
        UserPhotoPage,
        UserDetailPage,
      UserLogPage,
      VerificationPage,
        VerificationDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVar,
    AuthService,
    VerificationService,
    LoadingService,
    UserService
  ]
})
export class AppModule {}
