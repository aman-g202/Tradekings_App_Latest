import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-child-category',
  templateUrl: './child-category.page.html',
  styleUrls: ['./child-category.page.scss'],
})
export class ChildCategoryPage implements OnInit {
  parentCategoryId: string = ''
  categoryListAvailable: Boolean = false
  childCategoryList: Array<any> = []
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  searchQuery: string = ''  
  categoryName: string = ''

  constructor(private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.parentCategoryId = params.parentCategoryId
      this.categoryName = params.categoryName
      this.categoryListAvailable = false
      this.childCategoryList = []
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.getList()
    });
  }

  async getList () {
    let loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.categoryService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      this.childCategoryList = result.body
      this.categoryListAvailable = true
      loaderDownloading.dismiss()
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
      loaderDownloading.dismiss()
      this.categoryListAvailable = true
    })
  }

  async getProducts (category) {
    const categoryObj = {
      'parentCategoryId': category.parentCategoryId,
      'categoryId' : category._id,
      'categoryName': category.name
    }
    this.router.navigate(['/product'] , {queryParams: categoryObj});
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.categoryService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.childCategoryList.push(value)
        })
      }else {
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

  doRefresh (refresher) : void {
    this.getList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getItems (ev: any) {
    let val = ev.target.value
    this.searchQuery = val
    if (ev.type === "mousedown"){
    }
  }

  async submitSearch (ev: any) {
    if (this.searchQuery && this.searchQuery.trim() != '') {
      let data = {
        'keyword': this.searchQuery,
        'parentCategoryId': this.parentCategoryId,
        'isSearch': true,
        'categoryName': this.categoryName
      };
      this.searchQuery  = ''
      this.router.navigate(['/product'] , {queryParams: data});
    }
  }

}
