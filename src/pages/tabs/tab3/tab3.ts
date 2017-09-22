import { Category } from './../../../model/Category';
import { Lecture } from './../../../model/Lecture';
import { Word } from './../../../model/Word';
import { AlertController } from 'ionic-angular';
import { CommonUtil } from './../../../utils/commonUtil';
import { Subject } from './../../../model/Subject';
import { Component, ErrorHandler } from '@angular/core';
import * as firebase from 'firebase';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i !== s.length; ++i) {
		view[i] = s.charCodeAt(i) & 0xFF;
	};
	return buf;
}

@Component({
  selector: 'page-tab3',
  templateUrl: 'tab3.html'
})
export class Tab3Page {

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

	data: AOA = [];
	wopts: XLSX.WritingOptions = { bookType:'xlsx', type:'binary' };
	fileName: string = "SheetJS.xlsx";

	constructor(
		private alertCtrl: AlertController
	) {
		this.wordRef = firebase.database().ref("/words");
		this.getSubjects();
	}

	ionViewDidLoad() {
	// console.log('==> ionViewDidLoad Tab3Page');
	}

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
		this.categories.push({key: "-1", name: "New category"});
		this.selectedCat = null;
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
		this.lectures.push({key: "-1", name: "New Lecture"});
		this.selectedLec = null;
		this.newCatName = null;
		this.newLecName = null;

		if(this.selectedCat == "-1") {
			this.selectedLec = this.lectures[0].key;
			this.searchFlag = true;
		}else {
			this.wordRef.child(`${this.selectedSub}/list/${this.selectedCat}/list`).orderByChild("name").once('value', snapshot => {
				snapshot.forEach(lec => {
					this.lectures.push(lec.val());
					return false;
				})
			});
		}

	}

	///////////////////////////////////////////////////

	changeLecture() {
		this.newLecName = null;
		this.searchFlag = true;
	}

	///////////////////////////////////////////////////

	onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>(evt.target);
		if(target.files.length != 1) { this.data = []; return; };
		const reader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:'binary'});

			/* grab first sheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];

			/* save data */
			this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header:1}));
		};
		reader.readAsBinaryString(target.files[0]);
	}

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

		let saveRef = firebase.database().ref(`/words/${this.selectedSub}/list`);

		let cat: Category;
		if(this.selectedCat == '-1') {
			let ref = saveRef.push();
			cat = new Category({key: ref.key, name: this.newCatName});
			await ref.set(cat);
		} else {
			await saveRef.orderByKey().equalTo(this.selectedCat)
			.once('value', snapshot => {
				cat = snapshot.val();
			});
		}

		let lec: Lecture;
		saveRef = saveRef.child(`${cat.key}/list`);
		if(this.selectedLec == '-1') {
			let ref = saveRef.push();
			lec = new Lecture({key: ref.key, name: this.newLecName, categoryKey: cat.key});
			await ref.set(lec);
		} else {
			await saveRef.orderByKey().equalTo(this.selectedLec)
			.once('value', snapshot => {
				lec = snapshot.val();
			});
		}

		let newWord: Word;
		let i: number = 0;
		saveRef = saveRef.child(`${lec.key}/list`);
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

			let ref = saveRef.push();
			newWord.key = ref.key;
			ref.set(newWord);
		});		
	}

	checkSaveData(): boolean {
		let result = true;

		if(this.selectedSub == null 
			|| this.selectedCat == null
			|| this.selectedLec == null
		) {
			return false;
		}

		if(this.selectedCat == '-1' && CommonUtil.isStringEmpty(this.newCatName)) {
			return false;
		}

		if(this.selectedLec == '-1' && CommonUtil.isStringEmpty(this.newLecName)) {
			return false;
		}

		if(this.data.length < 1){
			return false;
		}

		return result;
	}

	// export(): void {
	// 	/* generate worksheet */
	// 	const ws = XLSX.utils.aoa_to_sheet(this.data);

	// 	/* generate workbook and add the worksheet */
	// 	const wb = XLSX.utils.book_new();
	// 	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

	// 	/* save to file */
	// 	const wbout = XLSX.write(wb, this.wopts);
	// 	console.log(this.fileName);
	// 	saveAs(new Blob([s2ab(wbout)]), this.fileName);
	// }

//   customTrackBy(index: number, obj: any): any {
// 	return index;
//   }

}
