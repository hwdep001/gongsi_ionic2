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

	fileName: string = null;

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

		this.categories = new Array<Category>(
			{key: "-1", name: "New category"});
		this.categories.pushArray(await this._word.getCategories(this.selectedSub));
		loading.dismiss();
	}


	///////////////////////////////////////////////////
	// CATEGORY
	///////////////////////////////////////////////////

	async changeCategory() {
		this.selectedLec = null;
		this.setDefaultSearchData();

		this.lectures = new Array<Lecture>(
			{key: "-1", name: "New lecture"},
			{key: "-2", name: "파일명으로"});
		this.lectures.pushArray(await this._word.getLectures(this.selectedSub, this.selectedCat));
		
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
			this.fileName = dt.files[0].name;
			this.data = await this._file.uploadExcel(dt.files[0]);
		} else {
			this.data = [];
			this.fileName = null;
			if(this.selectedLec == "-2") {
				this.newLecName = null;
			}
		}

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

		let selectedLec_ = this.selectedLec;
		let selectedLec__ = this.selectedLec;
		let cat: Category;
		if(this.selectedCat == '-1') {
			cat = await this._word.pushCategory(this.selectedSub, new Category({name: this.newCatName}));
			this.categories = new Array<Category>(
				{key: "-1", name: "New category"});
			this.categories.pushArray(await this._word.getCategories(this.selectedSub));
			this.selectedCat = cat.key;
		} else {
			cat = await this._word.getCategory(this.selectedSub, this.selectedCat);
		}

		let lec: Lecture;
		if(selectedLec_ == '-1' || selectedLec_ == "-2") {
			lec = await this._word.pushLecture(this.selectedSub, this.selectedCat
				, new Lecture({name: this.newLecName, categoryKey: cat.key}));
			
			this.lectures = new Array<Lecture>(
				{key: "-1", name: "New lecture"},
				{key: "-2", name: "파일명으로"});
			this.lectures.pushArray(await this._word.getLectures(this.selectedSub, this.selectedCat));
			selectedLec_ = lec.key;

		} else {
			lec = await this._word.getLecture(this.selectedSub, this.selectedCat, selectedLec_);
		}

		let newWord: Word;
		let i: number = 1;
		for(let row of this.data) {
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
	
			this._word.pushWord(this.selectedSub, this.selectedCat, selectedLec_, newWord);
			i++;
		}

		if(selectedLec__ == "-2") {
			this.selectedLec = "-2";
		}

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

		if(this.selectedLec == '-1' || this.selectedLec == "-2") {

			if(this.selectedLec == "-2" && this.fileName != null) {
				this.newLecName = this.fileName.split(".")[0];
			}

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
