import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { CategoryItemModel } from '../../../providers/models/category.model';

@Component({
  selector: 'app-child-category',
  templateUrl: './child-category.page.html',
  styleUrls: ['./child-category.page.scss'],
})
export class ChildCategoryPage implements OnInit {
 
  cart: any = []
  placeOrder: boolean;
  tkPoint: any = 0
  parentCategoryId = '';
  categoryListAvailable = false;
  childCategoryList: Array<CategoryItemModel> = [];
  skipValue = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  searchQuery = '';
  categoryName = '';

  constructor(
    private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageServiceProvider) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.parentCategoryId = params.parentCategoryId
      this.categoryName = params.categoryName
      this.categoryListAvailable = false
      this.placeOrder = params.placeOrder
      this.childCategoryList = []
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.getList()
      this.getCartItems();
    }); 
  }

  async getList() {
    const loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.categoryService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      this.childCategoryList = result.body;
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

  getProducts(category: CategoryItemModel) {
    const categoryObj = {
      parentCategoryId: category.parentCategoryId,
      categoryId: category._id,
      categoryName: category.name,
      placeOrder: this.placeOrder
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
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

  presentPopover (myEvent) {
    this.widgetUtil.presentPopover(myEvent)
  }

  async reviewAndSubmitOrder () {
    if (this.cart.length <= 0) {
      this.widgetUtil.presentToast(CONSTANTS.CART_EMPTY)
    }else {
      const orderTotal = await this.storageService.getFromStorage('orderTotal')
      this.router.navigate(['/submit-order'] , {queryParams: {orderTotal}}); 
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

   submitSearch (ev: any) {
    if (this.searchQuery && this.searchQuery.trim() != '') {
      const profile = await this.storageService.getFromStorage('profile')
      const data = {
        keyword: this.searchQuery,
        parentCategoryId: this.parentCategoryId,
        isSearch: true,
        categoryName: this.categoryName,
        placeOrder: this.placeOrder
      };
      this.searchQuery  = ''
      if(profile['type'] === 'admin') {
        this.router.navigate(['../', 'product'], { queryParams: data, relativeTo: this.route });
      } else{
        this.router.navigate(['../', 'product'], { queryParams: data, relativeTo: this.route });
      }
    }
  }

  async getCartItems () {
    const storedEditedOrder: any = await this.storageService.getFromStorage('order')
    // update cart count badge when edit order flow is in active state
    if (storedEditedOrder) {
      this.cart = storedEditedOrder.productList ? storedEditedOrder.productList : []
      this.tkPoint = storedEditedOrder.totalTkPoints ? storedEditedOrder.totalTkPoints : 0
    } else {
      this.cart = await this.storageService.getCartFromStorage()
      this.storageService.getTkPointsFromStorage().then(res => {
        this.tkPoint = res
      })
    }
   }
}
