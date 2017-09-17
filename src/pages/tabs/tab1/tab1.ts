import { Word } from './../../../model/Word';
import { Lecture } from './../../../model/Lecture';
import { Category } from './../../../model/Category';
import { Subject } from './../../../model/Subject';
import { CommonUtil } from './../../../utils/commonUtil';
import { User } from './../../../model/User';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    // console.log('==> ionViewDidLoad Tab1Page');
  }

  createUser() {
    for(let i=1; i<=10; i++){
      const currentDate = CommonUtil.getCurrentDate();
      const idx = (i<10 ? "0"+i.toString(): i);
      const user: User = {
        uid: `test${idx}`,
        email: `test${idx}`,
        name: `name${idx}`,
        createDate: currentDate,
        lastSigninDate: currentDate,
        authenticated: false
      }
      firebase.database().ref(`/users/${user.uid}`).set(user);
    }
  }

  removeUser() {
    for(let i=1; i<=10; i++){
      const idx = "test" + (i<10 ? "0"+i.toString(): i);
      firebase.database().ref(`/users/${idx}`).remove();
    }
  }

  ///////////////////////////////////////////////////

  createSubject() {
    const subs: Array<any> = [
      new Subject('영단어', 1), 
      new Subject('외래어', 2)
    ];

    subs.forEach(sub => {
      let ref = firebase.database().ref(`/words`).push();
      sub.key = ref.key;
      ref.set(sub);
    });
  }

  removeSubject() {
    firebase.database().ref(`/words`).remove();
  }

  async getSubjects(): Promise<any[]> {
    let subs: Array<Subject> = [];
    
    await firebase.database().ref(`/words`).orderByChild('num').once('value').then(snapshot => {
      snapshot.forEach(sub => {
        subs.push(sub.val());
      });
    });

    return subs;
  }

  ///////////////////////////////////////////////////

  createCategory() {
    this.getSubjects().then(subs => {
      subs.forEach(sub => {
        for(let i=1; i<=2; i++) {
          const idx: string = this.convertId(i);
          
          let ref = firebase.database().ref(`/words/${sub.key}/list`).push();
          const newCat = new Category(ref.key, `cat${idx}`);
          ref.set(newCat);
        }
      });
    });
  }

  removeCategory() {
    this.getSubjects().then(subs => {
      subs.forEach(sub => {
        firebase.database().ref(`/words/${sub.key}/list`).remove();
      });
    });
  }

  async getCategories(subKey: string): Promise<any[]> {
    let cats: Array<Category> = [];
    
    await firebase.database().ref(`/words/${subKey}/list`).once('value').then(snapshot => {
      snapshot.forEach(cat => {
        cats.push(cat.val());
      });
    });

    return cats;
  }

  ///////////////////////////////////////////////////

  createLecture() {
    this.getSubjects().then(subs => {
      subs.forEach(sub => {
        this.getCategories(sub.key).then(cats => {
          cats.forEach(cat => {
            for(let i=1; i<=3; i++) {
              const idx: string = this.convertId(i);
              
              let ref = firebase.database().ref(`/words/${sub.key}/list/${cat.key}/list`).push();
              const newLec = new Lecture(ref.key, `lec${idx}`, cat.key);
              ref.set(newLec);
            }
          });
        });
      });
    });
  }

  removeLecture() {
    this.getSubjects().then(subs => {
      subs.forEach(sub => {
        this.getCategories(sub.key).then(cats => {
          cats.forEach(cat => {
            let ref = firebase.database().ref(`/words/${sub.key}/list/${cat.key}/list`).remove();
          });
        });
      });
    });
  }

  async getLectures(subKey: string, catKey: string): Promise<any[]> {
    let lecs: Array<Category> = [];
    
    await firebase.database().ref(`/words/${subKey}/list/${catKey}/list`).once('value').then(snapshot => {
      snapshot.forEach(lec => {
        lecs.push(lec.val());
      });
    });

    return lecs;
  }

  ///////////////////////////////////////////////////

  createWord() {
    this.getSubjects().then(subs => {
      subs.forEach(sub => {
        this.getCategories(sub.key).then(cats => {
          cats.forEach(cat => {
            this.getLectures(sub.key, cat.key).then(lecs => {
              lecs.forEach(lec => {
                for(let i=1; i<=3; i++) {
                  const idx: string = this.convertId(i);
                  
                  let ref = firebase.database().ref(`/words/${sub.key}/list/${cat.key}/list/${lec.key}/list`).push();
                  const newWord: Word = {
                    key: ref.key,
                    head1: `head1-${idx}`,
                    head2: `head2-${idx}`,
                    body1: `body1-${idx}`,
                    body2: `body2-${idx}`,
                    num: i,
                    categoryKey: cat.key,
                    categoryName: cat.name,
                    lectrueKey: lec.key,
                    lectrueName: lec.name,
                    levels: {true: true}
                  }
                  ref.set(newWord);
                }
              });
            });
          });
        });
      });
    });
  }

  removeWord() {
    this.getSubjects().then(subs => {
      subs.forEach(sub => {
        this.getCategories(sub.key).then(cats => {
          cats.forEach(cat => {
            this.getLectures(sub.key, cat.key).then(lecs => {
              lecs.forEach(lec => {
                let ref = firebase.database().ref(`/words/${sub.key}/list/${cat.key}/list/${lec.key}/list`).remove();
              });
            });
          });
        });
      });
    });
  }

  ///////////////////////////////////////////////////

  convertId(num: number): string {

    let result: string;
    if(num<10) {
      result = "00"+num.toString();
    } else if(num<100) {
      result = "0"+num.toString()
    } else {
      result = num.toString();
    }

    return result;
  }
}
