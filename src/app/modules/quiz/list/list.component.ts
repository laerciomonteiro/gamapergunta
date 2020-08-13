import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Network } from '@ionic-native/network/ngx';

import { ApiService } from '../../../core/services/api.service';
import { StorageService } from '../../../core/services/storage.service';
import { endpoints } from '../../../core/constants/endpoints';
import { UserResponse } from '../../../core/models/user-response';
import { Forms } from 'src/app/core/models/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  page = 'questionarios';
  forms: any[] = [];
  token: any;
  answers: any;
  count: any = 0;
  temp: any = null;
  sent: any = false;
  statusConnect: boolean;

  constructor(private api: ApiService,
              private toast: ToastController,
              private network: Network,
              private menu: MenuController,
              private storageservice: StorageService,
              private alertCtrl: AlertController,
              private router: Router,
              public loadingController: LoadingController) {
    this.connectionOff();
  }

  ngOnInit() {
    this.sent = false;
    this.count = 0; 
    this.recoveringUser();
    this.connectionOn();
  }

  connectionOff() {
    this.network.onDisconnect().subscribe(() => {
      this.presentToast('Sem conexão à Internet');
      this.statusConnect = false;
    });
  }

  connectionOn() {
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.presentToast('Sua conexão ' + this.network.type + ' foi restabelecida.');
      }, 3000);
      this.statusConnect = true;
    });
  }

  ionViewWillEnter() {
    this.count = null;
    this.recoveringAnswers();
  }

  openMenu() {
    this.menu.enable(true, 'gamamenu');
    this.menu.open('gamamenu');
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  // Recuperando dados armazenados do usuário.
  recoveringUser() {
    this.storageservice.recoveringUser().then((response: UserResponse) => {
      const currentDate = moment().unix();
      console.log('Data atual: ', currentDate);
      console.log('Data expiração: ', response.token.expiresIn);
      if (response.token.expiresIn > currentDate) {
        this.token = response.token.key;
      } else {
        console.log('Token expirado');
      }
      this.recoveringForms();
    });
  }

  // Recuperando formulários armazenados.
  recoveringForms() {
    this.storageservice.recoveringForms().then(response => {
      this.forms = response;
      console.log('Recuperando dados: ', response);
    }).then(() => {
      this.getForms();
    });
  }

  // Atualizando formulários com a api
  doRefreshForms(event){
    console.log('doRefreshForms initialization');

    setTimeout(() => {
      this.getForms();
      event.target.complete();
    }, 5000);
  }

  // Recuperando respostas coletadas -- função iniciada em ngOnInit
  recoveringAnswers() {
    this.sent = false;
    this.storageservice.recoveringLocal().then(response => {
      if (response == null) {
        this.answers = [];
      } else {
        this.answers = response;
        console.log("Respostas: ", response);
      }
    });
  }

  numberQuestions() {
    if (this.answers == null) {
      return 0;
    } else {
      return this.answers.length;
    }
  }

  // Comunicação com a API e envio de token para recebimento dos questionários.
  getForms() {
    this.api.get(endpoints.forms.all)
      .subscribe(data => {
        this.forms = data;
        this.storageservice.addForms('FORMS', data);
        console.log('Lista de questionários: ', this.forms);
      }, error => {
        console.log(error);
      });
  }

  onSelect(form: Forms) {
    this.router.navigate(['/quiz/list', form.id]);
  }

  isAnswers(id) {
    let total = 0;
    if (this.answers != null) {
      this.answers.forEach(i => {
        if (i.forms_id == id) {
          total++;
        }
      });
    }
    return total;
  }

  checkForm(id): Forms {
    return this.forms.find(f => +f.id === +id);
  }

  async viewAnswers(arr) {
    //console.log(arr);

    const alert = await this.alertCtrl.create({
      message: 'Deseja remover esse item?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Sim',
          handler: () => {
            for (let i = 0; i < this.answers.length; i++) {
              if (this.answers[i].collected_in === arr.collected_in) {
                this.answers.splice(i, 1);
                this.storageservice.addForms('LOCAL', this.answers);
                i--;
              }
            }
            this.router.navigate(['/quiz/list']);
          }
        }
      ]
    });

    await alert.present();

  }

  dateFormatBr(date) {
    const data = new Date(date);
    return ('0' + data.getDate()).substr(-2) + '/' + ('0' + (data.getMonth() + 1)).substr(-2) + '/' + data.getFullYear();
  }

  async sendAnswers() {

    if (this.statusConnect !== false) {
      this.count = 0;
      this.temp = true;
      this.sent = false;

      this.presentLoading();

      await this.delay(1000).then(() => {
        this.api.post(endpoints.answers.save, this.answers).subscribe(data => {
          console.log("array send", data);
          this.count = 100;
        }, error => {
          console.log(error);
        });
        console.log('Envio de post em 01 segundo.');
      });
      
      this.recoveringAnswers();
      
    } else {
      this.presentToast('Sem acesso à Internet');
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Aguarde...",
      duration: 5000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    this.sent = true;
    this.temp = false;
    console.log('Loading dismissed!');
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
