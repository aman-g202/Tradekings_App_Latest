import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';
import { ProfileModel } from '../../../providers/models/profile.model';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { CategoryItemModel } from '../../../providers/models/category.model';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
  providers: [DashboardService]
})

export class AddCategoryPage implements OnInit {
  skipValue = 0;
  limitValue = CONSTANTS.PAGINATION_LIMIT;
  selectedCategoryType = 'parent';
  categoryTypeList = ['parent', 'child'];
  categoryList: CategoryItemModel[];
  showParentList = false;
  allowAddingCategory = false;
  isUserAuthorized = false;
  selectedCategory: CategoryItemModel;
  showLoader = false;
  addCategoryForm: FormGroup;
  hrefTag = '';
  profile: ProfileModel;
  categoryExisting =  false;



  constructor(
    private categoriesService: CategoriesService,
    private widgeService: WidgetUtilService,
    private dashboardService: DashboardService,
    private storageService: StorageServiceProvider) {
    this.getCategoryList();
  }

  async ngOnInit() {
    this.crateAddCategoryForm();
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + this.profile.userType;
    this.isUserAuthorized = await this.dashboardService.isAuthorized();
  }


  async getCategoryList() {
    const loader = await this.widgeService.showLoader('Please wait', 1000);
    this.categoriesService.getParentCategoryList(this.skipValue, this.limitValue).subscribe((res: any) => {
      this.categoryList = res.body;
      this.categoriesService.setParentCat(res.body);
      loader.dismiss();
    }, (error) => {
      loader.dismiss();
      if (error.statusText === 'Unknown Error') {
        this.widgeService.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgeService.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

  onCategoryTypeSelect() {
    if (this.selectedCategoryType != 'parent') {
      if (this.categoryList.length > 0) {
        this.showParentList = true;
        this.allowAddingCategory = true;
      } else {
        this.widgeService.presentToast(CONSTANTS.PARENT_CATEGORY_NOT_FOUND);
        this.selectedCategoryType = 'parent';
        this.showParentList = false;
        this.allowAddingCategory = false;
      }
    } else {
      this.allowAddingCategory = true;
      this.showParentList = false;
    }
  }

  crateAddCategoryForm() {
    this.addCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }


  async addCategory() {
    this.showLoader = true;
    if (this.selectedCategoryType === 'parent') {
      this.categoryExisting = this.categoryList.some(item => item.name === this.addCategoryForm.value.name.trim());

    }
    if (this.categoryExisting) {
        this.showLoader = false;
        this.categoryExisting = false;
        this.widgeService.presentToast('Category Name is already Exist');
      }
     else {
      const categoryDetail = {
        name: this.addCategoryForm.value.name.trim(),
        lastUpdatedAt: Date.now(),
        parentCategoryId: this.selectedCategoryType === this.categoryTypeList[1] ? this.selectedCategory._id : '',
        type: this.selectedCategoryType === this.categoryTypeList[1] ? this.categoryTypeList[1] : this.categoryTypeList[0]
      };
      this.categoriesService.addCategory(categoryDetail).subscribe((result) => {
        this.showLoader = false;
        this.widgeService.presentToast(CONSTANTS.CATEGORY_CREATED);
        this.addCategoryForm.reset();
        this.getCategoryList();
      }, (error) => {
        this.showLoader = false;
        if (error.statusText === 'Unknown Error') {
          this.widgeService.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgeService.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    }
  }

  compareFn(option1: any, option2: any) {
    return option1.name === option2.name;
  }
}
