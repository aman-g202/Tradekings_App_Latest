import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoryItemModel } from '../../../providers/models/category.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parent-category',
  templateUrl: './parent-category.page.html',
  styleUrls: ['./parent-category.page.scss'],
})
export class ParentCategoryPage implements OnInit {
  hrefTag = 'capture-price/capture-details';
  parentCategoryList: CategoryItemModel[] = [];
  skip = 0;
  limit = CONSTANTS.PAGINATION_LIMIT;
  categoryListAvailable = false;

  constructor(
    private categoryService: CategoriesService,
    private widgetUtil: WidgetUtilService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getParentCategory();
  }

  async getParentCategory() {
    const showLoader = await this.widgetUtil.showLoader('Please wait..', 2000);
    const parentCatList: CategoryItemModel[] = this.categoryService.getParentCat();
    if (parentCatList.length > 0) {
      showLoader.dismiss();
      this.parentCategoryList = parentCatList;
      this.categoryListAvailable = true;
    } else {
      this.categoryService.getParentCategoryList(this.skip, this.limit).subscribe((res: any) => {
        showLoader.dismiss();
        this.parentCategoryList = res.body;
        this.categoryListAvailable = true;
      }, (error: any) => {
        console.error('Price Capturing Parent Category page could not load', error);
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    }

  }

  navigateChildCatPage(category) {
    const categoryObj = {
      parentCategoryId: category._id,
      categoryName: category.name,
    };
    this.router.navigate(['../', 'child-category'], { queryParams: categoryObj, relativeTo: this.route });
  }

  doInfinite(infiniteScroll) {
    this.skip = this.skip + this.limit;
    this.categoryService.getParentCategoryList(this.skip, this.limit).subscribe((res: any) => {
      if (res.body.length > 0) {
        res.body.map((value) => {
          const checkExistCat = this.parentCategoryList.some(cat => cat._id === value._id);
          if (!checkExistCat) {
            this.parentCategoryList.push(value);
          }
        });
      } else {
        this.skip = this.limit;
      }
      infiniteScroll.target.complete();
    }, (error: any) => {
      console.error('Price Capturing Parent Category Page Could not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

}
