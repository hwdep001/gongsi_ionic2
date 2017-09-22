import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import * as firebase from 'firebase';

import { CommonUtil } from './../../../utils/commonUtil';
import { LoadingService } from './../../../providers/loading-service/loading-service';
import { FileService } from './../../../providers/file-service/file-service';
import { WordService } from './../../../providers/word-service/word-service';

import { ResultData } from './../../../model/ResultData';
import { Subject } from './../../../model/Subject';
import { Category } from './../../../model/Category';
import { Lecture } from './../../../model/Lecture';
import { Word } from './../../../model/Word';

@Component({
  selector: 'page-wordCr',
  templateUrl: 'wordCr.html'
})
export class WordCrPage {

	wordRef: firebase.database.Reference;
	searchFlag: boolean = false;

	subjects: Array<Subject> = new Array<Subject>();
	categories: Array<Category> = new Array<Category>();
	lectures: Array<Lecture> = new Array<Lecture>();

	selectedSub: string = null;
	selectedCat: string = null;
	selectedLec: string = null;

	newCatName: string = null;
	newLecName: string = null;
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

	setDefaultSearchData() {
		this.newCatName = null;
		this.newLecName = null;
		this.searchFlag = false;
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
		this.setDefaultSearchData();

		this.categories = await this._word.getCategories(this.selectedSub, true);
		loading.dismiss();
	}


	///////////////////////////////////////////////////
	// CATEGORY
	///////////////////////////////////////////////////

	async changeCategory() {
		this.selectedLec = null;
		this.setDefaultSearchData();

		this.lectures = await this._word.getLectures(this.selectedSub, this.selectedCat, true);
		
		if(this.selectedCat == "-1") {
			this.selectedLec = this.lectures[0].key;
			this.searchFlag = true;
		}
	}


	///////////////////////////////////////////////////
	// LECTURE
	///////////////////////////////////////////////////

	changeLecture() {
		this.newLecName = null;
		this.searchFlag = true;
	}

	///////////////////////////////////////////////////

	async onFileChange(evt: any) {
		let loading = this._loading.getLoader(null, null);
		loading.present();

		const dt: DataTransfer = <DataTransfer>(evt.target);
		if(dt.files.length == 1) {
			this.data = await this._file.uploadExcel(dt.files[0]);
		};

		loading.dismiss();
	}

	async saveWord() {
		// checking form
		const rsData: ResultData = await this.checkSaveData();
		if(!rsData.result){
			this.showAlert("ERROR", rsData.msg);
			return;
		} 

		let loading = this._loading.getLoader(null, null);
		loading.present();

		let cat: Category;
		if(this.selectedCat == '-1') {
			cat = await this._word.pushCategory(this.selectedSub, new Category({name: this.newCatName}));
			this.categories = await this._word.getCategories(this.selectedSub, true);
			this.selectedCat = cat.key;
		} else {
			cat = await this._word.getCategory(this.selectedSub, this.selectedCat);
		}

		let lec: Lecture;
		if(this.selectedLec == '-1') {
			lec = await this._word.pushLecture(this.selectedSub, this.selectedCat
				, new Lecture({name: this.newLecName, categoryKey: cat.key}));
			this.lectures = await this._word.getLectures(this.selectedSub, this.selectedCat, true);
			this.selectedLec = lec.key;
		} else {
			lec = await this._word.getLecture(this.selectedSub, this.selectedCat, this.selectedLec);
		}

		let newWord: Word;
		let i: number = 1;
		this.data.forEach(row => {
			newWord = new Word();
			newWord.num = i;
			newWord.head1 = row[0] == undefined? null: row[0];
			newWord.head2 = row[1] == undefined? null: row[1];
			newWord.body1 = row[2] == undefined? null: row[2];
			newWord.body2 = row[3] == undefined? null: row[3];
			newWord.categoryKey = cat.key;
			newWord.categoryName = cat.name;
			newWord.lectrueKey = lec.key;
			newWord.lectrueName = lec.name; 
			newWord.levels= {true: true};

			this._word.pushWord(this.selectedSub, this.selectedCat, this.selectedLec, newWord);
			i++;
		});

		loading.dismiss();
	}

	async checkSaveData(): Promise<ResultData> {
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

		if(this.selectedCat == '-1') {
			if(CommonUtil.isStringEmpty(this.newCatName)) {
				rsData.msg = "Did not enter a CATEGORY!";
				return rsData;
			}

			if(await this._word.isExistCategory(this.selectedSub, this.newCatName)) {
				rsData.msg = "Duplicate CATEGORY!";
				return rsData;
			}
		}

		if(this.selectedLec == '-1') {
			if(CommonUtil.isStringEmpty(this.newLecName)) {
				rsData.msg = "Did not enter a LECTURE!";
				return rsData;
			}

			if(await this._word.isExistLecture(this.selectedSub, this.selectedCat, this.newLecName)) {
				rsData.msg = "Duplicate LECTURE!";
				return rsData;
			}
		}

		if(this.data.length < 1){
			rsData.msg = "No words to add!";
			return rsData;
		}

		rsData.result = true;
		return rsData;
	}

	showAlert(title: string, subTitle: string) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: subTitle,
			buttons: ['OK']
		});
		alert.present();
	}
}
