import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { StorageServiceProvider } from 'src/providers/services/storage/storage.service';
import { CONSTANTS } from 'src/providers/utils/constants';
import { WidgetUtilService } from 'src/providers/utils/widget';
import { ReportService } from 'src/providers/services/reports/reports.service';

@Component({
  selector: 'app-sku-performance',
  templateUrl: './sku-performance.page.html',
  styleUrls: ['./sku-performance.page.scss'],
})
export class SkuPerformancePage implements OnInit {
  filterdList = [];
  isFilterDegrowing = false;
  isFilterNonBilling = false;
  categoryName: string = 'total';
  searchQuery: string = ''
  includeTonnage: boolean = false;
  profile = {}
  externalId: string = '';
  skuName: string = ''
  skip = 0;
  limit = 20;
  loaderDownloading: any;
  heightOfPDF: number;
  _minWidth: number;
  pdfObj: any;
  dataAvailable = false;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  @ViewChild('scrollOne') scrollOne: ElementRef;
  @ViewChild('scrollTwo') scrollTwo: ElementRef;


  constructor(
    public navCtrl: NavController,
    public reportService: ReportService,
    private storageService: StorageServiceProvider,
    private widgetUtil: WidgetUtilService,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing) {
  }


  async ngOnInit () {
    this.profile = await this.storageService.getFromStorage('profile');
    if (this.profile['userType'] === 'ADMINHO' || this.profile['userType'] === 'ADMIN') {
      this.externalId = '';
      this.getData();
    } else {
      this.externalId = this.profile['externalId'];
      this.getData();
    }
  }

  async getData () {
    const loader = await this.widgetUtil.showLoader('Getting Data...', 30000);
    this.reportService.getSKUPerformanceFilterData(this.prepareQuery()).subscribe((data: any) => {
      this.filterdList = data.body;
      this.dataAvailable = true;
      loader.dismiss();
    }, error => {
      loader.dismiss();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  prepareQuery () {
    let filter = {
      externalId: this.externalId,
      skip: this.skip.toString(),
      limit: this.limit.toString(),
      skuName: this.skuName === '' ? undefined : this.skuName,
      categoryName: this.categoryName,
      searchQuery: this.searchQuery === '' ? undefined : this.searchQuery
    };
    return filter = JSON.parse(JSON.stringify(filter));
  }

  onCategoryTypeSelect (value) {
    if (value === 'total') {
      this.categoryName = value
    } else {
      this.categoryName = value
    }
    this.skip = 0;
    this.limit = CONSTANTS.PAGINATION_LIMIT;
    this.getData();
  }


  onGetSkuValue (getskuName) {
    if (getskuName === 'NONBILLED') {
      if (this.skuName === 'NONBILLED') {
        this.isFilterNonBilling = false
        this.skuName = ''
      } else {
        this.isFilterNonBilling = true;
        this.isFilterDegrowing = false
        this.skuName = getskuName
      }
    } else {
      if (this.skuName === 'DCLSKU') {
        this.skuName = ''
        this.isFilterDegrowing = false

      } else {
        this.isFilterDegrowing = true;
        this.isFilterNonBilling = false;
        this.skuName = getskuName;
      }
    }
    this.skip = 0;
    this.limit = CONSTANTS.PAGINATION_LIMIT;
    this.getData()
  }

  searchSKU (name) {
      this.searchQuery = name;
      this.skip = 0;
      this.limit = CONSTANTS.PAGINATION_LIMIT;
      this.getData();
  }

  doInfinite (infiniteScroll) {
    this.skip = this.skip + this.limit;
    this.reportService.getSKUPerformanceFilterData(this.prepareQuery()).subscribe((result) => {
      if (result.body.length > 0) {
        result.body.map((value) => {
          this.filterdList.push(value)
        })
      }
      infiniteScroll.target.complete();
    }, (error) => {
      infiniteScroll.target.complete();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  doRefresh (refresher): void {
    this.skip = 0;
    this.limit = CONSTANTS.PAGINATION_LIMIT;
    this.getData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


  async onCreatePdf (type: string) {
    if (type === 'share') {
      this.loaderDownloading = await this.widgetUtil.showLoader('Kindly wait, Preparing Pdf...', 30000);
    } else {
      this.loaderDownloading = await this.widgetUtil.showLoader('Please wait while downloading...', 30000);
    }
    setTimeout(() => {
      this.heightOfPDF = 0;
      this._minWidth = 0;
      let textColorPrimary = '#000000';
      const documentDefinition = {
        header: function (currentPage, pageCount, pageSize) {
          return [
            {
              text: `Page ${currentPage} of ${pageCount}`,
              fontSize: 12,
              color: 'grey',
              margin: 10,
              alignment: 'right'
            }
          ]
        },
        pageSize: 'A4',
        content: [
          { text: 'SKU PERFORMANCE', fontSize: 18, bold: true, alignment: 'center', color: '#225f93', decoration: 'underline' },
          {
            canvas: [
              {
                type: 'rect',
                x: 0.5,
                y: 15,
                w: 250,
                h: 90,
                r: 4,
                lineColor: '#D3D3D3',
                color: '#D3D3D3'
              },
              {
                type: 'rect',
                x: 0.5,
                y: 13,
                w: 248,
                h: 87,
                r: 4,
                lineColor: '#D3D3D3',
                color: 'white'
              }
            ],absolutePosition : { x: this.includeTonnage ? 40 : 60, y: 70 }
          },
          { text: ` CATEGORY FILTER :`, bold: true, color: textColorPrimary, absolutePosition: { x: this.includeTonnage ? 50 : 70, y: this.heightOfPDF += 110 }, fontSize: 12 },
          { text: `${this.categoryName.toUpperCase()}`, color: 'grey', absolutePosition: { x: this.includeTonnage ? 160 : 180, y: this.heightOfPDF  }, fontSize: 12 },
          { text: 'SKU TYPE :', bold: true, color: textColorPrimary, absolutePosition: { x: this.includeTonnage ? 50 : 70, y: this.heightOfPDF += 20 }, fontSize: 12 },
          { text: `${!this.isFilterNonBilling && !this.isFilterDegrowing ? "ALL" : this.isFilterNonBilling ? 'NON BILLED ' : 'DECLINING'}`, color: 'grey', absolutePosition: { x: this.includeTonnage ? 115 : 135, y: this.heightOfPDF }, fontSize: 12 },
          {
            absolutePosition: { x: this.includeTonnage === true ? 38 : 60, y: this.heightOfPDF += 65 },
            // layout: 'lightHorizontalLines', // optional
            table: {
              headerRows: 1,
              _minWidth: [50, 50, 50, 50, 50, 50, '*'],
              body: this.prepareTable()
            },
            layout: { hLineColor: 'black', vLineColor: 'black' }
          }
        ],
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          let flag = false;
          if (currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0) {
            flag = true;
          }

          if (currentNode.startPosition.top > 750) {
            flag = true;
          }
          return flag;
        }
      };
      this.reportService.downloadPdf(documentDefinition, 'share', 'SKU PERFORMANCE');
      this.loaderDownloading.dismiss()
      // this.pdfObj = pdfMake.createPdf(documentDefinition);
      // this.downloadPdf(type);

    }, 1000);
  
  }




  prepareTable () {
    let headingColor = '#8f1515';
    let textColorSecondary = '#202020';
    let textColorDanger = '#FF0000';
    const body = []
    body.push(
      [
        { text: 'SKU Code', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'SKU Name', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: this.includeTonnage === true ? 'FTD Tonnage' : 'FTD', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: this.includeTonnage === true ? 'MTD Tonnage' : 'MTD', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: this.includeTonnage === true ? 'LMTD Tonnage' : 'LMTD', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: this.includeTonnage === true ? 'LYMTD Tonnage' : 'LYMTD', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: '% Growth over LYMTD', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] }
      ]
    );

    for (let i = 0; i < this.filterdList.length; i++) {
      this.heightOfPDF += 20;
      const row = [
        {
          text: `${this.filterdList[i].productCode}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].productName}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.includeTonnage === true ? this.filterdList[i].ftdTonnage.toFixed(2) : this.filterdList[i].ftd.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.includeTonnage === true ? this.filterdList[i].mtdTonnage.toFixed(2) : this.filterdList[i].mtd.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.includeTonnage === true ? this.filterdList[i].lmtdTonnage.toFixed(2) : this.filterdList[i].lmtd.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.includeTonnage === true ? this.filterdList[i].lymtdTonnage.toFixed(2) : this.filterdList[i].lymtd.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].percentage}`,
          color: this.filterdList[i].percentage < 0 ? textColorDanger : textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },

      ]
      body.push(row);
    }
    return body;
  }

  // async downloadPdf (type: string) {
  //   if (window['cordova']) {
  //     this.pdfObj.getBuffer(buffer => {
  //       var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
  //       let binaryArray = utf8.buffer; //
  //       let storageLocation: any;
  //       const pdfName = `${"SKU PERFORMANCE"}-${new Date().getFullYear()}-${this.months[new Date().getMonth()]}-${new Date().getDate()}.pdf`;
  //       if (this.platform.is('ios')) {
  //         storageLocation = this.file.dataDirectory;
  //       } else {
  //         storageLocation = this.file.externalRootDirectory;
  //       }
  //       this.file.resolveDirectoryUrl(storageLocation)
  //         .then(dirEntry => {
  //           this.file.getFile(dirEntry, pdfName, { create: true })
  //             .then(fileEntry => {
  //               fileEntry.createWriter(writer => {
  //                 writer.onwrite = async () => {
  //                   this.loaderDownloading.dismiss()
  //                   if (type === 'download') {
  //                     const confirm = await this.alertCtrl.create({
  //                       message: `Your Pdf is downloaded with named as ${pdfName} in your storage ${storageLocation}, Do you want to open now!`,
  //                       buttons: [
  //                         {
  //                           text: 'Cancel',
  //                           handler: () => {
  //                             console.log('Confirmed Cancel');
  //                           }
  //                         },
  //                         {
  //                           text: 'Okay',
  //                           handler: () => {
  //                             this.fileOpener.open(`${storageLocation}${pdfName}`, 'application/pdf')
  //                               .then(res => { })
  //                               .catch(async err => {
  //                                 const alert = await this.alertCtrl.create({ message: "225" + JSON.stringify(err.message), buttons: ['Ok'] });
  //                                 alert.present();
  //                               });
  //                           }
  //                         }
  //                       ]
  //                     });
  //                     confirm.present();
  //                   } else if (type === 'share') {
  //                     this.socialSharing.share(`Van Performance `, null, `${storageLocation}${pdfName}`, null).then(result => {
  //                       console.log('Shared');
  //                     }).catch(async err => {
  //                       const alert = await this.alertCtrl.create({ message: "368" + err.message, buttons: ['Ok'] });
  //                       alert.present();;
  //                     });
  //                   }
  //                 }
  //                 writer.write(binaryArray);
  //               })
  //             })
  //             .catch(async err => {
  //               this.loaderDownloading.dismiss()
  //               const alert = await this.alertCtrl.create({ message: "245" + JSON.stringify(err), buttons: ['Ok'] });
  //               alert.present();
  //             });
  //         })
  //         .catch(async err => {
  //           this.loaderDownloading.dismiss()
  //           const alert = await this.alertCtrl.create({ message: "251" + JSON.stringify(err), buttons: ['Ok'] });
  //           alert.present();
  //         });

  //     });
  //   } else {
  //     this.loaderDownloading.dismiss()
  //     this.pdfObj.open();
  //   }
  // }

  onSharePdf () {
    this.onCreatePdf('share');
  }

  
  updateScroll(){
    const scrollOne = this.scrollOne.nativeElement as HTMLElement;
    const scrollTwo = this.scrollTwo.nativeElement as HTMLElement;
    scrollTwo.scrollLeft = scrollOne.scrollLeft;
  }

  updateScrollHeader(){
    const scrollOne = this.scrollOne.nativeElement as HTMLElement;
    const scrollTwo = this.scrollTwo.nativeElement as HTMLElement;
    scrollOne.scrollLeft = scrollTwo.scrollLeft;
  }


}
