import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../providers/services/orders/order.service';
import { WidgetUtilService } from '../../../providers/utils/widget'
import { CONSTANTS } from '../../../providers/utils/constants';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.page.html',
  styleUrls: ['./edit-order.page.scss'],
})
export class EditOrderPage implements OnInit {
  cartItems: any = [];
  orderTotal: any = 0;
  totalTK = 0;
  totalNetWeight = 0;
  showLoader = false;
  showClearCartLoader = false;
  salesmanProfile: any;
  expanded = false;
  orderType: any = 'self';
  salesmanName: any;
  salesmanId: any = 0;
  salesmanCode: any = 0;
  showSalesmanLabel = false;
  customerName: any;
  salesmanData: any = {};
  expandedItemIndex = -1;

  constructor(
    private orderService: OrderService,
    public widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {
    this.showLoader = false
  }

  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.orderTotal = (parseFloat((Math.round(params.orderTotal * 100) / 100).toString()).toFixed(2))
        this.getCartItems()
        this.showSalesman()
      });

    this.storageService.getTkPointsFromStorage().then((res: any) => {
      this.totalTK = res
    })
    this.storageService.getFromStorage('totalNetWeight').then((res: any) => {
      this.totalNetWeight = res
    })
  }


  async showSalesman() {
    let profile = await this.storageService.getFromStorage('profile')
    if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {

      let customerProfile = await this.storageService.getFromStorage('selectedCustomer')
      this.salesmanProfile = profile
      this.salesmanName = this.salesmanProfile['name']
      this.salesmanCode = this.salesmanProfile['externalId'],
        this.showSalesmanLabel = true
      this.customerName = customerProfile['name']
    }
  }

  async getCartItems() {
    this.cartItems = await this.storageService.getCartFromStorage()
    this.cartItems.map((value) => {
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
    })
  }

  doRefresh(refresher): void {
    this.getCartItems()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  async confirmSubmitOrder() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      subHeader: 'Are you sure to place order?',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.submitOrder()
          }
        },
        {
          text: 'Close',
          handler: () => {
            // do nothing
          }
        }
      ]
    });
    await alert.present();
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent)
  }

  async submitOrder() {
    let profile = await this.storageService.getFromStorage('profile')
    let totalTkPoints = await this.storageService.getTkPointsFromStorage()
    let totalNetWeight = await this.storageService.getFromStorage('totalNetWeight')
    this.showLoader = true

    //Replacing the Profile with Selected Customer Profile if userType = SALESMAN
    if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {
      profile = await this.storageService.getFromStorage('selectedCustomer')
    }


    let orderObj = {
      productList: this.cartItems.map((value) => {
        return {
          productId: value['_id'],
          quantity: value['quantity'],
          price: parseFloat(value['price']),
          tkPoint: parseFloat(value['tkPoint']),
          netWeight: parseFloat(value['netWeight']),
          parentCategoryId: value['parentCategoryId'],
          productSysCode: value['productSysCode']
        }
      }),
      userId: profile['_id'],
      salesmanName: this.salesmanName ? this.salesmanName : undefined,
      salesmanCode: this.salesmanCode ? this.salesmanCode : undefined,
      orderId: 'ORD' + Math.floor(Math.random() * 90000) + Math.floor(Math.random() * 90000),
      orderTotal: parseFloat(this.orderTotal.toString()),
      totalNetWeight: parseFloat(totalNetWeight.toString()),
      totalTkPoints: parseFloat(totalTkPoints.toString()),
      status: CONSTANTS.ORDER_STATUS_PROGRESS,
      province: profile['province'],
      lastUpdatedAt: Date.now()
    }

    this.orderService.submitOrder(orderObj).subscribe((result) => {
      this.showLoader = false
      this.storageService.setToStorage('cart', [])
      this.storageService.removeFromStorage('tkpoint')
      this.storageService.setToStorage('totalNetWeight', 0);

      //Removing the key-value after the order has been placed
      this.storageService.removeFromStorage('selectedCustomer')

      this.widgetUtil.presentToast(CONSTANTS.ORDER_PLACED)
      this.router.navigate(['/dashboard/' + profile['userType']]);
    }, (error) => {
      this.showLoader = false
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  async clearCart() {
    await this.storageService.clearCart();
    this.showClearCartLoader = true
    this.totalNetWeight = 0;
    this.orderTotal = 0
    this.totalTK = 0
    this.getCartItems()
    this.showClearCartLoader = false
    this.widgetUtil.presentToast('All items removed from cart')
  }

  removeFromCart(product) {
    this.widgetUtil.presentToast(`${product.name} removed from cart`)
    if (this.cartItems.length > 0) {
      this.cartItems.map((value, index) => {
        if (value['_id'] === product['_id']) {
          this.cartItems.splice(index, 1)
        }
      });
      this.storageService.getTkPointsFromStorage().then(async (tkpoints: any) => {
        let tkpoint = tkpoints - (product.quantity * product.tkPoint);
        this.totalTK = tkpoint;
        await this.storageService.setToStorage('tkpoint', tkpoint);
      });
      this.storageService.setToStorage('cart', this.cartItems);
      this.getCartItems()
      this.calculateTotal();
    }
  }

  updateCart(product) {
    this.cartItems.map((value) => {
      if (value['_id'] === product['_id']) {
        let qty = parseInt(product.quantity);
        value.quantity = qty;
        value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2));
        return (qty)
      }
    });

    this.calculateTotal();
    this.storageService.setToStorage('cart', this.cartItems)
    return (product.quantity)
  }


  async calculateTotal() {
    const obj = this.orderService.calculateTotalNetWeightAndTotalTk(this.cartItems);
    this.totalNetWeight = obj.totalNetWeight;
    this.totalTK = obj.totalTKPoint
    this.orderTotal = obj.orderTotal;

    await this.storageService.setToStorage('orderTotal', this.orderTotal)
    await this.storageService.setToStorage('tkpoint', this.totalTK);
    await this.storageService.setToStorage('totalNetWeight', this.totalNetWeight.toFixed(3))
  }

  expandItem(index: number) {
    this.expanded = !this.expanded;
    this.expandedItemIndex = index;
  }

  openCategoryTotalModal() {

  }

}
