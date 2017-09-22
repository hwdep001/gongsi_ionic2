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
		this.words.forEach(word => {
			ref.child(word.key).update(word);
		})
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

	showAlert(title: string, subTitle: string) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: subTitle,
			buttons: ['OK']
		});
		alert.present();
	}

	export() {
		this.convertWortToData(this.words);
		const fileName: string = "SheetJS.xlsx";
		this._file.export(fileName, this.data);
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
}
