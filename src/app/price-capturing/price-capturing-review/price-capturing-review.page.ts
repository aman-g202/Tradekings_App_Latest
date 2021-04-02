import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-price-capturing-review',
  templateUrl: './price-capturing-review.page.html',
  styleUrls: ['./price-capturing-review.page.scss'],
})
export class PriceCapturingReviewPage implements OnInit {
  captureData: any = [];
  rrpLable = '';

  constructor(
    private navParam: NavParams,
    private modalCtrl: ModalController) { }

  async ngOnInit() {
    const captureDataDetails = await this.navParam.data;
    this.captureData = captureDataDetails.capturedProducts;
    this.rrpLable = captureDataDetails.reportType === 'price_capturing' ? 'RRP' : 'STOCK';
  }

 async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
