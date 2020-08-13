import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../models/user';
import { UserResponse } from '../models/user-response';
import { endpoints } from '../constants/endpoints';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(private storage: Storage,
              private router: Router,
              private platform: Platform,
              private http: HttpClient,
              private storageservice: StorageService) {
    this.platform.ready().then(() => {
      this.isLoggedIn();
    });
  }

  // Método para verificar se usuário está logado.
  isLoggedIn() {
    this.storage.get('USER_INFO').then((response) => {
      if (response) {
        this.authState.next(true);
        console.log('Dados persistidos do usuário logado: ', response);
        console.log(endpoints.authentication.login);
      }
    });
  }

  // Logando e persistindo os dados do usuário na aplicação
  login(user: User): Observable<UserResponse> {
    return this.http.post(endpoints.authentication.login, user).pipe(
      tap(async (res: UserResponse) => {
        if (res) {
          await this.storage.set('USER_INFO', res);
          this.router.navigate(['quiz/list'], {replaceUrl: true});
          this.authState.next(true);
        }
      })
    );
  }

  // Logoff.
  logout() {
    this.storageservice.removeLogged().then(() => {
      this.router.navigate(['login']);
      this.authState.next(false);
    });
  }

  // Método que confirma o usuário logado.
  isAuthenticated() {
    return this.authState.value;
  }
}
