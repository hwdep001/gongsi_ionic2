import { CommonUtil } from './../../../utils/commonUtil';
import { WordService } from './../../../providers/word-service/word-service';
import { AuthService } from './../../../providers/auth-service/auth-service';
import { LoadingService } from './../../../providers/loading-service/loading-service';
import { WordSearch } from './../../../model/WordSearch';
import { Word } from './../../../model/Word';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-testCard',
  templateUrl: 'testCard.html',
})
export class TestCardPage {

  wordRef: firebase.database.Reference;
  
  wordSearch: WordSearch;
  words: Array<Word> = new Array<Word>();
  curWord: Word = new Word();

  bodyFlag: boolean = false;

  constructor(
    private param: NavParams,
    private _auth: AuthService,
    private _loading: LoadingService,
    private _word: WordService
  ) {
    this.wordSearch = this.param.get('wordSearch');
    this.wordRef = firebase.database().ref(`/words/${this.wordSearch.sub}/list`);
    this.initData();
  }
  
  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad TestCardPage');
  }

  initData() {
    this.search();
  }

  async search() {
    let loading = this._loading.getLoader(null, null);
    loading.present();

    this.words = await this._word.searchWord(this._auth.uid, this.wordSearch);
    this.curWord = this.words[0];

    loading.dismiss();
  }

  prevWord(index: number) {
    this.bodyFlag = false;
    if( (index-1) > 0 ) {
      this.curWord = this.words[index-1-1];
    } else {
      this.curWord = this.words[this.words.length-1];
    }
  }

  nextWord(index: number) {
    this.bodyFlag = false;
    if( (index+1) <= this.words.length ) {
      this.curWord = this.words[index];
    } else {
      this.curWord = this.words[0];
    }
  }

  clickThumbs(thumbCode: number) {
    const level = thumbCode + this.curWord.myLevel;

    if(level > 2 || level < -2){
      return;
    } else if(level == 0) {
      this._word.removeWordLevel(this.wordSearch.sub, this.curWord.categoryKey
                  , this.curWord.lectrueKey, this.curWord.key, this._auth.uid);
    } else {
      this._word.updateWordLevel(this.wordSearch.sub, this.curWord.categoryKey
        , this.curWord.lectrueKey, this.curWord.key, this._auth.uid, level);
    }

    this.curWord.myLevel = level;
  }

}
