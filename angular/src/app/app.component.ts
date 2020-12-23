import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpUrl } from './shared/http/http-url';
import { toDataURL } from 'qrcode';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'shared-files-ui';
  visible = false;
  host: string = '';
  hostDataUrl = '';
  showShutdown = false;

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private http: HttpClient
  ) {
    this.loadHostInfo().subscribe((data: any) => {
      this.host = data.host;
      this.showShutdown = data.shutdown;
    });
  }

  loadHostInfo() {
    return this.http.post(HttpUrl.host, null);
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
      .then((url) => {
        this.hostDataUrl = url;
      })
      .catch((err) => {
        console.error(err);
      });
    this.visible = true;
  }

  shutdown() {
    this.modalService.confirm(
      {
        nzTitle: '☠☠☠',
        nzContent: 'Turn it off in a minute?',
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzCancelText: 'No',
        nzOnOk: () => {
          this.http.post(HttpUrl.shutdown, null).subscribe(() => {});
        },
      },
      'error'
    );
  }
}
