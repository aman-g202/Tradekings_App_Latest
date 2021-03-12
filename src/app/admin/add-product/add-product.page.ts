import { CategoryItemModel } from './../../../providers/models/category.model';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardPage } from '../../shared/dashboard/dashboard.page';
import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';
import { ProfileModel } from '../../../providers/models/profile.model';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ProductService } from '../../../providers/services/products/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  providers: [CategoriesService, DashboardService, ProductService]
})

export class AddProductPage implements OnInit {
  childCategoriesList: CategoryItemModel;
  showLoader = false;
  addProductForm: FormGroup;
  categoryListAvailable = false;
  selectedCategory: CategoryItemModel;
  priceTypeList: Array<any> = ['Standard Price'];
  selectedPriceType = 'Standard Price';
  isUserAuthorized = false;
  hrefTag = '';

  constructor(
    private categoryService: CategoriesService,
    private widgetUtil: WidgetUtilService,
    private dashboardService: DashboardService,
    private storageService: StorageServiceProvider,
    private productService: ProductService
  ) { this.getChildCategoryList(); }

  async ngOnInit() {
    this.createAddProductForm();
    this.isUserAuthorized = await this.dashboardService.isAuthorized();
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + profile.userType;
  }

  async getChildCategoryList() {
    const loader = await this.widgetUtil.showLoader('Please wait', 2000);
    this.categoryService.getChildCategoryForAddProduct().subscribe((res: any) => {
      loader.dismiss();
      this.childCategoriesList = res.body;
      this.selectedCategory = res.body[0];
    }, (error) => {
      loader.dismiss();
      if (error === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }


  createAddProductForm() {
    this.addProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      productSysCode: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      packType: new FormControl('', [Validators.required]),
      currentCaseSize: new FormControl('', [Validators.required])
    });
  }

  addProduct() {
    this.showLoader = true;
    if (this.addProductForm.invalid) {
      this.widgetUtil.presentToast('Invalid Inputs, Kindly enter all fields with valid data');
      return;
    }
    const formValue = this.addProductForm.value;
    const productDetail = {
      name: formValue.name.trim(),
      price: parseFloat(formValue.price.toString().trim()),
      productCode: formValue.productCode.trim(),
      priceType: this.selectedPriceType.trim(),
      packType: formValue.packType.trim(),
      productSysCode: formValue.productSysCode.trim(),
      currentCaseSize: formValue.currentCaseSize.toString().trim(),
      categoryId: this.selectedCategory._id,
      parentCategoryId: this.selectedCategory.parentCategoryId,
      lastUpdatedAt: Date.now()
    };
    this.productService.addProduct(productDetail).subscribe((result) => {
      this.showLoader = false;
      this.addProductForm.reset();
      this.widgetUtil.presentToast(CONSTANTS.PRODUCT_CREATED);
    }, (error) => {
      this.showLoader = false;
      console.error('error:', error);
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
