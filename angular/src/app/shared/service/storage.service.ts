import { Injectable } from "@angular/core";

class BaseStorage {
    stor = window.localStorage
    idKey = 'user_id_1550299839288'
    pathKey = 'file_path_1550299839288'
    viewKey = 'view_mode_1550299839288'
    styleKey = 'style_1550299839288'

    setBase(key: string, value: any) {
        var stor = this.stor
        if (stor) {
            stor.setItem(key, value)
        }
        return '';
    }

    getBase(key: string) {
        return this.stor.getItem(key) || ''
    }

}


@Injectable({ providedIn: 'root' })
export class CommonStorageService extends BaseStorage {

    getPath() {
        return this.getBase(this.pathKey);
    }

    getView() {
        return this.getBase(this.viewKey);
    }


    getMyId() {
        return this.getBase(this.idKey);
    }

    getStyle() {
        return this.getBase(this.styleKey);
    }


    setPath(path: string) {
        this.setBase(this.pathKey, path);
    }

    setView(value: boolean) {
        this.setBase(this.viewKey, value ? 'yes' : '');
    }

    setStyle(value: boolean) {
        this.setBase(this.styleKey, value ? 'yes' : '');
    }

    setMyId(value: string) {
        this.setBase(this.idKey, value);
    }



}