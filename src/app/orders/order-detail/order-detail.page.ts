import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../providers/services/orders/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { ProductModel } from '../../../providers/models/product.model';
import { OrderItemModel } from '../../../providers/models/order.model';
import { ProfileModel } from '../../../providers/models/profile.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  orderItems: ProductModel[] = [];
  orderDetail: OrderItemModel;
  showImportOrder = false;
  showLoader = false;
  showCsvButton = false;
  showCancelOrder = false;
  orderItemsAvailable = false;
  loaderDownloading: any;
  profile: ProfileModel;
  userType = '';
  isEditOrderFlow = true;

  constructor(
    private storageService: StorageServiceProvider,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private widgetUtil: WidgetUtilService
  ) {}

  ngOnInit() {
    this.checkData();
    const order = this.route.snapshot.queryParamMap.get('order');
    // convert Json object into javaObj
    this.orderDetail = JSON.parse(order);
    this.orderItems = this.orderDetail.productList;
    this.orderItems.map((value) => {
      value.subTotal = parseFloat(
        (
          Math.round(
            Number(value.quantity) * parseFloat(value.price.toString()) * 100
          ) / 100
        ).toString()
      ).toFixed(2);
      value.price = parseFloat(
        (Math.round(Number(value.price) * 100) / 100).toString()
      ).toFixed(2);
    });
    this.orderItemsAvailable = true;
    this.showImportOrder = false;
    this.showCsvButton = false;
    this.showCancelOrder = false;
  }

  async checkData() {
    this.profile = (await this.storageService.getFromStorage(
      'profile'
    )) as ProfileModel;
    this.userType = this.profile.userType;
    /* if(!(window['cordova']) && (this.userType === 'admin')) {
      this.showCsvButton = true
    }else{
      this.showCsvButton = false
    } */
    if (
      this.userType === 'ADMIN' &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL
    ) {
      this.showImportOrder = true;
    } else {
      this.showImportOrder = false;
    }
    if (
      this.userType === 'CUSTOMER' &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED &&
      this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL
    ) {
      this.showCancelOrder = true;
    } else {
      this.showCancelOrder = false;
    }
  }

  importOrder() {
    this.changeOrderStatus(
      CONSTANTS.ORDER_STATUS_RECEIVED,
      CONSTANTS.ORDER_IMPORTED
    );
  }

  cancelOrder() {
    this.changeOrderStatus(
      CONSTANTS.ORDER_STATUS_CANCEL,
      CONSTANTS.ORDER_CANCELLED
    );
  }

  changeOrderStatus(newStatus, message) {
    this.loaderDownloading = this.widgetUtil.showLoader('Please wait...', 2000);
    this.orderService
      .changeOrderStatus(this.orderDetail._id, { status: newStatus })
      .subscribe(
        (result) => {
          this.getOrderDetail();
          this.widgetUtil.presentToast(message);
        },
        (error) => {
          if (error.statusText === 'Unknown Error') {
            this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
          } else {
            this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
          }
          this.loaderDownloading.dismiss();
        }
      );
  }

  getOrderDetail() {
    this.orderService.getOrderDetail(this.orderDetail._id).subscribe(
      (result) => {
        this.orderDetail = result.body[0];
        this.checkData();
      },
      (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
        this.checkData();
      }
    );
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
    const existCart = [];
    this.orderItems.forEach((item) => {
      existCart.push(
        item.name = item.productDetail.name
      );
    });
    this.storageService.setToStorage('existCart' , this.orderItems);
    const orderObj = {
      orderTotal: this.orderDetail.orderTotal,
      isEditOrderFlow: this.isEditOrderFlow
    };
    this.router.navigate(['../', 'edit-order'], {
      queryParams: orderObj,
      relativeTo: this.route,
    });
  }
}
