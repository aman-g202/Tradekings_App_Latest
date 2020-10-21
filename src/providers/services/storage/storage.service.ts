import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class StorageServiceProvider {

  constructor(public storage: Storage) { }

  getFromStorage(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  setToStorage(key: string, value: any) {
    return this.storage.set(key, value);
  }

  removeFromStorage(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.remove(key)
        .then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  clearStorage() {
    this.storage.clear();
  }
}
