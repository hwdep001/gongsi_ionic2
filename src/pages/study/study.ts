import { WordSearch } from './../../model/WordSearch';
import { TestCardPage } from './testCard/testCard';
import { CommonUtil } from './../../utils/commonUtil';
import { Lecture } from './../../model/Lecture';
import { LoadingService } from './../../providers/loading-service/loading-service';
import { Category } from './../../model/Category';
import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { WordService } from './../../providers/word-service/word-service';

import { Subject } from './../../model/Subject';

@Component({
  selector: 'page-study',
  templateUrl: 'study.html',
})
export class StudyPage {

  searchFlag: boolean = false;
  
  subject: Subject;
  categories: Array<Category> = new Array<Category>();
	lectures: Array<Lecture> = new Array<Lecture>();
  levels: Array<any> = new Array<any>();
  counts: Array<any> = new Array<any>();

	selectedSub: string = null;
	selectedCats: Array<string> = new Array<string>();
  selectedLecs: Array<string> = new Array<string>();
  selectedLevs: Array<number> = new Array<number>();
  selectedCnt: number;

  constructor(
    private navCtrl: NavController,
    private param: NavParams,
    private _loading: LoadingService,
    private _word: WordService
  ) {
    this.initData(this.param.get('key'));
  }
  
  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad StudyPage');
  }

  async initData(key: string) {
    let loading = this._loading.getLoader(null, null);
    loading.present();
    
    this.getLevels();
    this.getCounts();
    await this.getSubject(key);
    await this.getCategories();

    loading.dismiss();
  }

  getLevels() {
    const levels = CommonUtil.getWordLevels();

    levels.forEach(lev => {
      this.levels.push(lev);
      this.selectedLevs.push(lev.key);
    });
  }

  getCounts() {
    this.counts = CommonUtil.getWordCounts();
    this.selectedCnt = this.counts[0].key;
  }

  ///////////////////////////////////////////////////
	// SUBJECT
	///////////////////////////////////////////////////

  async getSubject(key: string) {    
    this.subject = await this._word.getSubject(key);
    this.selectedSub = this.subject.key;
  }


  ///////////////////////////////////////////////////
	// CATEGORY
  ///////////////////////////////////////////////////
  
  async getCategories() {
		this.categories = await this._word.getCategories(this.selectedSub);
  }
  
  async changeCategory() {
    let loading = this._loading.getLoader(null, null);
    loading.present();

    this.lectures = new Array<Lecture>();
    this.selectedLecs = new Array<string>();

    for(let selectedCat of this.selectedCats) {
      await this._word.getLectures(this.selectedSub, selectedCat).then(lecs => {
        this.lectures.pushArray(lecs);
      });
    }

    loading.dismiss();
  }
  

  ///////////////////////////////////////////////////

  private checkSearchFlag(): boolean {
    if(CommonUtil.isStringEmpty(this.selectedSub)
        || this.selectedCats.length == 0 
        || this.selectedLecs.length == 0
        || this.selectedLevs.length == 0
        || CommonUtil.isNumberEmpty(this.selectedCnt)) {

      this.searchFlag = false;
    } else {
      this.searchFlag = true;
    }

    return this.searchFlag;
  }

  startTest() {
    const wordSearch: WordSearch = new WordSearch({
      sub: this.selectedSub,
      cats: this.selectedCats,
      lecs: this.selectedLecs,
      levs: this.selectedLevs,
      cnt: this.selectedCnt
    });
    this.navCtrl.push(TestCardPage, {wordSearch: wordSearch});
  }

}
