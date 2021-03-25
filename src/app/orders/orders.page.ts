import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CONSTANTS } from '../../providers/utils/constants';
import { StorageServiceProvider } from '../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../providers/utils/widget';
import { OrderService } from '../../providers/services/orders/order.service';
import { OrderItemModel } from '../../providers/models/order.model';
import { ProfileModel } from '../../providers/models/profile.model';
import { AlertController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import * as json2Csv from 'json2csv';




@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orderList: OrderItemModel[] = [];
  orderListAvailable = false;
  skipValue = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  userId = '';
  userName = '';
  userType = '';
  hrefTag = '';
  loaderDownloading: any;
  profile: ProfileModel;
  endPoint: any;
  isSalesman = false;
  smCustomer: ProfileModel;
  toggleValue = false;
  showToggleBtn = false;
  showSpnr = false;
  isAdmin = false;
  showLoader = false;


  constructor(
    private storageService: StorageServiceProvider,
    private orderService: OrderService,
    private widgetUtil: WidgetUtilService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private file: File
  ) { }

  async ngOnInit() {
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.smCustomer = await this.storageService.getFromStorage('selectedCustomer') as ProfileModel;
    if (this.profile.userType === 'ADMIN' || this.profile.userType === 'ADMINHO') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
      if (this.profile.userType === 'SALESMAN' || this.profile.userType === 'SALESMANAGER') {
        if (this.smCustomer) {
          this.showToggleBtn = true;
        }
      }
    }
    this.getUserOrderList();
  }


  async getUserOrderList() {
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 15000);
    const skip = 0;
    const limit = 20;
    this.userType = this.profile.userType;
    this.userName = this.profile.name;
    if (this.userType === 'ADMINHO') {
      this.endPoint = this.orderService.getAllOrderList(skip, limit);
    } else if (this.userType === 'ADMIN') {
      this.endPoint = this.orderService.getOrderListByProvince(this.profile.province, skip, limit);
    } else if (this.userType === 'SALESMAN' || this.userType === 'SALESMANAGER') {
      if (this.smCustomer && this.toggleValue === true) {
        this.endPoint = this.orderService.getOrderListByUser
          (this.smCustomer._id, skip, limit, this.isSalesman, this.smCustomer.externalId);
      } else {
        this.endPoint = this.orderService.getOrderListBySalesman(this.profile.externalId, skip, limit);
      }
    } else {
      this.endPoint = this.orderService.getOrderListByUser
        (this.profile._id, this.skipValue, this.limit, this.isSalesman, this.profile.externalId);
    }
    this.hrefTag = '/dashboard/' + this.userType;
    this.endPoint.subscribe((result) => {
      this.orderList = result.body;
      this.orderList.map((value) => {
        value.orderTotal = parseFloat((Math.round(+value.orderTotal * 100) / 100).toString()).toFixed(2);
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt);
      });
      this.orderListAvailable = true;
      this.loaderDownloading.dismiss();
    }, (error) => {
      console.log('Order List page could not load', error);
      this.orderListAvailable = true;
      this.loaderDownloading.dismiss();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }



  async doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit;
    if (this.userType === 'ADMINHO') {
      this.endPoint = this.orderService.getAllOrderList(this.skipValue, this.limit);
    } else if (this.userType === 'ADMIN') {
      this.endPoint = this.orderService.getOrderListByProvince(this.profile.province, this.skipValue, this.limit);
    } else if (this.userType === 'SALESMAN' || this.userType === 'SALESMANAGER') {
      if (this.smCustomer && this.toggleValue === true) {
        this.endPoint = this.orderService.getOrderListByUser
          (this.smCustomer._id, this.skipValue, this.limit, this.isSalesman, this.smCustomer.externalId);
      } else {
        this.endPoint = this.orderService.getOrderListBySalesman(this.profile.externalId, this.skipValue, this.limit);
      }
    } else {
      this.endPoint = this.orderService.getOrderListByUser
        (this.profile._id, this.skipValue, this.limit, this.isSalesman, this.profile.externalId);
    }
    this.endPoint.subscribe((result) => {
      if (result.body.length > 0) {
        result.body.map((value) => {
          value.orderTotal = parseFloat((Math.round(+value.orderTotal * 100) / 100).toString()).toFixed(2);
          value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt);
          this.orderList.push(value);
        });
      } else {
        this.skipValue = this.limit;
      }
      infiniteScroll.target.complete();
    }, (error) => {
      infiniteScroll.target.complete();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }



  async filterOrderToExport() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Select Order Status',
      inputs: [
        {
          name: 'Recived1',
          type: 'checkbox',
          label: 'Recived',
          value: 'recieved',
          checked: true
        },

        {
          name: 'Cancel',
          type: 'checkbox',
          label: 'Cancel',
          value: 'cancel',
          checked: true
        },

        {
          name: 'In-Progress',
          type: 'checkbox',
          label: 'In-Progress',
          value: 'in-progress',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          role: 'ok',
          handler: (data) => {
            this.exportToCsv(data);
          }
        }
      ]
    });
    await alert.present();
  }


  importOrder(order) {
    this.showLoader = true;
    this.orderService.createOrderToErp(order._id).subscribe(result => {
      this.getUserOrderList();
      this.widgetUtil.presentToast(CONSTANTS.ORDER_IMPORTED);
      this.showLoader = false;
    }, (error) => {
      console.error('Order List page could not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
      this.showLoader = false;
    });
  }


  exportToCsv(selectedStatus) {
    const csvList = [];
    this.orderList.forEach((value) => {
      if (selectedStatus.indexOf(value.status) >= 0) {
        value.productList.forEach((product, index) => {
          let lineItem: any = {};
          if (index === 0) {
            lineItem = {
              OrderId: value.orderId,
              OrderDate: this.formatDate(value.lastUpdatedAt),
              CustomerName: value.userDetail.name,
              CustomerCode: value.userDetail.externalId,
              'Country(Province)': value.userDetail.country + '(' + value.userDetail.province + ')',
              OrderTotal: (parseFloat((value.orderTotal).toString()).toFixed(2))
            };
          } else {
            lineItem = {
              OrderId: '*',
              OrderDate: '*',
              CustomerName: '*',
              CustomerCode: '*',
              'Country(Province)': '*',
              OrderTotal: '*'
            };
          }
          lineItem.Price = (parseFloat((product.price).toString()).toFixed(2));
          lineItem.Quantity = product.quantity;
          lineItem.SubTotal = (parseFloat((Math.round((parseFloat(product.price) *
            parseInt(product.quantity, 2) * 100) / 100)).toString()).toFixed(2));
          lineItem.ProductName = product.productDetail.name;
          lineItem.ProductCode = product.productDetail.productCode;
          lineItem.ProductSysCode = product.productDetail.productSysCode;
          csvList.push(lineItem);
        });
      }
    });
    const fields = ['OrderId', 'OrderDate', 'CustomerName', 'CustomerCode', 'Country(Province)', 'ProductName', 'ProductCode', 'ProductSysCode', 'Price', 'Quantity', 'SubTotal', 'OrderTotal'];
    const opts = { fields };
    // tslint:disable-next-line: prefer-const
    let Json2csvParser = json2Csv.Parser;
    const parser = new Json2csvParser(opts);
    const csv = parser.parse(csvList);
    const fileName = 'TKO-' + this.getDateForCSV() + '.csv';
    if ((window['cordova'])) {
      this.file.writeFile(this.file.externalRootDirectory, fileName, csv)
        .then(() => {
          this.widgetUtil.presentToast(CONSTANTS.CSV_DOWNLOADED + '! FileName: ' + fileName);
        }).catch(err => {
          this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv).then(() => {
            this.widgetUtil.presentToast(CONSTANTS.CSV_DOWNLOADED + '! FileName: ' + fileName);
          }).catch(error => {
            this.widgetUtil.presentToast(CONSTANTS.CSV_DOWNLOAD_FAIL + error);
          });
        });
    } else {
      const blob = new Blob([csv]);
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }



  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }


  getDateForCSV() {
    // tslint:disable-next-line: one-variable-per-declaration
    const csvD = new Date(),
      csvDformat = [csvD.getMonth() + 1,
      csvD.getDate(),
      csvD.getFullYear()].join('-') + '-' +
        [csvD.getHours(),
        csvD.getMinutes(),
        csvD.getSeconds()].join('-');
    return csvDformat;
  }

  getOrderDetial(order) {
    const orderObj = {
      order: JSON.stringify(order)
    };
    this.router.navigate(['order-detail'], { queryParams: orderObj, relativeTo: this.route });
  }

  customerOrderList(event) {
    this.toggleValue = event.target.checked;
    if (this.toggleValue === true) {
      this.getUserOrderList();
    } else {
      this.getUserOrderList();
    }
  }
}
