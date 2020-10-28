import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { CategoryItemModel } from '../../../providers/models/category.model';
import { ProfileModel } from 'src/providers/models/profile.model';

@Component({
  selector: 'app-parent-category',
  templateUrl: './parent-category.page.html',
  styleUrls: ['./parent-category.page.scss'],
})
export class ParentCategoryPage implements OnInit {
  hrefTag = '';
  parentCategoryList: Array<CategoryItemModel> = [];
  categoryListAvailable = false;
  skipValue = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  loaderDownloading: any;
  cart: any = []
  tkPoint: any = 0
  placeOrder: boolean;

  constructor(
    private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,
    private router: Router,
    private storageService: StorageServiceProvider,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getList();
    this.getCartItems();
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.placeOrder = params.placeOrder
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.getList()
    });
  }

  getChildCategory(category: CategoryItemModel) {
    const categoryObj = {
      parentCategoryId: category._id,
      categoryName: category.name
      placeOrder: this.placeOrder
    }
    this.router.navigate(['../', 'child-category'], { queryParams: categoryObj, relativeTo: this.activatedRoute });
  }

  async getList() {
    const profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + profile.userType;
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.categoryService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
      this.parentCategoryList = result.body;
      this.categoryListAvailable = true;
      this.loaderDownloading.dismiss();
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
      this.categoryListAvailable = true;
      this.loaderDownloading.dismiss();
    });
  }

  doRefresh(refresher): void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit;
    this.categoryService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
      if (result.body.length > 0) {
        result.body.map((value) => {
          this.parentCategoryList.push(value);
        });
      } else {
        this.skipValue = this.limit;
      }
      infiniteScroll.complete();
    }, (error) => {
      infiniteScroll.complete();
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
      let orderTotal = await this.storageService.getFromStorage('orderTotal')
      this.router.navigate(['/submit-order'] , {queryParams: {'orderTotal': orderTotal}}); 
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
