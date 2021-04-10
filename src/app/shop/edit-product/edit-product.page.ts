import { ProductService } from './../../../providers/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '../../../providers/models/product.model';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  hrefTag = '';
  editProductForm: FormGroup;
  tkPoint = 0;
  productDetail: ProductModel;
  showLoader: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private widgetUtil: WidgetUtilService,
    private productService: ProductService
  ) { }

   ngOnInit() {
      this.productDetail = this.route.snapshot.queryParams as ProductModel;
      this.createProductForm();
      this.hrefTag = `shop/product`;
  }

  createProductForm() {
    const tkPoints = this.productDetail.tkPoint ? this.productDetail.tkPoint : 0;
    this.editProductForm = this.formBuilder.group({
      name: [this.productDetail.name, Validators.required],
      price: [this.productDetail.price, Validators.required],
      productCode: [this.productDetail.productCode, Validators.required],
      productSysCode: [this.productDetail.productSysCode, Validators.required],
      tkPoint: [tkPoints, Validators.required]
    });
  }

  updateProduct() {
    const updateDetail: any = {};
    const formValue = this.editProductForm.value;
    updateDetail.productId = this.productDetail._id;
    updateDetail.name = formValue.name.trim();
    updateDetail.price = parseFloat(formValue.price);
    updateDetail.productCode = formValue.productCode.trim();
    updateDetail.productSysCode = formValue.productSysCode.trim();
    updateDetail.lastUpdatedAt = Date.now();
    updateDetail.tkPoint = parseFloat(formValue.tkPoint);
    this.showLoader = true;
    this.productService.updateProduct(updateDetail).subscribe((result) => {
      this.widgetUtil.presentToast(CONSTANTS.PRODUCT_UPDATED);
      this.showLoader = false;
    }, (error) => {
      console.error('Error getting when product edited', error)
      this.showLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }
}
