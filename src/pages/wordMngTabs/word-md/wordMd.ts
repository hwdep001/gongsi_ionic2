import { CommonUtil } from './../../../utils/commonUtil';
import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import * as firebase from 'firebase';

import { LoadingService } from './../../../providers/loading-service/loading-service';
import { FileService } from './../../../providers/file-service/file-service';
import { WordService } from './../../../providers/word-service/word-service';

import { ResultData } from './../../../model/ResultData';
import { Subject } from './../../../model/Subject';
import { Category } from './../../../model/Category';
import { Lecture } from './../../../model/Lecture';
import { Word } from './../../../model/Word';

@Component({
  selector: 'page-wordMd',
  templateUrl: 'wordMd.html'
})
export class WordMdPage {

	wordRef: firebase.database.Reference;
	searchFlag: boolean = false;

	subjects: Array<Subject> = new Array<Subject>();
	categories: Array<Category> = new Array<Category>();
	lectures: Array<Lecture> = new Array<Lecture>();
	words: Array<Word> = new Array<Word>();
	words_: Array<Word> = new Array<Word>();

	selectedSub: string = null;
	selectedCat: string = null;
	selectedLec: string = null;

	data: Array<Array<any>> = [];

	constructor(
		private alertCtrl: AlertController,
		private _loading: LoadingService,
		private _file: FileService,
		private _word: WordService
	) {
		this.wordRef = firebase.database().ref("/words");
		this.getSubjects();
	}

	ionViewDidLoad() {
	// console.log('==> ionViewDidLoad Tab3Page');
	}

	///////////////////////////////////////////////////
	// SUBJECT
	///////////////////////////////////////////////////

	async getSubjects() {
		let loading = this._loading.getLoader(null, null);
		loading.present();
		this.subjects = await this._word.getSubjects();
		loading.dismiss();
	}

	async changeSubject() {
		let loading = this._loading.getLoader(null, null);
		loading.present();

		this.selectedCat = null;
		this.searchFlag = false;

		this.categories = await this._word.getCategories(this.selectedSub);
		loading.dismiss();
	}


	///////////////////////////////////////////////////
	// CATEGORY
	///////////////////////////////////////////////////

	async changeCategory() {
		this.selectedLec = null;
		this.searchFlag = false;

		this.lectures = await this._word.getLectures(this.selectedSub, this.selectedCat);
	}


	///////////////////////////////////////////////////
	// LECTURE
	///////////////////////////////////////////////////

	async changeLecture() {
		this.searchFlag = true;
		this.words = await this._word.getWords(this.selectedSub, this.selectedCat, this.selectedLec);
		this.words_ = this.words.map(x => Object.assign({}, x));
	}

	///////////////////////////////////////////////////

	async saveWord() {
		if(!this.checkSaveData()){
			let alert = this.alertCtrl.create({
				title: 'ERROR',
				subTitle: '',
				buttons: ['OK']
			});
			alert.present();

			return;
		}

		let ref = this.wordRef.child(`${this.selectedSub}/list/${this.selectedCat}/list/${this.selectedLec}/list`);
		
		if(this.words.length < 1) {
			ref.remove();

		}else {
			let i = 1;

			this.words.forEach(word => {

				if(CommonUtil.isStringEmpty(word.head1) && CommonUtil.isStringEmpty(word.body1)) {
					return;

				} else if(word.key != null && word.status == 1) {
					ref.child(word.key).remove();

				} else {
					word.num = i++;
					if(word.key == null) {
						this._word.pushWord(this.selectedSub, this.selectedCat, this.selectedLec, word);
					} else {
						ref.child(word.key).update(word);
					}
				}
			});
		}

		this.changeLecture();
	}

	checkSaveData(): ResultData {
		let rsData: ResultData = new ResultData(false);

		if(this.selectedSub == null) {
			rsData.msg = "Did not select a SUBJECT!";
			return rsData;
		}

		if(this.selectedCat == null) {
			rsData.msg = "Did not select a CATEGORY!";
			return rsData;
		}

		if(this.selectedLec == null) {
			rsData.msg = "Did not select a LECTURE!";
			return rsData;
		}

		rsData.result = true;
		return rsData;
	}

	export() {
		if(this.words_.length > 0) {
			this.convertWortToData(this.words_);
			const word0 = this.words[0];
			const fileName: string = new Date().yyMMdd() + "_" 
					+ word0.categoryName + "_" + word0.lectrueName + ".xlsx";
			this._file.export(fileName, this.data);
		}
	}

	convertWortToData(words: Array<Word>) {
		this.data = [];
		let temp = [];
		words.forEach(word => {
			temp = [];
			temp.push(word.head1);
			temp.push(word.head2);
			temp.push(word.body1);
			temp.push(word.body2);
			this.data.push(temp);
		});
	}

	addWord() {
		this.words.push(new Word());
	}

	revertWord() {
		this.showConfirmAlert("WARNNING!", "Do you agree to revert words?", () => {
			this.words = this.words_.map(x => Object.assign({}, x));
		});
	}

	removeAllWord() {
		this.showConfirmAlert("WARNNING!", "Do you agree to remove all words?", () => {
			this.words = [];
		});
	}

	removeWord(index: number) {
		this.words[index].status = 1;
		this.setWordNum();
	}

	setWordNum(){
		let i = 1;
		this.words.forEach(word => {
			if(word.status == 0) {
				word.num = i++;
			}
		});
	}

	showConfirmAlert(title: string, message: string, okHandler) {
		let confirm = this.alertCtrl.create({
			title: title,
			message: message,
			buttons: [
			  {
				text: 'Cancel'
			  },
			  {
				text: 'Ok',
				handler: () => {
					okHandler();
				}
			  }
			]
		});
		confirm.present();
	}
}
