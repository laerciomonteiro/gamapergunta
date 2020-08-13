import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public onLoginForm: FormGroup;
  authState = new BehaviorSubject(false);

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      login: [null, Validators.compose([
        Validators.required
      ])],
      password: [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Esqueceu sua senha?',
      message: 'Entre com seus dados para resetar sua senha.',
      inputs: [
        {
          name: 'Login',
          type: 'text',
          placeholder: 'Login'
        },
        {
          name: 'Nome Cadastrado',
          type: 'text',
          placeholder: 'Nome Social'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  goToHome() {
    // this.navCtrl.navigateRoot('/home-results');
    this.authservice.login(this.onLoginForm.value)
      .subscribe(data => {
        console.log(data);
        console.log(this.onLoginForm.value);
      }, error => {
        console.log(error);
        if (error.error.error === 'invalid_credentials') {
          this.presentToast();
        }
        if (error.error.error === 'could_not_create_token') {
          console.log('Não foi possível gerar o token.');
        }
      });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Usuário ou senha incorretos.',
      duration: 2000
    });
    toast.present();
  }
}
