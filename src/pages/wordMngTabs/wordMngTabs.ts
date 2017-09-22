import { WordMdPage } from './word-md/wordMd';
import { WordCrPage } from './word-cr/wordCr';
import { Component } from '@angular/core';

@Component({
  selector: 'page-wordMngTabs',
  templateUrl: 'wordMngTabs.html',
})
export class WordMngTabsPage {

  tab1Root: any = WordMdPage;
  tab2Root: any = WordCrPage;

  constructor() {
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad TabsPage');
  }
}
