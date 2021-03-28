import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../providers/services/products/products.service';
import { ProductModel } from '../../../providers/models/product.model';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';


@Component({
  selector: 'app-unit-size-list',
  templateUrl: './unit-size-list.page.html',
  styleUrls: ['./unit-size-list.page.scss'],
  providers: [ProductService]
})
export class UnitSizeListPage implements OnInit {
  hrefTag = 'capture-price/child-category';
  childCatName = '';
  childCatId = '';
  parentCatName = '';
  unitSizeList: ProductModel[] = [];
  unitSizeListAvailable = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private widgetUnit: WidgetUtilService
  ) { }

  ngOnInit() {
    const paramsData = this.route.snapshot.queryParams;
    this.childCatName = paramsData.childCategoryName;
    this.parentCatName = paramsData.parentCategoryName;
    this.getUnitSize();
  }


  async getUnitSize() {
    const showLoader = await this.widgetUnit.showLoader('Please wait..', 2000);
    this.productService.getProductByUnitSize(this.parentCatName, this.childCatName).subscribe((res: any) => {
      showLoader.dismiss();
      this.unitSizeList = res.body;
      this.unitSizeListAvailable = true;
    }, (error: any) => {
      showLoader.dismiss();
      console.error('Price Capture Unit size page not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUnit.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUnit.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }


  getProduct(unitSize) {
    const productObj = {
      unitSize,
      parentCategoryName: this.parentCatName,
      childCategoryName: this.childCatId
    };
    this.router.navigate(['../', 'product-list'], { queryParams: productObj, relativeTo: this.route });
  }

}
