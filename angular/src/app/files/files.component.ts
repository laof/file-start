import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpLocalhost, HttpUrl } from '../shared/http/http-url';
import {
  GridLayoutService,
  LastViewService,
  PathService,
  ViewHistory,
  ViewHistoryService,
  ViewModeService,
} from '../shared/service/storage.service';
import { saveAs } from 'file-saver';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { toSize } from '../shared/common';
import { UploadComponent } from '../upload/upload.component';

enum FileType {
  directory = 'directory',
  file = 'file',
}

interface FileItem {
  size: number;
  name: string;
  type: FileType;
  path: string;

  children?: FileItem[];
  download?: string;
  extension?: string;
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less'],
})
export class FilesComponent implements OnInit {
  @ViewChild('uploadRef') uploadRef: UploadComponent | undefined;
  private root = '';
  private fileMap: any = {};

  lastViewFile = '';
  historyList: ViewHistory[] = [];

  visibleDrawer = false;
  placement: NzDrawerPlacement = 'bottom';
  uploadDir = '';

  loading = true;

  fileType = FileType.file;
  size: NzButtonSize = 'small';
  fileList: NzUploadFile[] = [];
  children: any = [];
  view = false;
  gridStyle = false;

  cache = {
    path: 'loading...',
    mode: '',
    gridList: '',
    homePath: '',
  };

  constructor(
    private http: HttpClient,
    private pathService: PathService,
    private viewService: ViewModeService,
    private lastView: LastViewService,
    private historyService: ViewHistoryService,
    private gridLayoutService: GridLayoutService,
    private message: NzMessageService
  ) {
    this.view = !!this.viewService.getItem();
    this.gridStyle = !!this.gridLayoutService.getItem();
    this.lastViewFile = this.lastView.getItem();
    this.loadData();
  }

  upload() {
    if (this.uploadRef) {
      this.uploadDir = this.cache.path;
      this.uploadRef.visible = true;
    }
  }

  back() {
    var thanPath = this.cache.path;
    if (thanPath && thanPath != this.root) {
      var list = thanPath.split('/');
      list.pop();
      this.children = this.sort(list.join('/'));
    } else {
      this.children = this.sort(this.root);
    }
  }

  home() {
    this.children = this.sort(this.root);
  }

  setPathMap(item: any) {
    var children: any[] = item.children;
    if (children) {
      if (!this.fileMap[item.path] && item.type != 'file') {
        this.fileMap[item.path] = children;
      }
      children.forEach((v) => {
        this.setPathMap(v);
      });
    }
  }

  currentPath(path: string) {
    this.pathService.setItem(path);
    this.cache.path = path;
  }

  loadData() {
    this.loading = true;
    this.http.post(HttpUrl.list, null).subscribe(
      (data: any) => {
        this.loading = false;
        if (data && data.success) {
          this.root = data.path;
          const path = this.pathService.getItem() || this.root;
          this.fileMap = {};
          this.setPathMap(data);
          this.children = this.sort(path);
        }
      },
      () => (this.loading = false)
    );
  }

  fileClick(item: FileItem) {
    if (item.children) {
      this.children = this.sort(item.path);
    } else if (item.type === FileType.file) {
      const url = HttpLocalhost + item.download;
      if (this.view) {
        const w = window.open(url);
        if (w?.document) {
          this.lastView.setItem(item.path);
          this.lastViewFile = item.path;
          w.document.title = item.name;
          const date = new Date();
          this.historyService.setList({
            time: date.toLocaleTimeString(),
            date: date.toLocaleDateString(),
            path: item.path,
            fileName: item.name,
          });
        }
      } else {
        this.downloadHttp(item, url);
      }
    }
  }

  downloadHttp(item: FileItem, url = '') {
    saveAs(HttpLocalhost + item.download, item.name);
    // this.http.post(HttpUrl.download, null, {
    //   params: { file: this.root + item.download, fileName: item.name }
    // }).subscribe(res => { })
  }

  openDrawer() {
    this.visibleDrawer = true;
    this.historyList = this.historyService.getList();
  }

  onViewChange() {
    this.view = !this.view;
    this.viewService.setItemByBoolean(this.view);
  }

  onStyleChange() {
    this.gridStyle = !this.gridStyle;
    this.gridLayoutService.setItemByBoolean(this.gridStyle);
  }

  sort(key: string): any[] {
    var data = this.fileMap[key];
    this.currentPath(key);
    if (data) {
      const directory: any[] = [];
      const files: any[] = [];
      data.forEach((v: any, i: number) => {
        var isFile = v.type == 'file';
        if (isFile) {
          files.push(v);
        } else {
          directory.push(v);
        }
      });
      return directory.concat(files);
    }
    return [];
  }

  toSize(size: number) {
    return toSize(size);
  }

  ngOnInit(): void { }
}
