import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../providers/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../../../providers/services/categories/categories.service';
import { WidgetUtilService } from '../../../../providers/utils/widget';
import { DashboardService } from '../../../../providers/services/dashboard/dashboard.service';
import { CategoryItemModel } from '../../../../providers/models/category.model';
import { ProfileModel } from '../../../../providers/models/profile.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../../../../providers/utils/constants';

@Component({
  selector: 'app-comp-product',
  templateUrl: './comp-product.page.html',
  styleUrls: ['./comp-product.page.scss'],
  providers: [ProductService, DashboardService]

})
export class CompProductPage implements OnInit {
  hrefTag = `admin/add-comp-product/tklist`;
  parentCategoryList: CategoryItemModel[];
  childCategoryList: CategoryItemModel[];
  profile: ProfileModel;
  parentExternalId: string;
  masterCode: string;
  addCompProductForm: FormGroup;
  skip = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  showLoader = false;
  isAuthorized = false;
  title = '';

  constructor(
    private routes: ActivatedRoute,
    private categoryService: CategoriesService,
    private widgetUtil: WidgetUtilService,
    private dashboardService: DashboardService,
    private productService: ProductService) { }

  async ngOnInit() {
    const tkProductDetails = this.routes.snapshot.queryParams;
    this.title = tkProductDetails.title;
    this.masterCode = tkProductDetails.masterCode;
    this.getParentCatetoryList();
    this.createCompProductForm();
    this.isAuthorized = await this.dashboardService.isAuthorized();
  }


  async getParentCatetoryList() {
    const showLoader = await this.widgetUtil.showLoader('Product Category Fetching..', 2000);
    const categoriesList = this.categoryService.getParentCat();
    if (categoriesList.length > 0) {
      this.parentCategoryList = categoriesList;
      showLoader.dismiss();
    } else {
      this.categoryService.getParentCategoryList(this.skip, this.limit).subscribe((res: any) => {
        showLoader.dismiss();
        this.parentCategoryList = res.body;
      }, (error: any) => {
        showLoader.dismiss();
        console.error(' Add Comp product page could not load', error);
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    }

  }


  async getChildCategoryListById(parentCatId) {
    if (parentCatId.detail.value._id !== undefined) {
      const showLoader = await this.widgetUtil.showLoader('Child Category Fetching..', 2000);
      this.parentExternalId = parentCatId.detail.value._id;
      this.categoryService.getChildCategoryList(this.parentExternalId, this.skip, this.limit).subscribe((res: any) => {
        showLoader.dismiss();
        this.childCategoryList = res.body;
      }, (error: any) => {
        showLoader.dismiss();
        console.error('Add Comp product page could not load', error);
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentPopover(CONSTANTS.SERVER_ERROR);
        }
      });
    }
  }

  createCompProductForm() {
    this.addCompProductForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      masterName: new FormControl('', [Validators.required]),
      caseSize: new FormControl('', [Validators.required]),
      masterCode: new FormControl(this.masterCode, [Validators.required]),
      productCat: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      subCat: new FormControl('', [Validators.required]),
      unitSize: new FormControl('', [Validators.required])
    });
  }


  addCompProduct() {
    this.showLoader = true;
    const formValue: any = this.addCompProductForm.value;
    const tkProduct = {
      categoryName: formValue.productCat.name.trim(),
      masterCode: formValue.masterCode.trim(),
      product: {
        brand: formValue.brand.trim(),
        masterName: formValue.masterName.trim(),
        caseSize: formValue.caseSize.toString().trim(),
        masterCode: formValue.masterCode.trim(),
        productCategory: formValue.productCat.name.trim(),
        productCode: formValue.productCode.trim(),
        productName: formValue.productName.trim(),
        subCategory: formValue.subCat.name.trim(),
        unitSize: formValue.unitSize.trim(),
        isTkProduct: 'N'
      }
    };
    this.productService.addCompProduct(tkProduct).subscribe((result) => {
      this.showLoader = false;
      this.widgetUtil.presentToast(CONSTANTS.COMP_PRODUCT_CREATED);
      this.addCompProductForm.reset();
    }, (error: any) => {
      console.error('Add Comp product page could not load', error);
      this.showLoader = false;
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else if (error.error.message === CONSTANTS.UNIQUE_PRODUCT_CODE) {
        this.widgetUtil.presentToast(CONSTANTS.UNIQUE_PRODUCT_CODE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }
}
