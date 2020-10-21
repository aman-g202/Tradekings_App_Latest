import { Injectable } from '@angular/core';
import { Storage }  from '@ionic/storage';

@Injectable()
export class StorageServiceProvider {

  constructor (public storage: Storage) {
  }

  getFromStorage (key) {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  setToStorage (key, value) {
    return this.storage.set(key, value)
  }

  removeFromStorage (key) {
    return new Promise((resolve, reject) => {
      this.storage.remove(key)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  clearStorage () {
    this.storage.clear()
  }
}
