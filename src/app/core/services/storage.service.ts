import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  // Armazenando formulários respondidos.

  addForms(name, value) {
    return this.storage.set(`${name}`, value);
  }

  // Recuperando formulários armazenados.
  recoveringForms() {
    return this.storage.get('FORMS');
  }

  recoveringLocal() {
    return this.storage.get('LOCAL');
  }

  // Recuperando dados armazendados do usuário.
  recoveringUser() {
    return this.storage.get('USER_INFO');
  }

  removeQuestions() {
    return this.storage.remove('LOCAL');
  }

  removeLogged() {
    return this.storage.remove('USER_INFO');
  }
}
