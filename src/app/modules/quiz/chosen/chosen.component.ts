import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { Forms } from 'src/app/core/models/forms';
import { UserResponse } from '../../../core/models/user-response';
@Component({
  selector: 'app-chosen',
  templateUrl: './chosen.component.html',
  styleUrls: ['./chosen.component.scss'],
})
export class ChosenComponent implements OnInit {
  private id: any;
  public forms: any = [];
  public formChosen: any = [];
  public onForm: FormGroup;
  public customForm: any = [];
  private user: UserResponse;
  radioValue = true;

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    private storage: Storage,
    public menuCtrl: MenuController,
    private router: Router,
    public loadingCtrl: LoadingController,
    private storageservice: StorageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.onForm = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  // Carregando formulários do armazenamento local.
  ngOnInit() {
    this.Forms();
  }

  // Recuperando formulários armazenados.
  Forms() {
    this.storageservice.recoveringForms().then(response => {
      this.forms = response;
      this.openSelected();
    });
    this.UserLogged();
  }

  // Recuperando dados armazenados do usuário.
  UserLogged() {
    this.storageservice.recoveringUser().then((response) => {
      this.user = response;
      console.log('User: ', response);
    });
  }

  // Recuperando dados do item selecionado através do ID.
  openSelected() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.formChosen = this.checkForm(this.id);
    console.log('form', this.formChosen);
  }

  // Funçăo para localizar elemento no array através do ID.
  checkForm(id): Forms {
    return this.forms.find(f => +f.id === +id);
  }

  now() {
    // Obtém a data/hora atual
    var data = new Date();

    // Guarda cada pedaço em uma variável
    var dia = data.getDate();           // 1-31
    var dia_sem = data.getDay();            // 0-6 (zero=domingo)
    var mes = data.getMonth();          // 0-11 (zero=janeiro)
    var ano4 = data.getFullYear();       // 4 dígitos
    var hora = data.getHours();          // 0-23
    var min = data.getMinutes();        // 0-59
    var seg = data.getSeconds();        // 0-59
    var mseg = data.getMilliseconds();   // 0-999
    var tz = data.getTimezoneOffset(); // em minutos

    // Formata a data e a hora (note o mês + 1)
    var str_data = dia + '/' + (mes + 1) + '/' + ano4;
    var str_hora = hora + ':' + min + ':' + seg + ':' + mseg;

    return str_data + " " + str_hora;
  }

  submitForm() {
    console.log('Dados para submit: ', this.onForm.value);
    if (this.onForm.value['1'] === 1 && this.onForm.value['6'] === '') {
      this.alertValidate('Erro!', 'Preencha o campo obrigatório: BAIRRO.');
    } else if (this.onForm.value['1'] === 2 && this.onForm.value['7'] === '') {
      this.alertValidate('Erro!', 'Preencha o campo obrigatório: LOCALIDADE.');
    }
    else {
      console.log('Dados para submit: ', this.onForm.value);
      const keys = Object.keys(this.onForm.value);
      const arr = [];

      arr.push({
        forms_id: this.formChosen.id,
        user_id: this.user.user.id,
        collected_in: this.now(),
        answers: []
      });

      keys.forEach(i => {
        let optionId = '';
        let optionCustom = '';

        if (typeof this.onForm.value[i] === 'number') {
          optionId = this.onForm.value[i];
          optionCustom = null;
        } else if (typeof this.onForm.value[i] === 'string') {

          if (this.customForm[i] === undefined)
            optionId = null;
          else
            optionId = this.customForm[i];

          optionCustom = this.onForm.value[i];
        }

        arr[0].answers.push(
          {
            question_id: i,
            option_id: optionId,
            option_custom: optionCustom
          }
        );
      });

      console.log('ARR', arr);
      this.storageservice.recoveringLocal().then(response => {
        if (response == null) {
          response = [];
        }
        response.push(arr[0]);
        this.storage.set('LOCAL', response);
        this.presentAlert();
        this.router.navigate(['/quiz/list']);
      });
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Gama Pergunta',
      message: 'Respostas coletadas e salvas.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertValidate(head, msg) {
    const alert = await this.alertController.create({
      header: head,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
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

  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }

  goToQuizList() {
    this.router.navigate(['/quiz/list']);
  }

  option_id(id) {
    if (id === 6 || id === 7) {
      this.onForm.addControl(id, new FormControl(''));
    } else {
      this.onForm.addControl(id, new FormControl('', Validators.required));
    }

    return id;
  }

  custom(questionId, optionId) {
    this.customForm[questionId] = optionId;
    console.log(this.customForm);
  }

  onTextClick(i, value?) {
    console.log(`${i}`);
    console.log(value);
    try {
      if (value === 1) {
        (document.getElementById(`texto6`) as HTMLInputElement).disabled = true;
        (document.getElementById(`texto5`) as HTMLInputElement).disabled = false;
      } else if (value === 2) {
        (document.getElementById(`texto5`) as HTMLInputElement).disabled = true;
        (document.getElementById(`texto6`) as HTMLInputElement).disabled = false;
      }
      (document.getElementById(`${i}`) as HTMLInputElement).value = '';
    } catch (error) {
      console.log(error);
    }
  }

  onRadioClick(i) {
    console.log(`${i}`);
    try {
      (document.getElementById(`${i}`) as HTMLInputElement).checked = false;
    } catch (error) {
      console.log(error);
    }
  }
}
