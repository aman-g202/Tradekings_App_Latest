import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../providers/services/products/products.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalController, NavController } from '@ionic/angular';
import { PriceCapturingReviewPage } from '../price-capturing-review/price-capturing-review.page';
import { ProfileModel } from '../../../providers/models/profile.model';


@Component({
  selector: 'app-price-capturing-product-list',
  templateUrl: './price-capturing-product-list.page.html',
  styleUrls: ['./price-capturing-product-list.page.scss'],
  providers: [ProductService, DatePipe]
})
export class PriceCapturingProductListPage implements OnInit {
  @ViewChild('form') priceCaptureForm: NgForm;
  unitSize = '';
  hrefTag = 'capture-price/unit-size';
  parentCatName = '';
  childCatName = '';
  priceCaptureProduct: any = [];
  reportTypeLable = '';
  productListAvailable = false;
  customerInfo: any = {};
  loader: any;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private datePipe: DatePipe,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    this.customerInfo = await this.storageService.getFromStorage('customerInfo');
    this.reportTypeLable = this.customerInfo.reportType === 'price_capturing' ? 'RRP' : 'STOCK';
    const paramsData = this.route.snapshot.queryParams;
    this.unitSize = paramsData.unitSize;
    this.parentCatName = paramsData.parentCategoryName;
    this.childCatName = paramsData.childCategoryName;
    this.getCaptureProduct();
    this.prepareData();
  }

  async getCaptureProduct() {
    const showLoader = await this.widgetUtil.showLoader('Please wait..', 3000);
    this.productService.getCaptureProductList(this.unitSize, this.parentCatName, this.childCatName).subscribe((res: any) => {
      showLoader.dismiss();
      this.priceCaptureProduct = res.body;
      this.productListAvailable = true;
    }, (error: any) => {
      showLoader.dismiss();
      if (error.textStatus === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }


  async prepareData() {
    let valA: any;
    let valB: any;
    for (let i = 0; i < this.priceCaptureProduct.length; i++) {
      valA = this.priceCaptureForm.value[`${i}A`];
      valB = this.priceCaptureForm.value[`${i}B`];
      this.priceCaptureProduct[i].MSQ = valA === `` || typeof valA === 'undefined' ? 0 : valA;
      this.priceCaptureProduct[i].RRP = valB === `` || typeof valB === 'undefined' ? 0 : valB;
    }
    const obj = {
      date: this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
      customerInfo: this.customerInfo,
      reportType: this.customerInfo.reportType,
      channel: this.customerInfo.channel,
      capturedBy: await this.storageService.getFromStorage('profile') as ProfileModel,
      capturedProducts: this.priceCaptureProduct,
      parentCategoryName: this.parentCatName,
      childCategoryName: this.childCatName,
      unitSize: this.unitSize,
      priceType: this.customerInfo.priceType
    };
    return obj;
  }


  async uploadData() {
    this.loader = true;
    const captureData = await this.prepareData();
    this.productService.captureProduct(captureData).subscribe((resutl: any) => {
      this.loader = false;
      this.widgetUtil.presentToast('Data uploaded successfully');
      this.navCtrl.navigateBack('capture-price/parent-category');
    }, (error: any) => {
      this.loader = false;
      console.error(error);
      this.widgetUtil.presentToast('Error while uploading capturing....');
    });
  }



  async openReviewModal() {
    const catureData = await this.prepareData();
    const openModal = await this.modalCtrl.create({
      component: PriceCapturingReviewPage,
      componentProps: catureData
    });
    return  await openModal.present();
  }
}
