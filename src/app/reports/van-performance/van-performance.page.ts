import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { ReportService } from 'src/providers/services/reports/reports.service';
import { StorageServiceProvider } from 'src/providers/services/storage/storage.service';
import { WidgetUtilService } from 'src/providers/utils/widget';
import pdfMake from 'pdfmake/build/pdfmake';
@Component({
  selector: 'app-van-performance',
  templateUrl: './van-performance.page.html',
  styleUrls: ['./van-performance.page.scss'],
})
export class VanPerformancePage implements OnInit {

  list = [];
  filterdList = [];
  isFilterDegrowing = false;
  isFilterNonBilling = false;
  selectedCategoryType: string = 'all';
  searchQuery: string = '';
  profile = {}
  externalId: string = '';

  heightOfPDF;
  _minWidth;
  pdfObj;
  loaderDownloading;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    public navCtrl: NavController,
    public reportService: ReportService,
    public loadingCtrl: LoadingController,
    private storageService: StorageServiceProvider,
    private widgetUtil: WidgetUtilService,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private socialSharing: SocialSharing,
    private alertCtrl: AlertController,
  ) {
  }


  async ngOnInit() {
    this.profile = await this.storageService.getFromStorage('profile');
    if (this.profile['userType'] === 'ADMINHO' || this.profile['userType'] === 'ADMIN') {
      this.externalId = '';
    } else {
      this.externalId = this.profile['externalId'];
    }
    this.getData();
  }

  async getData () {
    const loader = await this.widgetUtil.showLoader("Getting Data...", 30000);
    loader.present()
    this.reportService.getVANPerformanceData(this.externalId).subscribe((data: any) => {
      this.list = data.body;
      this.getList().then(data => {
        this.filterdList = JSON.parse(JSON.stringify(data));
        this.filterdList = this.filterdList.filter(item => {
          return item.categoryName.toLowerCase() === 'total';
        })
        loader.dismiss();
      })
    }, err => {
      console.log(err);
      loader.dismiss();
    })
  }

  getList = async () => {
    return Promise.all(this.list.map(item => {
      if (isNaN(item.percentage)) {
        item.percentage = 0;
      }
      return item;
    }))
  }

  async onCategoryTypeSelect(value, applyFilters) {
    const loader = await this.widgetUtil.showLoader("Please Wait...", 30000);
    loader.present()
    this.selectedCategoryType = value;
    if (value === 'all') {
      this.filterdList = this.list.filter(item => {
        return item.categoryName.toLowerCase() === 'total';
      })
    } else {
      this.filterdList = this.list.filter(item => {
        return item.categoryName.toLowerCase() === this.selectedCategoryType.toLowerCase();
      })
    }

    if (applyFilters) {
      if (this.isFilterDegrowing) {
        await this.onCategoryTypeSelect(this.selectedCategoryType, false)
        this.filterdList = this.filterdList.filter(item => {
          return item.percentage < 0;
        })
      } else if (this.isFilterNonBilling) {
        this.filterdList = this.filterdList.filter(item => {
          return item.mtd === 0;
        })
        this.filterdList = this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
      }
    }
    if (this.searchQuery != '') {
      this.filterdList = this.filterdList.filter(item => {
        return item.vanName.toLowerCase().includes(this.searchQuery.toLowerCase());
      })
    }
    loader.dismiss();
  }


  async filterNonBillingOutlet() {
    const loader = await this.widgetUtil.showLoader("Please Waita...", 30000);
    loader.present()
    this.isFilterNonBilling = !this.isFilterNonBilling;
    if (this.isFilterNonBilling) {
      this.isFilterDegrowing = false;
      await this.onCategoryTypeSelect(this.selectedCategoryType, false)
      this.filterdList = this.filterdList.filter(item => {
        return item.mtdTonnage === 0;
      })
      this.filterdList = this.filterdList.sort((a, b) => (a.lymtdTonnage < b.lymtdTonnage) ? 1 : -1);
    } else {
      await this.onCategoryTypeSelect(this.selectedCategoryType, false);
    }
    loader.dismiss();
  }

  async filterDegrowingOutlet() {
    const loader = await this.widgetUtil.showLoader("Please Wait...", 30000);
    loader.present()
    this.isFilterDegrowing = !this.isFilterDegrowing;
    if (this.isFilterDegrowing) {
      this.isFilterNonBilling = false;

      await this.onCategoryTypeSelect(this.selectedCategoryType, false)
      this.filterdList = this.filterdList.filter(item => {
        return item.percentage < 0;
      })

    } else {

      await this.onCategoryTypeSelect(this.selectedCategoryType, false);
    }
    loader.dismiss();
  }


  async searchVAN(name) {
    const loader = await this.widgetUtil.showLoader("Please Wait...", 30000);
    loader.present()
    this.searchQuery = name;
    await this.onCategoryTypeSelect(this.selectedCategoryType, true)
    this.filterdList = this.filterdList.filter(item => {
      return item.vanName.toLowerCase().includes(name.toLowerCase());
    })
    loader.dismiss();
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    if (isNaN(year)) {
      return 'NA'
    } else {
      return [year, month, day].join('-')
    }
  }

  async onCreatePdf(type: string) {
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
          { text: 'VAN PERFORMANCE', fontSize: 18, bold: true, alignment: 'center', color: '#225f93', decoration: 'underline' },
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
            ]
          },
          { text: ` CATEGORY FILTER :`, bold: true, color: textColorPrimary, absolutePosition: { x: 50, y: this.heightOfPDF += 90 }, fontSize: 13 },
          { text: `${this.selectedCategoryType.toUpperCase()}`, color: 'grey', absolutePosition: { x: 167, y: this.heightOfPDF += 0 }, fontSize: 12 },
          { text: 'VAN TYPE:', bold: true, color: textColorPrimary, absolutePosition: { x: 50, y: this.heightOfPDF += 20 }, fontSize: 13 },
          { text: `${!this.isFilterNonBilling && !this.isFilterDegrowing ? "ALL" : this.isFilterNonBilling ? 'NON BILLED ' : 'DECLINING'}`, color: 'grey', absolutePosition: { x: 120, y: this.heightOfPDF }, fontSize: 12 },
          {
            absolutePosition: { x: 40, y: this.heightOfPDF += 80 },
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

      this.pdfObj = pdfMake.createPdf(documentDefinition);
      this.downloadPdf(type);

    }, 1000);
  }




  prepareTable() {
    let headingColor = '#8f1515';
    let textColorSecondary = '#202020';
    const body = []
    body.push(
      [
        { text: 'VAN Code', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'VAN Name', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'FTD Tonnage', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'MTD Tonnage', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'LMTD Tonnage', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'LYMTD Tonnage', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: '% Growth over LYMTD', color: headingColor, bold: true, _minWidth: 5, fontSize: 10, margin: [0, 6, 0, 6] }
      ]
    );

    for (let i = 0; i < this.filterdList.length; i++) {
      this.heightOfPDF += 20;
      const row = [
        {
          text: `${this.filterdList[i].vanCode}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].vanName}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].ftdTonnage.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].mtdTonnage.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].lmtdTonnage.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].lymtdTonnage.toFixed(2)}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.filterdList[i].percentage}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },

      ]
      body.push(row);
    }
    return body;
  }

  downloadPdf(type: string) {
    if (window['cordova']) {
      this.pdfObj.getBuffer(buffer => {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        let binaryArray = utf8.buffer; //
        let storageLocation: any;
        const pdfName = `${"VAN PERFORMANCE"}-${new Date().getFullYear()}-${this.months[new Date().getMonth()]}-${new Date().getDate()}.pdf`;
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
                    this.loaderDownloading.dismiss()
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
                                  const alert = await this.alertCtrl.create({ message: "225" + JSON.stringify(err.message), buttons: ['Ok'] });
                                  alert.present();
                                });
                            }
                          }
                        ]
                      });
                      confirm.present();
                    } else if (type === 'share') {
                      this.socialSharing.share(`Van Performance `, null, `${storageLocation}${pdfName}`, null).then(result => {
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
                this.loaderDownloading.dismiss()
                const alert = await this.alertCtrl.create({ message: "245" + JSON.stringify(err), buttons: ['Ok'] });
                alert.present();
              });
          })
          .catch(async err => {
            this.loaderDownloading.dismiss()
            const alert = await this.alertCtrl.create({ message: "251" + JSON.stringify(err), buttons: ['Ok'] });
            alert.present();
          });

      });
    } else {
      this.loaderDownloading.dismiss()
      this.pdfObj.open();
    }
  }

  onSharePdf() {
    this.onCreatePdf('share');
  }


  ngOnDestroy() {
    localStorage.removeItem('vanPerformanceList');
  }
}
