import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { OrderService } from '../../../providers/services/orders/order.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ProductService } from '../../../providers/services/products/products.service';
import { ProductModel } from '../../../providers/models/product.model';
import { Observable } from 'rxjs';
import { ProfileModel } from '../../../providers/models/profile.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  providers: [OrderService]
})
export class ProductPage implements OnInit {
  skipValue = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  productList: Array<ProductModel> = [];
  productListAvailable = false;
  categoryId = '';
  keyword = '';
  categoryName = '';
  parentCategoryId = '';
  isSearch = false;
  filteredProductList: Array<ProductModel> = [];
  isUserAuthorized = false;
  loggedInUserStore = [];
  storeList = [];
  placeOrder: boolean;
  cartQuantity: any = 0;
  orderTotal: any = 0;
  cartDetail: any = [];
  cart: any = [];
  tkPoint: any = 0;
  isEditOrderFlow = false;
  totalNetWeight = 0;

  constructor(
    private widgetUtil: WidgetUtilService,
    private productService: ProductService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private storageService: StorageServiceProvider,
    private router: Router) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.parentCategoryId = params.parentCategoryId;
      this.categoryId = params.categoryId;
      this.categoryName = params.categoryName;
      this.keyword = params.keyword;
      this.isSearch = params.isSearch;
      this.placeOrder = params.placeOrder;
      this.isEditOrderFlow = params.isEditOrderFlow;
      this.getWareHouseList();
      this.getProductList();
      this.getCartItems();
    });
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent);
  }

  async getProductList() {
    const loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.fetchProducts().subscribe((result) => {
      this.productList = result.body;
      this.productList.map((value) => {
        value.quantity = 1;
        value.price = (parseFloat((Math.round(+value.price * 100) / 100).toString()).toFixed(2));
        value.currentCaseSize = Number(value.currentCaseSize).toFixed(2);
      });
      this.filteredProductList = this.productList;
      this.productListAvailable = true;
      loaderDownloading.dismiss();
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
      this.productListAvailable = true;
      loaderDownloading.dismiss();
    });
  }

  fetchProducts(): Observable<any> {
    let fetchProductObservable$: Observable<any>;
    if (!this.isSearch) {
      fetchProductObservable$ = this.productService.getProductListByCategory(this.categoryId, this.skipValue, this.limit);
    } else {
      fetchProductObservable$ = this.productService
        .searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword);
    }
    return fetchProductObservable$;
  }

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit;
    this.fetchProducts().subscribe((result) => {
      if (result.body.length > 0) {
        result.body.map((value) => {
          this.productList.push(value);
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


  async getCartItems() {
    if (this.isEditOrderFlow) {
      const storedEditedOrder: any = await this.storageService.getFromStorage('order');
      this.cart = storedEditedOrder.productList;
      // update cart count badge when edit order flow is in active state
      this.tkPoint = storedEditedOrder.totalTkPoints ? storedEditedOrder.totalTkPoints : 0;
    } else {
      this.cart = await this.storageService.getCartFromStorage();
      this.tkPoint = await this.storageService.getTkPointsFromStorage();
    }
    if (this.cart.length > 0) {
      let updatedTotal = 0;
      let updatedQuantity = 0;
      this.cart.map((value) => {
        updatedTotal = updatedTotal + (value.price * +value.quantity);
        updatedQuantity = updatedQuantity + +value.quantity;
      });
      this.orderTotal = updatedTotal;
      this.cartQuantity = updatedQuantity;
    } else {
      this.cartQuantity = 0;
      this.orderTotal = 0;
    }
    await this.storageService.setToStorage('orderTotal', this.orderTotal);
  }


  searchProducts(searchQuery) {
    this.filteredProductList = this.productList.filter(item => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    this.productListAvailable = true;
  }


  async addToCart(product: ProductModel, qty: number | string) {
    qty = +qty;
    if (this.isEditOrderFlow) {
      if (qty > 0) {
        const prepareProduct = {
          productId: product._id,
          netWeight: product.netWeight,
          price: product.price,
          productDetail: {
            _id: product._id,
            name: product.name,
            price: product.price,
            productCode: product.productCode
          },
          quantity: product.quantity,
          tkPoint: product.tkPoint,
          parentCategoryId: product.parentCategoryId,
          productSysCode: product.productSysCode
        };
        const order: any = await this.storageService.getFromStorage('order');
        let presentInCart = false;
        const productsInCart = order.productList.map((value) => {
          if (value.productSysCode === product.productSysCode) {
            presentInCart = true;
            value.quantity = value.quantity + +product.quantity;
          }
          return value;
        });
        if (!presentInCart) {
          // tslint:disable-next-line: no-shadowed-variable
          const obj = {};
          Object.assign(obj, prepareProduct);
          // tslint:disable-next-line: no-string-literal
          obj['quantity'] = qty;
          order.productList.push(obj);
          this.cart.push(obj);
        } else {
          order.productList = productsInCart;
        }
        const obj = this.orderService.calculateTotalNetWeightAndTotalTk(order.productList);
        order.totalTkPoints = obj.totalTKPoint;
        order.totalNetWeight = obj.totalNetWeight;
        order.orderTotal = obj.orderTotal;
        //  await this.storageService.setToStorage('tkpoint', obj.totalTKPoint);
        //  await this.storageService.setToStorage('totalNetWeight', obj.totalNetWeight);
        await this.storageService.setToStorage('order', order);
        this.widgetUtil.presentToast(`${product.name} added to cart!`);
      }
    } else {
      if (qty > 0) {
        this.widgetUtil.presentToast(`${product.name} added to cart!`);
        delete product.categoryId;
        delete product.productCode;
        /* product['quantity'] = parseInt(qty) */
        let presentInCart = false;
        const productsInCart = this.cart.map((value) => {
          if (value._id === product._id) {
            presentInCart = true;
            value.quantity = value.quantity + +product.quantity;
          }
          return value;
        });
        if (!presentInCart) {
          // tslint:disable-next-line: no-shadowed-variable
          const obj = {};
          Object.assign(obj, product);
          // tslint:disable-next-line: no-string-literal
          obj['quantity'] = qty;
          this.cart.push(obj);
        } else {
          this.cart = productsInCart;
        }
        const obj = this.orderService.calculateTotalNetWeightAndTotalTk(this.cart);
        // this.tkPoint = obj.totalTKPoint;
        // this.totalNetWeight = obj.totalNetWeight;
        this.storageService.setToStorage('tkpoint', obj.totalTKPoint);
        this.storageService.setToStorage('totalNetWeight', obj.totalNetWeight);
        this.storageService.setToStorage('orderTotal', obj.orderTotal);
        this.cartDetail = await this.storageService.setToStorage('cart', this.cart);
        // this.orderTotal = obj.orderTotal;
        // this.cartQuantity = obj.totalQuantity;

        this.storageService.setToStorage('cart', this.cart);
      } else {
        this.widgetUtil.presentToast(`Atleast 1 quantity is required!`);
      }
    }
  }


  reviewAndSubmitOrder() {
    if (this.cart.length <= 0) {
      this.widgetUtil.presentToast(CONSTANTS.CART_EMPTY);
    } else {
      this.router.navigate(['/orders/edit-order'], { queryParams: { isEditOrderFlow: this.isEditOrderFlow } });
    }
  }


  resetQty(product: ProductModel) {
    product.quantity = '';
  }


  setQty(product: ProductModel) {
    product.quantity = product.quantity && product.quantity !== '' ? product.quantity : 1;
  }


  decrementQty(qty: string | number) {
    qty = +qty;
    if (qty > 1) {
      return qty - 1;
    }
    return qty;
  }


  incrementQty(qty: string | number) {
    return +qty + 1;
  }


  async getWareHouseList() {
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.isUserAuthorized = profile.isAuthorized;
    if (profile.associatedStore && profile.associatedStore.length) {
      this.loggedInUserStore = profile.associatedStore;
    }
  }

  editProduct(product){
    this.router.navigate(['../', 'edit-product'], {queryParams: product, relativeTo: this.route});
  }
}
