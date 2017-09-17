import { AuthService } from './../../../providers/auth-service/auth-service';

import { CommonUtil } from './../../../utils/commonUtil';
import { Word } from './../../../model/Word';
import { Lecture } from './../../../model/Lecture';
import { Category } from './../../../model/Category';
import { Subject } from './../../../model/Subject';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html'
})
export class Tab2Page {

  wordRef: firebase.database.Reference;
  searchFlag: boolean = false;

  subjects: Array<Subject> = new Array<Subject>();
  categories: Array<Category> = new Array<Category>();
  lectures: Array<Lecture> = new Array<Lecture>();
  levels: Array<any> = new Array<any>();
  counts: Array<number> = new Array<number>();
  words: Array<Word> = new Array<Word>();

  selectedSub: string = null;
  selectedCats: Array<Category> = new Array<Category>();
  selectedLecs: Array<Lecture> = new Array<Lecture>();
  selectedLevs: Array<any> = new Array<any>();
  selectedCnt: number;

  constructor(
    private db: AngularFireDatabase,
    private _auth: AuthService
  ) {
    this.wordRef = firebase.database().ref("/words");
    this.getSubjects();
    this.getLevels();
    this.getCounts();
  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad Tab2Page');
  }

  ///////////////////////////////////////////////////

  getLevels() {
    const levels = [
      {key:2, value:'Very easy'},
      {key:1, value:'Easy'},
      {key:0, value:'Nomal'},
      {key:-1, value:'Difficult'},
      {key:-2, value:'Very difficult'}
    ];

    levels.forEach(lev => {
      this.levels.push(lev);
      this.selectedLevs.push(lev.key);
    });
  }

  getCounts() {
    for(let i=20; i<=100; i+=10) {
      this.counts.push(i);
    }
    this.selectedCnt = 20;
  }

  ///////////////////////////////////////////////////

  getSubjects() {
    this.wordRef.orderByChild('num').once('value', snapshot => {
      snapshot.forEach(sub => {
          this.subjects.push(sub.val());
          return false;
      });
    });
  }

  changeSubject() {
    this.categories = new Array<Category>();
    this.selectedCats = new Array<Category>();
    this.wordRef.child(`${this.selectedSub}/list`).orderByChild("name").once('value', snapshot => {
      snapshot.forEach(cat => {
        this.categories.push(cat.val());
        return false;
      });
    });
  }

  ///////////////////////////////////////////////////

  changeCategory() {
    this.lectures = new Array<Lecture>();
    this.selectedLecs = new Array<Lecture>();
    this.selectedCats.forEach(catKey => {
      this.wordRef.child(`${this.selectedSub}/list/${catKey}/list`).orderByChild("name").once('value', snapshot => {
        snapshot.forEach(lec => {
          this.lectures.push(lec.val());
          return false;
        })
      });
    });
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

  searchWord() {
    console.log("######################");
    console.log("#### SEARCH START ####");
    console.log("#### sub : " + this.selectedSub);
    console.log("#### cats: " + this.selectedCats.toString());
    console.log("#### lecs: " + this.selectedLecs.toString());
    console.log("#### levs: " + this.selectedLevs.toString());
    console.log("#### cnt : " + this.selectedCnt);
    console.log("#### SEARCH  END  ####");
    console.log("######################");
    
    let ref = this.wordRef.child(`${this.selectedSub}/list`);
    this.words = new Array<Word>();
    this.selectedCats.forEach(catKey => {
      this.selectedLecs.forEach(lecKey => {
        ref.child(`${catKey}/list/${lecKey}/list`).orderByChild("num").once('value', snapshot => {
          snapshot.forEach(word => {
            this.words.push(word.val());
            return false;
          });
        });
      })
    });
  }

  // clickThumbs(thumbCode: number, catKey: string, lecKey: string, wordKey: string, wordLevel: number) {
  //   const level = thumbCode + (CommonUtil.isNumberEmpty(wordLevel) ? 0 : wordLevel);
  //   let ref = this.wordRef.child(`${this.selectedSub}/list/${catKey}/list/${lecKey}/list/${wordKey}/levels`);

  //   if(level > 2 || level < -2){
  //     return;
  //   } else if(level == 0) {
  //     ref.child(`${this._auth.uid}`).remove();
  //   } else {
  //     ref.update({
  //       [this._auth.uid]: level
  //     });
  //   }
  // }

  clickThumbs(thumbCode: number, word: Word) {
    
    const level = thumbCode + (CommonUtil.isNumberEmpty(word.levels[this._auth.uid]) ? 0 : word.levels[this._auth.uid]);
    let ref = this.wordRef.child(`${this.selectedSub}/list/${word.categoryKey}/list/${word.lectrueKey}/list/${word.key}/levels`);

    if(level > 2 || level < -2){
      return;
    } else if(level == 0) {
      ref.child(`${this._auth.uid}`).remove();
    } else {
      ref.update({
        [this._auth.uid]: level
      });
    }

    word.levels[this._auth.uid] = level;
  }
}
