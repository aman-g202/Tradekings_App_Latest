import { Component, OnInit } from '@angular/core';
import { SchedulersService } from '../../providers/services/schedulers/schedulers.service';
import { WidgetUtilService } from '../../providers/utils/widget';
import { Observable } from 'rxjs';
import { ProfileModel } from '../../providers/models/profile.model';
import { StorageServiceProvider } from '../../providers/services/storage/storage.service';

@Component({
  selector: 'app-schedulers',
  templateUrl: './schedulers.page.html',
  styleUrls: ['./schedulers.page.scss'],
  providers: [SchedulersService]
})
export class SchedulersPage implements OnInit {
  endPointObs$: Observable<any>;
  name = '';

  constructor(
    private schedulersService: SchedulersService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider
  ) { }

async  ngOnInit() {
  const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
  this.name = profile.name;
  }

  presentPopover(event){
   this.widgetUtil.presentPopover(event);
  }

// responsible for call api
  async onRunScheduler(endPoint: Observable<any>) {
    const showLoader: any = await this.widgetUtil.showLoader('Schedular is Running...', 10000);
    endPoint.subscribe((res) => {
      showLoader.dismiss();
      this.widgetUtil.presentToast('Schedular Triggered successfully...');
    }, (error: any) => {
      showLoader.dismiss();
      this.widgetUtil.presentToast(`Error while running schedular:  ${error}`);
    });
  }

// Blue button Schedulers
  createNewProductInMongo() {
    const endPointObs$: Observable<any> = this.schedulersService.createNewProductInMogo();
    this.onRunScheduler(endPointObs$);
  }

  updateProductInMongo() {
    const endPointObs$: Observable<any> = this.schedulersService.updateProductInMongo();
    this.onRunScheduler(endPointObs$);
  }

  createNewCustomerInMongo() {
    const endPointObs$: Observable<any> = this.schedulersService.createNewCustomerInMngo();
    this.onRunScheduler(endPointObs$);
  }

  updateCustomerInMongo() {
    const endPointObs$: Observable<any> = this.schedulersService.updateCustomerInMong();
    this.onRunScheduler(endPointObs$);
  }

  updateParentIdInUserDoc() {
    const endPointObs$: Observable<any> = this.schedulersService.updateParentIdInUserDoc();
    this.onRunScheduler(endPointObs$);
 }

  updateUserDashboardData() {
    const endPointObs$: Observable<any> = this.schedulersService.updateUserDashboardData();
    this.onRunScheduler(endPointObs$);
  }

  updateNonUserDashboardData() {
    const endPointObs$: Observable<any> = this.schedulersService.updateNonCustomerDashboardData();
    this.onRunScheduler(endPointObs$);
  }

  updateAssociatedSMListToMongo() {
    const endPointObs$: Observable<any> = this.schedulersService.updateAssociatedSMListToMongo();
    this.onRunScheduler(endPointObs$);
  }

  createCustomerStatements() {
    const endPointObs$: Observable<any> = this.schedulersService.createCustomerStatements();
    this.onRunScheduler(endPointObs$);
  }

  createCustomerPendingInvoice() {
    const endPointObs$: Observable<any> = this.schedulersService.createCustomerPendingInvoice();
    this.onRunScheduler(endPointObs$);
  }

  createCustomerInvoiceAgainstOrder() {
    const endPointObs$: Observable<any> = this.schedulersService.createCustomerInvoiceAgainstOrder();
    this.onRunScheduler(endPointObs$);
  }

  // Purple Button Schedulers
  storeInProgressOrderInErp() {
    const endPointObs$: Observable<any> = this.schedulersService.storeInProgressOrderInErp();
    this.onRunScheduler(endPointObs$);
  }

  updateOrderStatusToBilled() {
    const endPointObs$: Observable<any> = this.schedulersService.updateOrderStatusToBilled();
    this.onRunScheduler(endPointObs$);

  }

  // Reports schedulers
  updateInvoiceOrderGap() {
    const endPointObs$: Observable<any> = this.schedulersService.updateInvoiceOrderGap();
    this.onRunScheduler(endPointObs$);

  }

  updateCustomerPerformance() {
    const endPointObs$: Observable<any> = this.schedulersService.updateCustomerPerformance();
    this.onRunScheduler(endPointObs$);

  }

  updateSkuPerformance() {
    const endPointObs$: Observable<any> = this.schedulersService.updateSkuPerformance();
    this.onRunScheduler(endPointObs$);
  }

  updateVanPerformance() {
    const endPointObs$: Observable<any> = this.schedulersService.updateVanPerformance();
    this.onRunScheduler(endPointObs$);

  }
}
