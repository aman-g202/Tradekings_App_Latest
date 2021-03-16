import { Injectable } from '@angular/core';
import { LoadingController, ToastController, PopoverController, AlertController } from '@ionic/angular';
import { PopoverComponent } from '../../app/shared/popover/popover.component';

@Injectable({ providedIn: 'root' })
export class WidgetUtilService {
  popoverInstance: any = {};

  constructor(
    private loadingController: LoadingController,
    public toastController: ToastController,
    private popoverController: PopoverController,
    private alertController: AlertController) {
  }

  async showLoader(message: string, duration: number) {
    const loaderDownloading = await this.loadingController.create({
      message,
      duration
    });
    loaderDownloading.present();
    return loaderDownloading;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  dismissPopover(data = '') {
    this.popoverController.dismiss();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  showConfirm(header: string, message: string) {
    return new Promise(async (resolve, reject) => {
      const confirm = this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'No',
            handler: () => {
              resolve('No');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              resolve('Yes');
            }
          }
        ]
      });
      try {
        (await confirm).present();
      } catch (error) {
        reject(error);
      }
    });
  }


  showAlert(message: string) {
    this.alertController.create({
      message,
      buttons: ['OK']
    }).then(res => {
      res.present();
    });

  }
}

