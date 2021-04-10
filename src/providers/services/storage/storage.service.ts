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

  getCartFromStorage() {
    return new Promise((resolve, reject) => {
      this.storage.get('cart')
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            this.storage.set('cart', []).then(res => {
              resolve([]);
            });
          }
        }).catch(err => {
          reject(err);
        });
    });
  }

 
  getTkPointsFromStorage() {
    return new Promise((resolve, reject) => {
      this.storage.get('tkpoint')
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            this.storage.set('tkpoint', 0).then(res => {
              resolve(0);
            });
          }
        }).catch(err => {
          reject(err);
        });
    });
  }

  async clearCart() {
    await this.setToStorage('cart', []);
    await this.removeFromStorage('tkpoint');
    await this.setToStorage('totalNetWeight', 0);
    await this.setToStorage('orderTotal', 0);
  }
}
