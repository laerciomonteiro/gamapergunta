import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, AlertController, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { AuthenticationService } from './core/services/authentication.service';
import { StorageService } from './core/services/storage.service';
import { UserResponse } from './core/models/user-response';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy, AfterViewInit {
  user: any;
  backButtonSubscription;
  answers: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authservice: AuthenticationService,
    private storageservice: StorageService,
    private router: Router,
    private alertCtrl: AlertController,
    private toast: ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isAuthenticated();
    });
  }

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (this.router.url === '/quiz/list') {
        this.presentConfirm();
      }
    });

    this.dataUser();
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  dataUser() {
    this.storageservice.recoveringUser().then((response: UserResponse) => {
      if (response.user == null) {
        this.user = [];
      } else {
        this.user = response.user;
        console.log('Dados do usuário: ', this.user);
      }
    });
  }

  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação de saída',
      message: 'Deseja sair do app?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });
    alert.present();
  }

  exitApp() {
    navigator['app'].exitApp();
  }

  async resetData() {
    const alert = await this.alertCtrl.create({
      header: 'Resetar Dados',
      message: 'Deseja resetar todos os dados do aplicativo? Isso apagará tudo e não terá mais volta.',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.storageservice.removeQuestions();
            this.authservice.logout();
            this.presentToast("Todos os dados foram apagados!");
          }
        }
      ]
    });
    alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  exitAccount() {
    this.authservice.logout();
  }

  // Verifica, no carregamento do aplicativo, se o usuário está logado.
  isAuthenticated() {
    this.authservice.authState.subscribe(state => {
      if (state) {
        this.router.navigate(['quiz/list'], { replaceUrl: true });
        console.log('Rota', this.router.url);
      } else {
        this.router.navigate(['login']);
      }
    });
  }
}
