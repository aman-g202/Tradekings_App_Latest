import { Component } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { ReportService } from 'src/providers/services/reports/reports.service';
import { WidgetUtilService } from 'src/providers/utils/widget';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.page.html',
  styleUrls: ['./price-list.page.scss'],
})
export class PriceListPage {

  loaderDownloading;

  constructor(
    public navCtrl: NavController,
    public reportService: ReportService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    public widgetUtil: WidgetUtilService,
    private socialSharing: SocialSharing
    ) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPriceListPage');
  }

  async downloadReport (reportType: string, type:string) {
    const loader: any = await this.widgetUtil.showLoader('Getting Data...', 30000);
    this.reportService.downloadReport(reportType).subscribe(data => {
      if (window['cordova']) {
        var blob = new Blob([data], {type: "application/pdf"});
        new Response(blob).arrayBuffer()
        .then(buffer => {
          var utf8 = new Uint8Array(buffer);
          let binaryArray = utf8.buffer;
          let storageLocation: any;
          const pdfName = `${reportType}.pdf`;
          if (this.platform.is('ios')) {
            storageLocation = this.file.documentsDirectory;
          } else {
            storageLocation = this.file.externalRootDirectory;
          }
          this.file.resolveDirectoryUrl(storageLocation)
            .then(dirEntry => {
              this.file.getFile(dirEntry, pdfName, { create: true })
                .then(fileEntry => {
                  fileEntry.createWriter(writer => {
                    writer.onwrite = async () => {
                      loader.dismiss();
                      if (type === 'download') {
                        const confirm = await this.alertCtrl.create({
                          message: `Your Pdf is downloaded with named as ${pdfName} in your storage ${storageLocation}, Do you want to open now!`,
                          buttons: [
                            {
                              text: 'Cancel',
                              handler: () => {
                                console.log('Confirmed Cancel');
                              }
                            },
                            {
                              text: 'Okay',
                              handler: () => {
                                this.fileOpener.open(`${storageLocation}${pdfName}`, 'application/pdf')
                                  .then(res => { })
                                  .catch(async err => {
                                    loader.dismiss();
                                    const alert = await this.alertCtrl.create({ message: "225" + JSON.stringify(err.message), buttons: ['Ok'] });
                                    alert.present();
                                  });
                              }
                            }
                          ]
                        });
                        confirm.present();
                      } else if (type === 'share') {
                        this.socialSharing.share(`${reportType}`, null, `${storageLocation}${pdfName}`, null).then(result => {
                          console.log('Shared');
                        }).catch(async err => {
                          const alert = await this.alertCtrl.create({ message: "368" + err.message, buttons: ['Ok'] });
                          alert.present();
                        });
                      }
                    }
                    writer.write(binaryArray);
                  })
                })
                .catch(async err => {
                  loader.dismiss();
                  const alert = await this.alertCtrl.create({ message: "245" + JSON.stringify(err), buttons: ['Ok'] });
                  alert.present();
                });
            })
            .catch(async err => {
              loader.dismiss();
              const alert = await this.alertCtrl.create({ message: "251" + JSON.stringify(err), buttons: ['Ok'] });
              alert.present();
            });

        });
      } else {
        loader.dismiss();
        var blob = new Blob([data], {type: "application/pdf;charset=utf-8"});
        FileSaver.saveAs(blob, reportType);
      }
    }, err => {
      loader.dismiss();
      this.widgetUtil.presentToast('File not found!');
    })
  }
}
