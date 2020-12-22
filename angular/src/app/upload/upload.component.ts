import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { toDataURL } from 'qrcode';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { toSize } from '../shared/common';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
})
export class UploadComponent {
  @ViewChild('uploadTaget', { static: true }) uploadTaget:
    | ElementRef
    | undefined;

  #visible = false;
  allDone: boolean = false;
  speedInfo = '';
  uplodInfo = '';
  oldReceive: number = 0;

  fileList: NzUploadFile[] = [];

  @Input() uploadUrl = '';
  @Input()
  set visible(value: boolean) {
    if (value && this.uploadTaget) {
      this.uploadTaget.nativeElement.onclick();
      console.log(123);
    }
    console.log(value);
    this.#visible = value;
  }
  get visible(): boolean {
    return this.#visible;
  }

  deleteFile = () => {
    setTimeout(() => this.uploadChange(), 100);
    return true;
  };

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private http: HttpClient
  ) {}

  cancel() {
    this.visible = false;
  }

  clearList() {
    this.fileList = [];
    this.visible = false;
  }

  uploadChange() {
    let total = 0;
    let receive = 0;
    let done = 0;

    this.uplodInfo = '';
    this.speedInfo = '';

    this.fileList.forEach((item) => {
      if (item.status === 'done') {
        done++;
      }
      if (item.percent && item.size) {
        total += item.size || 0;
        receive += item.size * item.percent * 0.01;
      }
    });

    this.allDone = this.fileList.length === done;

    if (this.fileList.length) {
      const s = this.fileList.length;
      const t = toSize(total, true);
      const r = toSize(receive, true);

      // ---speed
      const size = receive - this.oldReceive;
      let speed = '';
      if (size > 0) {
        speed = `${toSize(size, true)}/s`;
      }
      //  speed---

      this.speedInfo = `${speed} ${done}/${s}`;
      this.uplodInfo = this.allDone ? `Total: ${s} (${t})` : `${r}/${t}`;

      this.oldReceive = receive;
    }
  }
}
