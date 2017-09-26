import { WordSearch } from './../../model/WordSearch';
import { CommonUtil } from './../../utils/commonUtil';
import { Word } from './../../model/Word';
import { Lecture } from './../../model/Lecture';
import { Category } from './../../model/Category';
import { Subject } from './../../model/Subject';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class WordService {

  wordRef: firebase.database.Reference;

  constructor(
  ) {
    this.wordRef = firebase.database().ref("/words");
  }

  ///////////////////////////////////////////////////
	// SUBJECT
  ///////////////////////////////////////////////////
  
  async getSubjects() {
    let subjects: Array<Subject> = new Array<Subject>();

    await this.wordRef.orderByChild('num').once('value', snapshot => {
			snapshot.forEach(sub => {
				subjects.push(sub.val());
				return false;
			});
		});
    
    return subjects;
  }
  
  async getSubject(key: string) {
    let subject: Subject;

    await this.wordRef.orderByKey().equalTo(key).once('value', snapshot => {
      snapshot.forEach(sub => {
				subject = sub.val();
				return false;
			});
    });

    return subject;
  }

  ///////////////////////////////////////////////////
	// CATEGORY
	///////////////////////////////////////////////////

  async isExistCategory(subKey: string, catName: string) {
    let result: boolean = false;

    await this.wordRef.child(`${subKey}/list`).orderByChild("name").equalTo(catName).once('value', snapshot => {
      result = (snapshot.val() !== null);
    });
    
    return result;
  }

  async getCategories(subKey: string) {
    let categories: Array<Category> = new Array<Category>();
    
    await this.wordRef.child(`${subKey}/list`).orderByChild("name").once('value', snapshot => {
			snapshot.forEach(cat => {
				categories.push(cat.val());
				return false;
			});
		});
    
    return categories;
  }

  async getCategory(subKey: string, catKey: string) {
    let category: Category;

    await this.wordRef.child(`${subKey}/list`).orderByKey().equalTo(catKey).once('value', snapshot => {
      category = snapshot.val()[catKey];
    });
    
    return category;
  }
  
  async pushCategory(subKey: string, newCategory: Category) {
    let ref = this.wordRef.child(`${subKey}/list`).push();
    newCategory.key = ref.key;
    await ref.set(newCategory);

    return newCategory;
  }

  ///////////////////////////////////////////////////
	// LECTURE
	///////////////////////////////////////////////////

  async isExistLecture(subKey: string, catKey: string, lecName:string) {
    let result: boolean = false;

    await this.wordRef.child(`${subKey}/list/${catKey}/list`).orderByChild("name").equalTo(lecName).once('value', snapshot => {
      result = (snapshot.val() !== null);
    });

    return result;
  }

  async getLectures(subKey: string, catKey:string) {
    let lectures: Array<Lecture> = new Array<Lecture>();
    
    await this.wordRef.child(`${subKey}/list/${catKey}/list`).orderByChild("name").once('value', snapshot => {
			snapshot.forEach(lec => {
				lectures.push(lec.val());
				return false;
			});
		});
    
    return lectures;
  }
  
  async getLecture(subKey: string, catKey: string, lecKey: string) {
    let lecture: Lecture;

    await this.wordRef.child(`${subKey}/list/${catKey}/list`).orderByKey().equalTo(lecKey).once('value', snapshot => {
      lecture = snapshot.val()[lecKey];
    });
    
    return lecture;
  }

  async pushLecture(subKey: string, catKey: string, newLecture: Lecture) {
    let ref = this.wordRef.child(`${subKey}/list/${catKey}/list`).push();
    newLecture.key = ref.key;
    await ref.set(newLecture);

    return newLecture;
  }


  ///////////////////////////////////////////////////
	// WORD
  ///////////////////////////////////////////////////
  
  async getWords(subKey: string, catKey: string, lecKey: string) {
    let words: Array<Word> = new Array<Word>();

    await this.wordRef.child(`${subKey}/list/${catKey}/list/${lecKey}/list`).orderByChild("num").once('value', snapshot => {
			snapshot.forEach(word => {
				words.push(new Word(word.val()));
				return false;
			});
		});
    
    return words;
  }

  async pushWord(subKey: string, catKey: string, lecKey: string, newWord: Word) {
    let ref = this.wordRef.child(`${subKey}/list/${catKey}/list/${lecKey}/list`).push();
    newWord.key = ref.key;
    await ref.set(newWord);

    return newWord;
  }

  updateWordLevel(subKey: string, catKey: string, lecKey: string, wordKey: string, uid: string, level: number) {
    this.wordRef.child(`${subKey}/list/${catKey}/list/${lecKey}/list/${wordKey}/levels`).update({[uid]: level});
  }
  removeWordLevel(subKey: string, catKey: string, lecKey: string, wordKey: string, uid: string) {
    this.wordRef.child(`${subKey}/list/${catKey}/list/${lecKey}/list/${wordKey}/levels/${uid}`)
    .remove();
  }

  async searchWord(uid: string, wordSearch: WordSearch) {
    let words: Array<Word> = new Array<Word>();

    let ref = this.wordRef.child(`${wordSearch.sub}/list`);

    let num = 1;
    for(let catKey of wordSearch.cats) {
      let subref = ref.child(`${catKey}/list`);
      for(let lecKey of wordSearch.lecs) {
        await subref.child(`${lecKey}/list`).orderByChild("name").once("value", snapshot => {
          snapshot.forEach(word => {
            const tempWord = word.val();
            const userLev = tempWord.levels[uid] == null ? 0 : tempWord.levels[uid];

            wordSearch.levs.forEach(lev => {
              if(lev == userLev) {
                tempWord.levels = null;
                tempWord.myLevel = userLev;
                tempWord.num = num++;
                words.push(tempWord);
              }
            });

            return false;
          });
        });
      }
    }

    if(wordSearch.cnt == 0) {
      words = words.slice(0, 200);
    } else {
      words = this.shuffleWordByCount(words, wordSearch.cnt);
    }
    
    return words;
  }

  private shuffleWordByCount(words: Word[], count: number) {
    let result: Array<Word> = new Array<Word>();
    let temp: Word, index: number, num: number = 1;
    let max = words.length;
    count = (words.length < count) ? words.length : count;

    while (num <= count) {
      index = Math.floor(Math.random() * max--);
      temp = words[index];
      temp.num = num++;
      words.splice(index, 1);
      result.push(temp);
    }
    
    return result;
  }
}
