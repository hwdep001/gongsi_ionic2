import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { TabsPage } from './../pages/tabs/tabs';
import { Tab3Page } from './../pages/tabs/tab3/tab3';
import { Tab2Page } from './../pages/tabs/tab2/tab2';
import { Tab1Page } from './../pages/tabs/tab1/tab1';
import { GlobalVar } from '../providers/global-var/global-var';

@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    HomePage,
    TabsPage,
    Tab1Page,
    Tab2Page,
    Tab3Page
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    HomePage,
    TabsPage,
    Tab1Page,
    Tab2Page,
    Tab3Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVar
  ]
})
export class AppModule {}
