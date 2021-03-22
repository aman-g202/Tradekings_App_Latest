import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../providers/models/product.model';
import { ProductService } from '../../../../providers/services/products/products.service';
import { WidgetUtilService } from '../../../../providers/utils/widget';
import { CONSTANTS } from '../../../../providers/utils/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageServiceProvider } from '../../../../providers/services/storage/storage.service';
import { ProfileModel } from '../../../../providers/models/profile.model';


@Component({
  selector: 'app-tk-products',
  templateUrl: './tk-products.page.html',
  styleUrls: ['./tk-products.page.scss'],
  providers: [ProductService, StorageServiceProvider]
})

export class TkProductsPage implements OnInit {
  hrefTag = '';
  tkProductList: ProductModel[];
  tkProductListAvailable = true;
  filteredList: ProductModel[];


  constructor(
    private productService: ProductService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private router: Router,
    private routes: ActivatedRoute) { }

  async ngOnInit() {
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + profile.userType;
    this.getTkProduct();
  }

  async getTkProduct() {
    const showLoader = await this.widgetUtil.showLoader('Data Fetching..', 2000);
    this.productService.getTkProduct().subscribe((res: any) => {
      showLoader.dismiss();
      this.tkProductList = res.body;
      this.filteredList = this.tkProductList;
      if (this.filteredList.length > 0) {
        this.tkProductListAvailable = true;
      } else {
        this.tkProductListAvailable = false;
      }
    }, (error: any) => {
      showLoader.dismiss();
      console.error('TK Product list page could not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

  searchProducts(searchkey) {
    this.filteredList = this.tkProductList.filter(product => product.productName.toLowerCase().includes(searchkey.toLowerCase()));
    if (this.filteredList.length > 0) {
      this.tkProductListAvailable = true;
    } else {
      this.tkProductListAvailable = false;
    }
  }

  navigateAddCompProduct(product) {
    this.router.navigate(['..', 'comp-product'], {
      queryParams: {
        masterCode: product.masterCode,
        title: product.productName,
      }, relativeTo: this.routes
    });
  }
}
