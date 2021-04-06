import { Component, OnInit } from '@angular/core';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from '../../../providers/utils/constants';
import { CategoryItemModel } from '../../../providers/models/category.model';

@Component({
  selector: 'app-child-category',
  templateUrl: './child-category.page.html',
  styleUrls: ['./child-category.page.scss'],
})
export class ChildCategoryPage implements OnInit {
  parentCatId: string;
  parentCatName = '';
  childCatList: CategoryItemModel[] = [];
  hrefTag = 'capture-price/parent-category';
  skip = 0;
  limit = CONSTANTS.PAGINATION_LIMIT;
  categoryListAvailable = false;

  constructor(
    private widgetUtil: WidgetUtilService,
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const parentCatObj: any = this.route.snapshot.queryParams;
    this.parentCatId = parentCatObj.parentCategoryId;
    this.parentCatName = parentCatObj.categoryName;
    this.getChildCat();
  }


  async getChildCat() {
    const showLoder = await this.widgetUtil.showLoader('Please wait..', 2000);
    this.categoryService.getChildCategoryList(this.parentCatId, this.skip, this.limit).subscribe((res: any) => {
      showLoder.dismiss();
      this.childCatList = res.body;
      this.categoryListAvailable = true;
    }, (error: any) => {
      showLoder.dismiss();
      console.error('Price Capturing Child Category page not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }


  navigateUnitSizeProductPage(category) {
    const productObj = {
      childCategoryName: category.name,
      parentCategoryName: this.parentCatName
    };
    this.router.navigate(['../', 'unit-size'], { queryParams: productObj, relativeTo: this.route });
  }


  doInfinite(infiniteScroll) {
    this.skip = this.skip + this.limit;
    this.categoryService.getParentCategoryList(this.skip, this.limit).subscribe((res: any) => {
      if (res.body.length > 0) {
        res.body.map((value) => {
          this.childCatList.push(value);
        });
      } else {
        this.skip = this.limit;
      }
      infiniteScroll.target.complete();
    }, (error: any) => {
      console.error('Price Capturing Child Category Page Could not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }
}
