import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  productList: Array<any> = [];
  productListAvailable: Boolean = false
  categoryId: string = ''
  keyword: string = ''
  categoryName: string = ''
  parentCategoryId: string = ''
  isSearch: Boolean = false
  filteredProductList: Array<any> = [];
  isUserAuthorized = false;
  loggedInUserStore = []
  storeList = []

  constructor(private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.parentCategoryId = params.parentCategoryId
      this.categoryId = params.categoryId;
      this.categoryName = params.categoryName
      this.keyword = params.keyword
      this.isSearch = params.isSearch
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.getProductList()
    });
  }

  async getProductList () {
    let loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    if(!this.isSearch) {
      this.categoryService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
          value.currentCaseSize=Number(value.currentCaseSize).toFixed(2);
        })
        this.filteredProductList = this.productList
        this.productListAvailable = true
        loaderDownloading.dismiss()
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
        }
        this.productListAvailable = true
        loaderDownloading.dismiss()
      })
    } else {
      this.categoryService.searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
        })
        this.filteredProductList = this.productList
        this.productListAvailable = true
        loaderDownloading.dismiss()
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
        }
        this.productListAvailable = true
        loaderDownloading.dismiss()
      })
    }
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.categoryService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.productList.push(value)
        })
      } else {
        this.skipValue = this.limit
      }
    }, (error) => {
      infiniteScroll.complete();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  searchProducts (searchQuery) {
    this.filteredProductList = this.productList.filter(item => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
  }

}
