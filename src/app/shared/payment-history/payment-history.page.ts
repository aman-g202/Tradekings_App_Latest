import { Component, OnInit } from '@angular/core';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { PaymentService } from '../../../providers/services/payment/payment.service ';
import { ProfileModel } from '../../../providers/models/profile.model';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CONSTANTS } from '../../../providers/utils/constants';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
  providers: [PaymentService, DatePipe]
})
export class PaymentHistoryPage implements OnInit {
  paymentHistoryList = [];
  paymentHistoryAvailable = false;
  downloadingLoader: any;
  profile: ProfileModel;
  selectedCust: ProfileModel;
  isSelectedCust = false;
  isSalesman = false;
  endPoint: Observable<any>;
  hrefTag =  '';


  constructor(
    private paymentService: PaymentService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isSelectedCust = this.route.snapshot.queryParams.isSelectedCust;
    this.getData();
  }


  async getData() {
    this.downloadingLoader = await this.widgetUtil.showLoader('Please wait ....', 4000);
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + this.profile.userType;
    if ((this.profile.userType === 'SALESMAN') || (this.profile.userType === 'SALESMANAGER')) {
      if (this.isSelectedCust) {
        this.selectedCust = await this.storageService.getFromStorage('selectedCustomer') as ProfileModel;
        this.endPoint = this.paymentService.getPaymentHistory(this.selectedCust.externalId);
      } else {
        this.endPoint = this.paymentService.getPaymentHistoryForSm(this.profile.externalId);
        this.isSalesman = true;
      }
    } else {
      this.endPoint = this.paymentService.getPaymentHistory(this.profile.externalId);
    }
    this.endPoint.subscribe((res: any) => {
      if (res && res.body) {
        this.paymentHistoryList = res.body;
        this.paymentHistoryList.sort((a, b) => {
          return a.lastUpdatedAt < b.lastUpdatedAt ? 1 : -1;
        });
        if (this.paymentHistoryList.length > 0) {
          this.paymentHistoryList.forEach(item => {
            item.lastUpdatedAt = this.datePipe.transform(item.lastUpdatedAt, 'dd/MM/yyyy');
          });
        }
        this.paymentHistoryAvailable = true;
        this.downloadingLoader.dismiss();
      }
    }, (error: any) => {
      console.error('Payment History Page Could  not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      infiniteScroll.target.complete();
    }, 500);
  }
}
