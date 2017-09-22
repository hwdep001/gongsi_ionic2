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

    this.wordRef.orderByChild('num').once('value', snapshot => {
			snapshot.forEach(sub => {
				subjects.push(sub.val());
				return false;
			});
		});
    
    return subjects;
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

  async getCategories(subKey: string, newCategory?: boolean) {
    let categories: Array<Category> = new Array<Category>();
    
    if(newCategory) {
      categories.push({key: "-1", name: "New category"});
    }

    this.wordRef.child(`${subKey}/list`).orderByChild("name").once('value', snapshot => {
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

  async getLectures(subKey: string, catKey:string, newLecture?: boolean) {
    let lectures: Array<Lecture> = new Array<Lecture>();
    
    if(newLecture) {
      lectures.push({key: "-1", name: "New Lecture"});
    }

    this.wordRef.child(`${subKey}/list/${catKey}/list`).orderByChild("name").once('value', snapshot => {
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
  
  async getWords(subKey: string, catKey:string, lecKey: string) {
    let words: Array<Word> = new Array<Word>();

    this.wordRef.child(`${subKey}/list/${catKey}/list/${lecKey}/list`).orderByChild("num").once('value', snapshot => {
			snapshot.forEach(word => {
				words.push(word.val());
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

}
