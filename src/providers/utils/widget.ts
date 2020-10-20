import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({providedIn: 'root'})
export class WidgetUtilService {
  constructor (
    private loadingController: LoadingController,
    public toastController: ToastController) {
  }

  async showLoader (message:string, duration:number) {
    const loaderDownloading = await this.loadingController.create({
        message: message,
        duration: duration
    });
    return new Promise((resolve, reject) => {
        loaderDownloading.present();
        resolve(loaderDownloading);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}

