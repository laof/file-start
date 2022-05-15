import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FilesComponent } from './files/files.component';
// import { ChatComponent } from './chat/chat.component';
import { CommonHttpInterceptor } from './shared/http/http.interceptor';

import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { antDesignIcons } from './icons';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { UploadComponent } from './upload/upload.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { initializeAppFactory } from './app-init.service';
import { GoChatComponent } from './chat/go-chat.component';
import { ChatComponent } from './chat/chat.component';

registerLocaleData(en);

const LoadNzModuel = [
  NzMenuModule,
  NzInputModule,
  NzDrawerModule,
  NzMessageModule,
  NzModalModule,
  NzUploadModule,
  NzSwitchModule,
  NzButtonModule,
  NzSpinModule,
];



@NgModule({
  declarations: [
    AppComponent,
    FilesComponent,
    ChatComponent,
    UploadComponent,
    GoChatComponent,
    ChatComponent
  ],
  imports: [
    ...LoadNzModuel,
    NzIconModule.forRoot(antDesignIcons),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
