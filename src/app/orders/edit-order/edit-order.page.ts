import { GenericService } from './../../../providers/services/generic/generic.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../../providers/services/orders/order.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CategoryTotalModalPage } from '../../shared/category-total-modal/category-total-modal.page';
import { ProfileModel } from '../../../providers/models/profile.model';


@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.page.html',
  styleUrls: ['./edit-order.page.scss'],
  providers: [GenericService]
})
export class EditOrderPage implements OnInit {
  hrefTag = '';
  cartItems: any = [];
  orderTotal: any = 0;
  totalTK = 0;
  totalNetWeight = 0;
  showLoader = false;
  showClearCartLoader = false;
  expanded = false;
  salesmanName = '';
  salesmanCode = '';
  showSalesmanLabel = false;
  customerName = '';
  expandedItemIndex = -1;
  isEditOrderFlow = false;
  profile: ProfileModel;
  customerId = '';
  customerProvince = '';
  orderDetails: any = {};

  constructor(
    private orderService: OrderService,
    public widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // this.orderTotal = (parseFloat((Math.round(params.orderTotal * 100) / 100).toString()).toFixed(2));
      this.isEditOrderFlow = params.isEditOrderFlow;
      this.checkUserType();
      this.getCartItems();
    });
  }


  async checkUserType() {
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    if (!this.isEditOrderFlow) {
      if ((this.profile.userType === 'SALESMAN') || (this.profile.userType === 'SALESMANAGER')) {
        const selectedCust: ProfileModel = await this.storageService.getFromStorage('selectedCustomer') as ProfileModel;
        if (selectedCust) {
          this.customerId = selectedCust._id;
          this.customerProvince = selectedCust.province;
          this.customerName = selectedCust.name;
        }
        this.salesmanName = this.profile.name;
        this.salesmanCode = this.profile.externalId;
        this.showSalesmanLabel = true;
      } else {
        this.customerId = this.profile._id;
        this.customerProvince = this.profile.province;
        this.customerName = this.profile.name;
      }
    }
  }

  async geTkPointAndNetWeight() {
    await this.storageService.getTkPointsFromStorage().then((res: any) => {
      this.totalTK = res;
    });
    await this.storageService.getFromStorage('totalNetWeight').then((res: any) => {
      this.totalNetWeight = res;
    });
    await this.storageService.getFromStorage('orderTotal').then((res: any) => {
      this.orderTotal = res;
    });
  }


  async getCartItems() {
    if (this.isEditOrderFlow) {
      this.orderDetails = await this.storageService.getFromStorage('order');
      this.orderTotal = this.orderDetails.orderTotal;
      this.totalNetWeight = this.orderDetails.totalNetWeight;
      this.cartItems = this.orderDetails.productList;
      this.customerName = this.orderDetails.userDetail.name;
    }
    else {
      this.cartItems = await this.storageService.getCartFromStorage();
      this.geTkPointAndNetWeight();
    }
    this.cartItems.map((value) => {
      value.updatedQty = value.quantity;
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2));
      value.subTotal = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2));
    });
  }


  async confirmSubmitOrder() {
    const confirm = await this.widgetUtil.showConfirm('Confirmation', 'Are you sure to place order?', 'Okay', 'Cancel');
    if (confirm === 'Okay') {
      this.submitOrder();
    }
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent);
  }

  async submitOrder() {
    this.showLoader = true;
    if (!this.isEditOrderFlow) {
      const orderObj = {
        productList: this.cartItems.map((value) => {
          return {
            productId: value._id,
            quantity: value.quantity,
            price: parseFloat(value.price),
            tkPoint: parseFloat(value.tkPoint),
            netWeight: parseFloat(value.netWeight),
            parentCategoryId: value.parentCategoryId,
            productSysCode: value.productSysCode
          };
        }),
        userId: this.customerId,
        salesmanName: this.salesmanName ? this.salesmanName : undefined,
        salesmanCode: this.salesmanCode ? this.salesmanCode : undefined,
        orderId: 'ORD' + Math.floor(Math.random() * 90000) + Math.floor(Math.random() * 90000),
        orderTotal: parseFloat(this.orderTotal.toString()),
        totalNetWeight: parseFloat(this.totalNetWeight.toString()),
        totalTkPoints: parseFloat(this.totalTK.toString()),
        status: CONSTANTS.ORDER_STATUS_PROGRESS,
        province: this.customerProvince,
        lastUpdatedAt: Date.now()
      };
      this.orderService.submitOrder(orderObj).subscribe((result) => {
        this.showLoader = false;
        this.storageService.setToStorage('cart', []);
        this.storageService.removeFromStorage('tkpoint');
        this.storageService.setToStorage('totalNetWeight', 0);
        this.storageService.setToStorage('orderTotal', 0);
        // Removing the key-value after the order has been placed
        this.storageService.removeFromStorage('selectedCustomer');
        this.widgetUtil.presentToast(CONSTANTS.ORDER_PLACED);
        this.router.navigate(['/dashboard/' + this.profile.userType], { queryParams: { timeStamp: new Date().getTime() } });
      }, (error) => {

        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    } else {
      const editOrder: any = await this.storageService.getFromStorage('order');
      editOrder.lastUpdatedAt = Date.now();
      editOrder.productList.map((value) => {
        delete value.updatedQty;
      });
      this.orderService.createEditOrderToErp(editOrder).subscribe(async (result) => {
        this.showLoader = false;
        await this.storageService.removeFromStorage('order');
        this.storageService.removeFromStorage('selectedCustomer');
        this.widgetUtil.presentToast(CONSTANTS.ORDER_PLACED);
        this.router.navigate(['/dashboard/' + this.profile.userType], { queryParams: { timeStamp: new Date().getTime() } });
      }, (error: any) => {
        console.error('Error getting when place edited order', error);
        this.showLoader = false;
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    }
  }


  async clearCart() {
    await this.storageService.clearCart();
    this.showClearCartLoader = true;
    this.totalNetWeight = 0;
    this.orderTotal = 0;
    this.totalTK = 0;
    this.getCartItems();
    this.showClearCartLoader = false;
    this.widgetUtil.presentToast('All items removed from cart');
  }


  async removeFromCart(product) {
    if (this.cartItems.length > 0) {
      this.cartItems.map((value, index) => {
          if (this.isEditOrderFlow ? value.productId === product.productId : value._id === product._id) {
            this.cartItems.splice(index, 1);
          }
      });
      if (this.isEditOrderFlow) {
        this.orderDetails.productList = this.cartItems;
        const temp = this.orderService.calculateTotalNetWeightAndTotalTk(this.cartItems);
        this.orderDetails.totalTkPoints = temp.totalTKPoint;
        this.orderDetails.totalNetWeight = temp.totalNetWeight;
        this.orderDetails.orderTotal = temp.orderTotal;
        this.totalNetWeight = temp.totalNetWeight;
        this.orderTotal = temp.orderTotal;
        await this.storageService.setToStorage('order', this.orderDetails);
      }
      else {
        this.storageService.getTkPointsFromStorage().then(async (tkpoints: any) => {
          this.totalTK = tkpoints - (product.quantity * product.tkPoint);
          await this.storageService.setToStorage('tkpoint', this.totalTK);
          await this.storageService.setToStorage('cart', this.cartItems);
        });
        this.calculateTotal();
        // this.getCartItems();
        this.widgetUtil.presentToast(`${product.name} removed from cart`);
      }
    }
  }

  async updateCart(product) {
    this.cartItems.map((value) => {
      if ( this.isEditOrderFlow ? value.productId === product.productId : value._id === product._id) {
        // tslint:disable-next-line: radix
        const qty = parseInt(product.quantity);
        value.quantity = qty;
        value.updatedQty = qty;
        value.subTotal = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2));
        return (qty);
      }
    });
    if (this.isEditOrderFlow) {
      const temp = this.orderService.calculateTotalNetWeightAndTotalTk(this.cartItems);
      this.orderDetails.totalTkPoints = temp.totalTKPoint;
      this.orderDetails.totalNetWeight = temp.totalNetWeight;
      this.orderDetails.productList = this.cartItems;
      this.orderDetails.orderTotal = temp.orderTotal;
      this.orderTotal = temp.orderTotal;
      this.totalNetWeight = temp.totalNetWeight;
      await this.storageService.setToStorage('order', this.orderDetails);
      return (product.quantity);
    }
    // this.cartItems =  this.cartItems.filter(({updatedQty}) => updatedQty = !updatedQty);
    this.calculateTotal();
    this.storageService.setToStorage('cart', this.cartItems);
    return (product.quantity);
  }


  async calculateTotal() {
    const obj = this.orderService.calculateTotalNetWeightAndTotalTk(this.cartItems);
    this.totalNetWeight = obj.totalNetWeight;
    this.totalTK = obj.totalTKPoint;
    this.orderTotal = obj.orderTotal;
    await this.storageService.setToStorage('orderTotal', this.orderTotal);
    await this.storageService.setToStorage('tkpoint', this.totalTK);
    await this.storageService.setToStorage('totalNetWeight', this.totalNetWeight.toFixed(3));
  }

  async expandItem(index: number) {
    this.expanded = !this.expanded;
    this.expandedItemIndex = index;
  }

  // expandItem (event: any) {
  //   if (event.target.parentElement && event.target.parentElement.nextElementSibling) {
  //     event.target.parentElement.classList.toggle('expand')
  //     event.target.parentElement.nextElementSibling.classList.toggle('expand-wrapper')
  //   }
  // }

  async openCategoryTotalModal() {
    const openCategoryModal = await this.modalController.
      create({ component: CategoryTotalModalPage, componentProps: { cartItems: this.cartItems } });
    openCategoryModal.present();
  }

  addNewItem() {
    this.router.navigate(['/shop'], { queryParams: { placeOrder: true, isEditOrderFlow: this.isEditOrderFlow } });
  }

  moveToSMHome() {
    this.router.navigate(['/dashboard/' + this.profile.userType]);
  }
}
