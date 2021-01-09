import { ProfileModel } from 'src/providers/models/profile.model';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../providers/services/orders/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  orderItems: any = [];
  orderDetail: any = {};
  showImportOrder = false;
  showLoader = false;
  showCsvButton = false;
  showCancelOrder = false;
  orderItemsAvailable = false;
  csvData: any[] = [];
  loaderDownloading: any;
  headerRow: any[] = [];
  profile: ProfileModel;


  constructor(
    private storageService: StorageServiceProvider,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private widgetUtil: WidgetUtilService
  ) { }

  ngOnInit() {
    this.checkData();
    this.route.queryParams.subscribe((params) => {
      let orderObj = params.order;
      // convert Json object into javaObj
      this.orderDetail = JSON.parse(orderObj);
    });
    this.orderItems = this.orderDetail.productList;
    this.orderItems.map((value) => {
      value['subTotal'] = parseFloat(
        (
          Math.round(
            value.quantity * parseFloat(value.price.toString()) * 100
          ) / 100
        ).toString()
      ).toFixed(2);
      value['price'] = parseFloat(
        (Math.round(value.price * 100) / 100).toString()
      ).toFixed(2);
    });
    this.orderItemsAvailable = true;
    this.showImportOrder = false;
    this.showCsvButton = false;
    this.showCancelOrder = false;
  }

  async checkData() {
    let profile = await this.storageService.getFromStorage('profile');
    /* if(!(window['cordova']) && (profile['userType'] === 'admin')) {
      this.showCsvButton = true
    }else{
      this.showCsvButton = false
    } */
    if (
      profile['userType'] === 'ADMIN' &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL
    ) {
      this.showImportOrder = true;
    } else {
      this.showImportOrder = false;
    }
    if (
      profile['userType'] === 'CUSTOMER' &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL
    ) {
      this.showCancelOrder = true;
    } else {
      this.showCancelOrder = false;
    }
  }


  importOrder() {
    this.changeOrderStatus(CONSTANTS.ORDER_STATUS_RECEIVED, CONSTANTS.ORDER_IMPORTED);
  }

  cancelOrder() {
    this.changeOrderStatus(CONSTANTS.ORDER_STATUS_CANCEL, CONSTANTS.ORDER_CANCELLED);
  }

  changeOrderStatus(newStatus, message) {
    this.loaderDownloading = this.widgetUtil.showLoader('Please wait...', 2000);
    this.orderService.changeOrderStatus(this.orderDetail['_id'], { status: newStatus }).subscribe((result) => {
      this.getOrderDetail();
      this.widgetUtil.presentToast(message);
      this.loaderDownloading = this.widgetUtil.showLoader('Please wait...', 2000);
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
      this.loaderDownloading.dismiss();
    });
  }

  getOrderDetail() {
    this.orderService.getOrderDetail(this.orderDetail['_id']).subscribe((result) => {
      this.orderDetail = result.body[0];
      this.checkData();
      this.loaderDownloading.dismiss();
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
      this.loaderDownloading.dismiss();
      this.checkData();
    });
  }

  doRefresh(refresher): void {
    setTimeout(() => {
      refresher.target.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      infiniteScroll.target.complete();
    }, 500);
  }

  eidtOrder() {
    const orderObj = {
      orderTotal: this.orderDetail.orderTotal
    };
    this.router.navigate(['../', 'edit-order'], { queryParams: orderObj, relativeTo: this.route });
  }
}
