import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CONSTANTS } from '../../providers/utils/constants';
import { StorageServiceProvider } from '../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../providers/utils/widget';
import { OrderService } from '../../providers/services/orders/order.service';
import { OrderItemModel } from '../../providers/models/order.model';
import { ProfileModel } from '../../providers/models/profile.model';


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

  constructor(
    private storageService: StorageServiceProvider,
    private orderService: OrderService,
    private widgetUtil: WidgetUtilService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.getUserOrderList();
  }

  async getUserOrderList() {
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.userId = this.profile.userType === 'SALESMAN' ? this.profile.externalId : this.profile._id;
    this.userName = this.profile.name;
    this.userType = this.profile.userType;
    this.hrefTag = '/dashboard/' + this.userType;
    const isSalesman = ((this.profile.userType === 'SALESMAN') || (this.profile.userType === 'SALESMANAGER')) ? true : false;
    this.orderService.getOrderListByUser(this.userId, this.skipValue, this.limit, isSalesman, this.profile.externalId)
      .subscribe((result) => {
        this.orderList = result.body;
        this.orderList.map((value) => {
          value.orderTotal = parseFloat((Math.round(+value.orderTotal * 100) / 100).toString()).toFixed(2);
          value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt);
        });
        this.orderListAvailable = true;
        this.loaderDownloading.dismiss();
      }, (error) => {
        this.orderListAvailable = true;
        console.log('error', error);
        this.loaderDownloading.dismiss();
      });
  }

  async doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit;
    const isSalesman = ((this.profile.userType === 'SALESMAN') || (this.profile.userType === 'SALESMANAGER')) ? true : false;
    this.orderService.getOrderListByUser(this.userId, this.skipValue, this.limit, isSalesman, this.profile.externalId)
      .subscribe((result) => {
        if (result.body.length > 0) {
          result.body.map((value) => {
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

  getOrderDetial(order) {
    const orderObj = {
      order: JSON.stringify(order)
    }
    this.router.navigate(['order-detail'], { queryParams: orderObj, relativeTo: this.route });
  }
}
