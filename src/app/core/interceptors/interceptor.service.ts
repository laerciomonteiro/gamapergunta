import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {

  constructor(private storageservice: StorageService,
              private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storageservice.recoveringUser())
      .pipe(
        switchMap((token: UserResponse) => {
          if (token) {
            request = request.clone({
              headers: request.headers.set('Authorization', 'Bearer ' + token.token.key)
            });
          }

          if (!request.headers.has('Content-Type')) {
            request = request.clone({
              headers: request.headers.set('Content-Type', 'application/json')
            });
          }

          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
              }
              return event;
            }),
            catchError((error: HttpErrorResponse) => {
              const status = error.status;
              console.log('Erro: ', status);
              const reason = error && error.error.reason ? error.error.reason : '';

              if (status === 401) {
                this.router.navigate(['/login']);
              }
              return throwError(error);
            })
          );
        })
      );
  }
}
