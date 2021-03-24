import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { ReportService } from 'src/providers/services/reports/reports.service';
import { StorageServiceProvider } from 'src/providers/services/storage/storage.service';
import { WidgetUtilService } from 'src/providers/utils/widget';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-invoice-against-order',
  templateUrl: './invoice-against-order.page.html',
  styleUrls: ['./invoice-against-order.page.scss'],
})
export class InvoiceAgainstOrderPage implements OnInit {
  skipValue: number = 0;
  limit: number = 10;
  startDate: string = undefined;
  endDate: string = undefined;
  selectedCustomer: string;
  selectedCustomerName: string;
  widthOfPDF = 0;
  heightOfPDF = 0;
  loaderDownloading;
  pdfObj;
  filterOrderDate:boolean = true;
  currentOrderDateString: string;
  currentInvoiceDateString: string;

  currentOrderNumber: string = '';
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor (
    public navCtrl: NavController,
    public reportService: ReportService,
    private datePicker: DatePicker,
    public storageService: StorageServiceProvider,
    public widgetUtil: WidgetUtilService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private decimalPipe: DecimalPipe,
    private file: File,
    private fileOpener: FileOpener,
    private socialSharing: SocialSharing) {
      this.selectedCustomer = this.navParams.get('externalId');
      this.selectedCustomerName = this.navParams.get('customerName');
  }

  list = [];


  ngOnInit () {
      this.getData(this.selectedCustomer);
  }

  async getData (externalId) {
    const loader: any = await this.widgetUtil.showLoader('Getting Data...', 30000);
    const filterData = {
      externalId: externalId != '' ? externalId : undefined,
      skip: this.skipValue.toString(),
      limit: this.limit.toString(),
      fromDate: this.startDate,
      throughDate: this.endDate,
      filterType : this.filterOrderDate ? 'orderDate' : 'invoiceDate'
    };

    this.reportService.getInvoiceAgainstOrderData(filterData).subscribe((data: any) => {
      let totalItemsinCurrentorder  = 0;
      let totalOrderCases = 0;
      let totalTonnage = 0;
      let totalBilledCases = 0;
      let totalGap = 0;
      const orders: any = data.body;
      const allData = [];
      if (orders && orders.length) {
        orders.forEach(order => {
          if (order.data && order.data.length) {
            order.data  = order.data.sort((a, b) => (a.orderDate < b.orderDate) ? 1 : -1);
            order.data.forEach((item, index) => {
              item['invoiceDateString'] =  this.formatDate(item.invoiceDate)
              item['orderDateString'] = this.formatDate(item.orderDate)
              if (this.currentOrderNumber !== '') {
                if (this.currentOrderNumber === item.orderNumber) {
                  totalItemsinCurrentorder++;
                  totalOrderCases = totalOrderCases + item.orderCases;
                  totalTonnage = totalTonnage + item.tonnage;
                  totalBilledCases = totalBilledCases + item.billedCases;
                  totalGap = totalGap + item.gap;
                  this.currentOrderDateString = item.orderDateString;
                  this.currentInvoiceDateString = item.invoiceDateString;
                  this.currentOrderNumber = item.orderNumber;
                } else {
                  if (totalItemsinCurrentorder > 1) {
                      let newItem = {}
                      newItem['productName'] = 'Total';
                      newItem['orderNumber'] = this.currentOrderNumber;
                      newItem['orderCases'] = totalOrderCases;
                      newItem['billedCases'] = totalBilledCases;
                      newItem['tonnage'] = totalTonnage;
                      newItem['gap'] = totalGap;
                      newItem['invoiceDateString'] =  this.currentInvoiceDateString;
                      newItem['orderDateString'] = this.currentOrderDateString;
                      allData.push(newItem)
                  }
                  totalItemsinCurrentorder = 1;
                  totalGap = item.gap;
                  totalTonnage = item.tonnage;
                  totalBilledCases = item.billedCases;
                  totalOrderCases = item.orderCases;
                  this.currentOrderNumber = item.orderNumber;
                }
              } else {
                totalOrderCases = totalOrderCases + item.orderCases;
                totalTonnage = totalTonnage + item.tonnage;
                totalBilledCases = totalBilledCases + item.billedCases;
                totalGap = totalGap + item.gap;
                totalItemsinCurrentorder++;
                this.currentOrderNumber = item.orderNumber;
              }

              allData.push(item)
              if (index === (order.data.length -1) && totalItemsinCurrentorder > 1) {
                let newItem = {}
                newItem['productName'] = 'Total';
                newItem['orderNumber'] = this.currentOrderNumber;
                newItem['orderCases'] = totalOrderCases;
                newItem['billedCases'] = totalBilledCases;
                newItem['tonnage'] = totalTonnage;
                newItem['gap'] = totalGap;
                newItem['invoiceDateString'] =  this.formatDate(item.invoiceDate)
                newItem['orderDateString'] = this.formatDate(item.orderDate)
                allData.push(newItem)
              }
            });
          }
        });
      }
      this.list = allData;
      loader.dismiss();
    }, err => {
      console.log(err);
      loader.dismiss();
    })
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad ReportInvoiceAgainstOrderPage');
  }

  searchCustomer (externalId) {
    this.getData(externalId)
  }

  doInfinite (event) {
    console.log(event);
  }

  formatDate (date) {
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

  onOpenPopOver (event) {
    this.widgetUtil.presentPopover(event).then(async data => {
      if (data === 'filterbyorderdate') {
        this.filterOrderDate = true;
        try {
          this.startDate = new Date(await this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
            titleText: 'Start Date',
            maxDate: this.platform.is('android') ? new Date().valueOf() : new Date()
          })).toISOString();
          this.endDate = new Date(await this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
            titleText: 'End Date',
            maxDate: this.platform.is('android') ? new Date().valueOf() : new Date()
          })).toISOString();
          this.getData(this.selectedCustomer);
        } catch (error) {
          console.error(error);
        }
      } else if (data === 'filterbyinvoicedate') {
        this.filterOrderDate = false;
        try {
          this.startDate = new Date(await this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
            titleText: 'Start Date',
            maxDate: this.platform.is('android') ? new Date().valueOf() : new Date()
          })).toISOString();
          this.endDate = new Date(await this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
            titleText: 'End Date',
            maxDate: this.platform.is('android') ? new Date().valueOf() : new Date()
          })).toISOString();
          this.getData(this.selectedCustomer);
        } catch (error) {
          console.error(error);
        }
      } else if (data === 'resetfilter') {
        this.startDate = undefined;
        this.endDate = undefined;
        this.skipValue = 0
        this.limit = 10;
        this.getData(this.selectedCustomer);
      }
    });
  }

  async onCreatePdf (type: string) {
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait while downloading...', 30000);
    setTimeout(() => {
      this.heightOfPDF = 0;
      this.widthOfPDF = 0;
      let textColorPrimary = '#000000';

      const documentDefinition = {
        header: function (currentPage, pageCount, pageSize) {
          return [
            {
              text: `Page ${currentPage} of ${pageCount}`,
              fontSize: 12,
              color: 'grey',
              margin: 20,
              alignment: 'right'
            }
          ]
        },
        pageSize: 'A4',
        content: [
          { text: 'INVOICE AGAINST ORDER', fontSize: 18, bold: true, alignment: 'center', color: '#225f93', decoration: 'underline' },
          {
            canvas: [
              {
                type: 'rect',
                x: 0.5,
                y: 15,
                w: 203,
                h: 90,
                r: 4,
                lineColor: '#D3D3D3',
                color: '#D3D3D3'
              },
              {
                type: 'rect',
                x: 0.5,
                y: 13,
                w: 200,
                h: 87,
                r: 4,
                lineColor: '#D3D3D3',
                color: 'white'
              }
            ]
          },
          { text: `CUSTOMER\'S NAME :`, bold: true, color: textColorPrimary, absolutePosition: { x: 50, y: this.heightOfPDF += 90 }, fontSize: 13 },
          { text: `${this.selectedCustomerName}`, color: 'grey', absolutePosition: { x: 50, y: this.heightOfPDF += 20 }, fontSize: 12 },
          { text: `COUNTRY`, bold: true, color: textColorPrimary, absolutePosition: { x: 50, y: this.heightOfPDF += 20 }, fontSize: 13 },
          { text: ` : ZAMBIA`, color: 'grey', absolutePosition: { x: 120, y: this.heightOfPDF }, fontSize: 12 },
          // { text: `PROVINCE`, bold: true, color: textColorPrimary, absolutePosition: { x: 50, y: this.heightOfPDF += 20 }, fontSize: 13 },
          // { text: ` : ${customer.province}`, color: 'grey', absolutePosition: { x: 120, y: this.heightOfPDF }, fontSize: 12 },
          {
            absolutePosition: { x: 40, y: this.heightOfPDF += 50 },
            // layout: 'lightHorizontalLines', // optional
            table: {
              headerRows: 1,
              widths: [55, 60, 50, 60, 30, '*'],
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

  prepareTable () {
    let headingColor = '#8f1515';
    let textColorSecondary = '#202020';
    const body = []
    body.push(
      [
        { text: 'ORDER_NO', color: headingColor, bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'ORD_CASES', color: headingColor, bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'TONNAGE', color: headingColor, bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'BILL_CASES', color: headingColor, bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'GAP', color: headingColor, bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'NAME', color: headingColor, bold: true, fontSize: 10, margin: [0, 6, 0, 6] }
      ]
    );

    for (let i = 0; i < this.list.length; i++) {
      this.heightOfPDF += 20;
      const row = [
        {
          text: `${this.list[i].orderNumber}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.list[i].orderCases}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.decimalPipe.transform(Number(this.list[i].tonnage), '.5')}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.list[i].billedCases}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
        },
        {
          text: `${this.list[i].gap}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: `${this.list[i].productName ? this.list[i].productName : ''}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        }
      ]
      body.push(row);
    }
    return body;
  }

  downloadPdf (type: string) {
    if (window['cordova']) {
      this.pdfObj.getBuffer(buffer => {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        let binaryArray = utf8.buffer; //
        let storageLocation: any;
        const pdfName = `${this.selectedCustomerName.replace(/[^a-zA-Z ]/g, "")}-${new Date().getFullYear()}-${this.months[new Date().getMonth()]}-${new Date().getDate()}.pdf`;
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
                    this.loaderDownloading.dismiss();
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
                      this.socialSharing.share(`Invoice Againset Order - ${this.selectedCustomerName}`, null, `${storageLocation}${pdfName}`, null).then(result => {
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
                this.loaderDownloading.dismiss();
                const alert = await this.alertCtrl.create({ message: "245" + JSON.stringify(err), buttons: ['Ok'] });
                alert.present();
              });
          })
          .catch(async err => {
            this.loaderDownloading.dismiss();
            const alert = await this.alertCtrl.create({ message: "251" + JSON.stringify(err), buttons: ['Ok'] });
            alert.present();
          });

      });
    } else {
      this.loaderDownloading.dismiss();
      this.pdfObj.open();
    }
  }

  onSharePdf () {
    this.onCreatePdf('share');
  }

}
