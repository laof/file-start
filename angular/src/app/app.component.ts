import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpUrl } from './shared/http/http-url';
import { toDataURL } from 'qrcode'
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'shared-files-ui';
  visible = false;
  host: string = '';
  hostDataUrl = '';

  constructor(private message: NzMessageService, private http: HttpClient) {
    this.http.post(HttpUrl.host, null).subscribe((data: any) => {
      this.host = data.host;
    });
  }

  cancel() {
    this.visible = false;
  }

  scan() {
    if (!this.host) {
      this.message.error('Service address error');
      return;
    }
    toDataURL(this.host)
      .then(url => {
        this.hostDataUrl = url;
      })
      .catch(err => {
        console.error(err)
      })
    this.visible = true;
  }
}
