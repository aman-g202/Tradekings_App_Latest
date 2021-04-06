import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../providers/services/dashboard/dashboard.service';
import { WidgetUtilService } from '../../providers/utils/widget';
import { CONSTANTS } from '../../providers/utils/constants';
import { StorageServiceProvider } from '../../providers/services/storage/storage.service';
import { ProfileModel } from '../../providers/models/profile.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-price-executive-dashboard',
  templateUrl: './price-executive-dashboard.page.html',
  styleUrls: ['./price-executive-dashboard.page.scss'],
  providers: [DashboardService]
})
export class PriceExecutiveDashboardPage implements OnInit {
  partyName = '';
  userType = '';
  externalId = '';
  dashboardData = {
    day1: { countOfOutlet: 0 },
    day2: { countOfOutlet: 0 },
    mtd: { countOfOutlet: 0 },
    ftd: { countOfOutlet: 0 }
  };
  hideSideBar = false;
  isAdminFlow = false;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.userType = this.route.snapshot.params.userType;
    this.getDashboardData();
  }


  async getDashboardData() {
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    if (profile.userType === 'PRICEEXECUTIVE') {
      this.hideSideBar = true;
      this.partyName = profile.name;
      this.externalId = profile.externalId;
    } else {
      this.isAdminFlow = true;
      const selectedPriceExecutive: ProfileModel = await this.storageService.getFromStorage('selectedCustomer') as ProfileModel;
      this.partyName = selectedPriceExecutive.name;
      this.externalId = selectedPriceExecutive.externalId;
    }
    const showLoader = await this.widgetUtil.showLoader('Please wait', 10000);
    this.dashboardService.getPriceExecutiveDashboardData(this.externalId).subscribe((res: any) => {
      this.dashboardData = res.body;
      showLoader.dismiss();
    }, (error: any) => {
      showLoader.dismiss();
      console.error('Price Executive Dashboard Page could not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }


  doRefresh(refresher) {
    this.getDashboardData();
    setTimeout(() => {
      refresher.target.complete();
    }, 1000);
  }
  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent);
  }

  colseModal() {
    this.modalCtrl.dismiss();
  }
}
