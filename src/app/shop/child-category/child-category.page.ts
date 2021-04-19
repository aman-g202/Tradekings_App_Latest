import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { CategoryItemModel } from '../../../providers/models/category.model';
import { ProfileModel } from 'src/providers/models/profile.model';

@Component({
  selector: 'app-child-category',
  templateUrl: './child-category.page.html',
  styleUrls: ['./child-category.page.scss'],
})
export class ChildCategoryPage implements OnInit {
  cart: any = [];
  placeOrder: boolean;
  tkPoint: any = 0;
  parentCategoryId = '';
  categoryListAvailable = false;
  childCategoryList: Array<CategoryItemModel> = [];
  skipValue = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  searchQuery = '';
  categoryName = '';
  isEditOrderFlow = false;

  constructor(
    private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageServiceProvider) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.isEditOrderFlow = params.isEditOrderFlow;
        this.parentCategoryId = params.parentCategoryId;
        this.categoryName = params.categoryName;
        this.placeOrder = params.placeOrder;
        this.skipValue = 0;
        this.limit = CONSTANTS.PAGINATION_LIMIT;
        this.getCartItems();
      });
      this.getList();
  }


  async getList() {
    const loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.categoryService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      this.childCategoryList = result.body;
      console.log(this.childCategoryList)
      this.categoryListAvailable = true;
      loaderDownloading.dismiss();
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
      loaderDownloading.dismiss();
      this.categoryListAvailable = true;
    });
  }

  navigateProductsPage(category: CategoryItemModel) {
    const categoryObj = {
      parentCategoryId: category.parentCategoryId,
      categoryId: category._id,
      categoryName: category.name,
      placeOrder: this.placeOrder,
      isEditOrderFlow: this.isEditOrderFlow
    };
    this.router.navigate(['../', 'product'], { queryParams: categoryObj, relativeTo: this.route });
  }

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit;
    this.categoryService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      if (result.body.length > 0) {
        result.body.map((value) => {
          this.childCategoryList.push(value);
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

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent);
  }

  async reviewAndSubmitOrder() {
    if (this.cart.length <= 0) {
      this.widgetUtil.presentToast(CONSTANTS.CART_EMPTY);
    } else {
      const orderTotal = await this.storageService.getFromStorage('orderTotal');
      this.router.navigate(['/orders/edit-order'], { queryParams: { orderTotal , isEditOrderFlow: this.isEditOrderFlow } });
    }
  }

  doRefresh(refresher): void {
    this.getList();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getItems(ev: any) {
    const val = ev.target.value;
    this.searchQuery = val;
    if (ev.type === 'mousedown') {
    }
  }

  async submitSearch(ev: any) {
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const profile = await this.storageService.getFromStorage('profile') as ProfileModel;
      const data = {
        keyword: this.searchQuery,
        parentCategoryId: this.parentCategoryId,
        isSearch: true,
        categoryName: this.categoryName,
        placeOrder: this.placeOrder,
      };
      this.searchQuery = '';
      if (profile.userType === 'ADMIN') {
        this.router.navigate(['../', 'product'], { queryParams: data, relativeTo: this.route });
      } else {
        this.router.navigate(['../', 'product'], { queryParams: data, relativeTo: this.route });
      }
    }
  }

  async getCartItems() {
    // update cart count badge when edit order flow is in active state
    if (this.isEditOrderFlow) {
      const storedEditedOrder: any = await this.storageService.getFromStorage('order');
      this.cart = storedEditedOrder.productList ? storedEditedOrder.productList : [];
     // this.tkPoint = storedEditedOrder.totalTkPoints ? storedEditedOrder.totalTkPoints : 0;
    } else {
      this.cart = await this.storageService.getCartFromStorage();
     // this.tkPoint = await this.storageService.getTkPointsFromStorage();
    }
  }
}
