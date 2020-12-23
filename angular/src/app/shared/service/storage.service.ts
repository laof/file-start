import { Injectable } from '@angular/core';
import { Interface } from 'readline';
import { LocalStorage } from './class.storage';

@Injectable({ providedIn: 'root' })
export class PathService extends LocalStorage {
  constructor() {
    super('path');
  }
}

@Injectable({ providedIn: 'root' })
export class SocketIDService extends LocalStorage {
  constructor() {
    super('socket-id');
  }
}

@Injectable({ providedIn: 'root' })
export class ViewModeService extends LocalStorage {
  constructor() {
    super('view-mode');
  }
}

@Injectable({ providedIn: 'root' })
export class GridLayoutService extends LocalStorage {
  constructor() {
    super('grid-layout');
  }
}

@Injectable({ providedIn: 'root' })
export class LastViewService extends LocalStorage {
  constructor() {
    super('last-view');
  }
}

export interface ViewHistory {
  date: string;
  time: string;
  fileName: string;
  path: string;
}

@Injectable({ providedIn: 'root' })
export class ViewHistoryService extends LocalStorage {
  private max = 20;
  constructor() {
    super('view-history');
  }

  setList(item: ViewHistory) {
    const list = this.getList();
    if (list.length >= this.max) {
      list.pop();
    }
    list.unshift(item);
    this.setItem(JSON.stringify(list));
  }

  getList(): ViewHistory[] {
    try {
      const his = this.getItem();
      return his ? JSON.parse(his) : [];
    } catch (e) {
      return [];
    }
  }
}
