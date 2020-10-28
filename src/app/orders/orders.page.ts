import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../../providers/utils/constants';
import { StorageServiceProvider } from '../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../providers/utils/widget';
import { OrderService } from '../../providers/services/orders/order.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orderList: any = []
  orderListAvailable: Boolean = false
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  userId: string = ''
  userName: string = ''
  userType: string = ''
  loaderDownloading: any;

  constructor(private storageService: StorageServiceProvider,
    private orderService: OrderService,
    private widgetUtil: WidgetUtilService,
    private router: Router) { }

  ngOnInit() {
    this.getUserOrderList()
  }

  async getUserOrderList () {
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    const profile = await this.storageService.getFromStorage('profile')
    this.userId = profile['userType'] === 'SALESMAN' ? profile['externalId'] : profile['_id']
    this.userName = profile['name']
    this.userType = profile['userType']
    const isSalesman = ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) ? true : false
    this.orderService.getOrderListByUser(this.userId, this.skipValue, this.limit, isSalesman, profile['externalId']).subscribe((result) => {
      this.orderList = result.body
      this.orderList.map((value) => {
        value.orderTotal = parseFloat((Math.round(value.orderTotal * 100) / 100).toString()).toFixed(2)
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt)
      })
      this.orderListAvailable = true
      this.loaderDownloading.dismiss();
    }, (error) => {
      this.orderListAvailable = true
      console.log('error', error)
      this.loaderDownloading.dismiss();
    })
  }

  presentPopover (myEvent) {
    this.widgetUtil.presentPopover(myEvent)
  }

  async doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    const profile = await this.storageService.getFromStorage('profile')
    const isSalesman = ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) ? true : false
    this.orderService.getOrderListByUser(this.userId, this.skipValue, this.limit, isSalesman, profile['externalId']).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.orderList.push(value)
        })
      } else {
        this.skipValue = this.limit
      }
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  formatDate (date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    return [year, month, day].join('-')
  }

  getOrderDetial (order) {
    let orderObj = {
      order: order
    }
    this.router.navigate(['/order-detail'] , {queryParams: orderObj});
  }

  // List All orders here

}
