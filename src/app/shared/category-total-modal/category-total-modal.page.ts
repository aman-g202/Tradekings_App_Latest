import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { GenericService } from '../../../providers/services/generic/generic.service';

@Component({
  selector: 'app-category-total-modal',
  templateUrl: './category-total-modal.page.html',
  styleUrls: ['./category-total-modal.page.scss'],
  providers: [GenericService, CategoriesService]
})
export class CategoryTotalModalPage implements OnInit {
  cartItems: any = {};
  skipValue = 0;
  limit = 1000;
  categoryListAvailable = false;
  parentCategoryList: Array<any> = [];
  downloadingLoader: any;

  constructor(private navParms: NavParams,
              private categoriesService: CategoriesService,
              private widgetUtil: WidgetUtilService,
              private genericService: GenericService,
              private modalController: ModalController,
              ) {}

  ngOnInit() {
    if (this.navParms.data && this.navParms.data.cartItems) {
      this.cartItems = this.navParms.data.cartItems;
    }
    this.getParentCategoryList();
  }


 async getParentCategoryList() {
    /** REFACTORED PART */
    this.downloadingLoader = await this.widgetUtil.showLoader('please wait....', 2000);
    this.genericService.getParentCategories();
    const parentCategoryList = this.genericService.parentCategories;
    if (parentCategoryList.length) {
      this.parentCategoryList = parentCategoryList;
      this.parentCategoryList.map(obj => {
        obj.subTotal = 0;
      });
      this.calculateTotal();
      this.downloadingLoader.dismiss();
      this.categoryListAvailable = true;

    } else {
      this.categoriesService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
        this.parentCategoryList = result.body;
        this.calculateTotal();
        this.downloadingLoader.dismiss();
        this.categoryListAvailable = true;
      }, (error) => {
        if (error.statusText === 'Unknown Error') {

          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
        this.downloadingLoader.dismiss();
        this.categoryListAvailable = true;
      });
    }
  }

  calculateTotal() {
    this.cartItems.map(cartItem => {
      this.parentCategoryList.map(parentCategoryObj => {
        if (cartItem.parentCategoryId === parentCategoryObj._id) {
          if ((parentCategoryObj.subTotal) && (parseFloat(parentCategoryObj.subTotal) > 0)) {
            parentCategoryObj.subTotal = (parseFloat(parentCategoryObj.subTotal)) + (parseFloat(cartItem.subTotal));
          } else {
            parentCategoryObj.subTotal = (parseFloat(cartItem.subTotal));
          }
        }
      });
    });
    this.parentCategoryList.map(parentCategoryObj => {
      if ((parentCategoryObj.subTotal) && (parseFloat(parentCategoryObj.subTotal) > 0)) {
        parentCategoryObj.subTotal = parseFloat((Math.round(parentCategoryObj.subTotal * 100) / 100).toString()).toFixed(2);
      } else {
        parentCategoryObj.subTotal = 0;
      }
    });
  }

 closeModal(){
   this.modalController.dismiss();
 }
}
