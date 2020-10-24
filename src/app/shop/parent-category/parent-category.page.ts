import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-parent-category',
  templateUrl: './parent-category.page.html',
  styleUrls: ['./parent-category.page.scss'],
})
export class ParentCategoryPage implements OnInit {
  hrefTag: string = ''
  parentCategoryList: Array<any> = [];
  categoryListAvailable: Boolean = false
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  loaderDownloading: any;

  constructor(private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,private router: Router, private storageService: StorageServiceProvider) { }

  ngOnInit() {
    this.getList();
  }

  getChildCategory (category) {
    const categoryObj = {
      'parentCategoryId' : category['_id'],
      'categoryName': category.name
    }
    this.router.navigate(['/child-category'] , {queryParams: categoryObj});
    console.log("==============categoryObj", categoryObj)
  }

  async getList () {
    const profile = await this.storageService.getFromStorage('profile')
    this.hrefTag = '/dashboard/' + profile['userType'];
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    this.categoryService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
      this.parentCategoryList = result.body
      this.categoryListAvailable = true
      this.loaderDownloading.dismiss();
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
      this.categoryListAvailable = true
      this.loaderDownloading.dismiss();
    })
  }

  doRefresh (refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.categoryService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.parentCategoryList.push(value)
        }) 
      } else {
        this.skipValue = this.limit
      }
      infiniteScroll.complete();
    }, (error) => {
      infiniteScroll.complete();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

}
