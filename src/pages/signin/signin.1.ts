// import { LoadingService } from './../../providers/loading-service/loading-service';
// import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
// import { SignupPage } from './../signup/signup';
// import { Component } from '@angular/core';
// import { NavController, AlertController, ToastController } from 'ionic-angular';
// import * as firebase from 'firebase/app';

// import { AuthService } from './../../providers/auth-service/auth-service';

// @Component({
//   selector: 'page-signin',
//   templateUrl: 'signin.html',
// })
// export class SigninPage {

//   signInForm: FormGroup;
//   email: AbstractControl;
//   password: AbstractControl;

//   constructor(
//     private navCtrl: NavController,
//     private alertCtrl: AlertController,
//     private toastCtrl: ToastController,
//     private _auth: AuthService,
//     private _form: FormBuilder,
//     private _loading: LoadingService
//   ) {
//     this.setFormGroup();
//     this.setFormControls();
//   }

//   ionViewDidLoad() {
//     // console.log('==> ionViewDidLoad SigninPage');
//   }

//   setFormGroup() {
//     this.signInForm = this._form.group({
//       'email': ['', Validators.compose([Validators.required])],
//       'password': ['', Validators.compose([Validators.required])]
//     });
//   }

//   setFormControls() {
//     this.email = this.signInForm.controls['email'];
//     this.password = this.signInForm.controls['password'];
//   }

//   signIn() {
//     let loader = this._loading.getLoader(null, null);
//     loader.present();

//     if (this.signInForm.dirty && this.signInForm.valid) {
//       firebase.auth().signInWithEmailAndPassword(this.email.value, this.password.value)
//       .then(() => {
//         loader.dismiss();
//         this.signInSuccessCallback();
//       })
//       .catch(err => {
//         console.log("signIn error - " + err.name + ": " + err.message);
//         loader.dismiss();
//         this.showToast('top', `아이디와 비밀번호를 확인하십시오.`);
//       });
//     }
//   }

//   signInSuccessCallback() {
//     const currentUser = firebase.auth().currentUser;
//     if(!currentUser.emailVerified) {
//       this.showVerificationMailAlert(currentUser);
//     }
//   }

//   clickForgotPwBtn() {
    
//   }

//   clickSignUpBtn() {
//     this.navCtrl.push(SignupPage);
//   }

//   showVerificationMailAlert(currentUser: firebase.User) {
//     let confirm = this.alertCtrl.create({
//       title: '인증되지 않은 메일',
//       message: '메일을 확인하여 주십시오.',
//       buttons: [
//         {
//           text: '인증 메일 다시 받기',
//           handler: () => {
//             currentUser.sendEmailVerification()
//             .catch(err => console.log("sendEmailVerification - " + err.name + ": " + err.message) );
//           }
//         },
//         {text: '확인'}
//       ]
//     });
//     confirm.present();
//     this._auth.signOut();
//   }

//   private showToast(position: string, message: string, duration?: number) {
//     let toast = this.toastCtrl.create({
//       message: message,
//       position: position,
//       duration: (duration == null) ? 2500 : duration
//     });

//     toast.present(toast);
//   }


//   testSignOut() {
//     this._auth.signOut();
//   }
// }
