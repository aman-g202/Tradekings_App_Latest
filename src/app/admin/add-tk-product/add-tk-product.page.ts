import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { CONSTANTS } from '../../../providers/utils/constants';
import { CategoryItemModel } from '../../../providers/models/category.model';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ProfileModel } from '../../../providers/models/profile.model';


@Component({
  selector: 'app-add-tk-product',
  templateUrl: './add-tk-product.page.html',
  styleUrls: ['./add-tk-product.page.scss'],
  providers: [DashboardService, CategoriesService]
})
export class AddTKProductPage implements OnInit {
  hrefTag = '';
  parentCategoryList: CategoryItemModel[];
  childCategoryList: CategoryItemModel[];
  profile: ProfileModel;
  parentExternalId: string;
  context: string;
  masterCode: string;
  addTkProductForm: FormGroup;
  skip = 0;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  showLoader = false;
  isAuthorized  = false;


  constructor(
    private categoryService: CategoriesService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private dashboardService: DashboardService
  ) {}

 async ngOnInit() {
    this.getParentCatetoryList();
    this.createTkProductForm();
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + this.profile.userType;
    this.isAuthorized = await this.dashboardService.isAuthorized();
      }



  async getParentCatetoryList() {
    const showLoader = await this.widgetUtil.showLoader('Product Category Fetching..', 2000);
    this.categoryService.getParentCategoryList(this.skip, this.limit).subscribe((res: any) => {
      showLoader.dismiss();
      this.parentCategoryList = res.body;
    }, (error: any) => {
      showLoader.dismiss();
      console.log('error', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
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
      console.log('error', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
     } else {
        this.widgetUtil.presentPopover(CONSTANTS.SERVER_ERROR);
      }
    });
  }
  }

  createTkProductForm() {
    this.addTkProductForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      masterName: new FormControl('', [Validators.required]),
      caseSize: new FormControl('', [Validators.required]),
      masterCode: new FormControl('', [Validators.required]),
      productCat: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      subCat: new FormControl('', [Validators.required]),
      unitSize: new FormControl('', [Validators.required])
    });
  }


  addTkProduct() {
    this.showLoader = true;
    const formValue: any = this.addTkProductForm.value;
    const tkProduct = {
      categoryName: formValue.productCat.name.trim(),
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
        isTkProduct: 'Y',
        competitiveProduct: []
      }
    };
    this.categoryService.addTkProduct(tkProduct).subscribe((result) => {
      this.showLoader = false;
      this.widgetUtil.presentToast(CONSTANTS.TK_PRODUCT_CREATED);
      this.addTkProductForm.reset();
    }, (error: any) => {
      console.error('error', error);
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
