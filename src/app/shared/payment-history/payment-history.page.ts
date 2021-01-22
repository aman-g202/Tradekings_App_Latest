import { Component, OnInit } from '@angular/core';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { PaymentService } from '../../../providers/services/payment/payment.service ';
import { ProfileModel } from '../../../providers/models/profile.model';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
  providers: [PaymentService, DatePipe]
})
export class PaymentHistoryPage implements OnInit {
  modeIsCash = false;
  modeIsOnline = false;
  modeIsCheque = false;
  paymentMode: string ;
  data = [];
  paymentHistoryAvailable = false;
  downloadingLoader: any;
  profile: ProfileModel;


  constructor(
    private paymentService: PaymentService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private datePipe: DatePipe,

  ) { }

  ngOnInit() {
    this.getData();
  }
  async getData() {
    this.downloadingLoader = await this.widgetUtil.showLoader('Please wait ....', 2000);
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    if ((this.profile.userType === 'SALESMAN') || (this.profile.userType === 'SALESMANAGER')) {
      this.profile = await this.storageService.getFromStorage('selectedCustomer') as ProfileModel;
    }
    this.paymentService.getPaymentHistory(this.profile.externalId).subscribe((res: any) => {
      if (res && res.body) {
        this.data = res.body;
        if (this.data.length > 0) {
          this.data.forEach(item => {
            item.lastUpdatedAt = this.datePipe.transform(item.lastUpdatedAt, 'dd/MM/yyyy');
          });
        }
        this.widgetUtil.presentToast('Data Fetched Successfully...');
        this.paymentHistoryAvailable = true;
      } else {
        this.widgetUtil.presentToast('Problem while fetching data');
        this.paymentHistoryAvailable = true;
      }
      this.downloadingLoader.dismiss();
    });
    if (this.paymentMode === 'cash') {
      this.modeIsCash = true;
    }
    else {
      if (this.paymentMode === 'online'){
        this.modeIsOnline = true;
      }
      else{
        this.modeIsCheque = true;
      }
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      infiniteScroll.target.complete();
    }, 500);
  }
}
