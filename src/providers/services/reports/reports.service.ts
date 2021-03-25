import { File } from '@ionic-native/file/ngx';
import { Injectable, NgModule } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { WidgetUtilService } from '../../utils/widget';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()


export class ReportsService {
  pdfObj: any = {};
  showLoder: any;

  constructor(
    private fileOpener: FileOpener,
    private file: File,
    private platform: Platform,
    private socialSharing: SocialSharing,
    private widgetUtil: WidgetUtilService

  ) { }


  async downloadPdf(documentDefinition, type, fileName) {
    if (type === 'share') {
      this.showLoder = await this.widgetUtil.showLoader('Please wait, Pdf preparing...', 3000);
    } else {
      this.showLoder = await this.widgetUtil.showLoader('Please wait , Pdf Downloading..', 3000);
    }
    const pdfObj = pdfMake.createPdf(documentDefinition);
    if (window['cordova']) {
      this.pdfObj.getBuffer(buffer => {
        const utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        const binaryArray = utf8.buffer;
        let storageLocation: any;
        const pdfName = `${fileName}-${new Date().getFullYear()}-${[new Date().getMonth()]}-${new Date().getDate()}.pdf`;
        if (this.platform.is('ios')) {
          storageLocation = this.file.dataDirectory;
        } else {
          storageLocation = this.file.externalRootDirectory;
        }
        this.file.resolveDirectoryUrl(storageLocation)
          .then(dirEntry => {
            this.file.getFile(dirEntry, pdfName, { create: true })
              .then(fileEntry => {
                fileEntry.createWriter(writer => {
                  writer.onwrite = async () => {
                    this.showLoder.dismiss();
                    if (type === 'download') {
                      const confirm = await this.widgetUtil.showConfirm('Conformation', `Your Pdf is downloaded with named as ${pdfName} in your storage ${storageLocation}, Do you want to open now!`, 'No', 'Yes');
                      if (confirm === 'Yes') {
                        this.fileOpener.open(`${storageLocation}${pdfName}`, 'application/pdf')
                          .then(res => { })
                          .catch(err => {
                            this.widgetUtil.showAlert('225' + JSON.stringify(err.message));
                          });

                      } else {
                        console.log('Confirmed Cancel');
                      }
                    } else if (type === 'share') {
                      this.socialSharing.share(`${storageLocation}${pdfName}`, null).then(result => {
                        console.log('Shared');
                      }).catch(err => {
                        this.widgetUtil.showAlert('368' + JSON.stringify(err.message));
                      });
                    }
                  };
                  writer.write(binaryArray);
                });
              })
              .catch(err => {
                this.showLoder.dismiss();
                this.widgetUtil.showAlert('245' + JSON.stringify(err.message));
              });
          })
          .catch(err => {
            this.showLoder.dismiss();
            this.widgetUtil.showAlert('251' + JSON.stringify(err.message));
          });

      });
    } else {
      this.showLoder.dismiss();
      pdfObj.open();
    }
  }
}
