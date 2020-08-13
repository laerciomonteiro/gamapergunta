import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-interviewee',
  templateUrl: './interviewee.component.html',
  styleUrls: ['./interviewee.component.scss'],
})
export class IntervieweeComponent implements OnInit {
  public onRegisterForm: FormGroup;
  
    constructor(
      public navCtrl: NavController,
      public menuCtrl: MenuController,
      public loadingCtrl: LoadingController,
      private formBuilder: FormBuilder
    ) { }
  
    ionViewWillEnter() {
      this.menuCtrl.enable(false);
    }
  
    ngOnInit() {
      this.onRegisterForm = this.formBuilder.group({
        'fullName': [null, Validators.compose([
          Validators.required
        ])],
        'email': [null, Validators.compose([
          Validators.required
        ])],
        'password': [null, Validators.compose([
          Validators.required
        ])]
      });
    }
  
    async signUp() {
      const loader = await this.loadingCtrl.create({
        duration: 2000
      });
  
      loader.present();
      loader.onWillDismiss().then(() => {
        this.navCtrl.navigateRoot('/home-results');
      });
    }
  
    // // //
    goToLogin() {
      this.navCtrl.navigateRoot('/');
    }
  }
  
