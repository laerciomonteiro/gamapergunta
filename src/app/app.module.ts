import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { IonicStorageModule } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';

import { ApiService } from './core/services/api.service';
import { AuthGuard } from './core/guards/auth.guard';
import { Interceptor } from './core/interceptors/interceptor.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NativeHttpModule,
    IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend] },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    Interceptor,
    ApiService,
    AuthGuard,
    Network
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
