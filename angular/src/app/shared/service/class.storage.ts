export class LocalStorage {
    private storage = window.localStorage;
    key = '';

    constructor(key: string) {
        this.key = key;
    }

    setItem(value: any) {
        this.storage.setItem(this.key, value);
    }

    getItem(): any {
        return this.storage.getItem(this.key);
    }

    setItemByBoolean(bool: boolean) {
        this.storage.setItem(this.key, bool ? 'yes' : '');
    }
}