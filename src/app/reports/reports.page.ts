import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  // <!-- List All 4 Types of Reports Here -->

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  // openInvoiceAgainstOrderPage () {
  //   this.navCtrl.navigateForward(ReportInvoiceAgainstOrderPage)
  // }

  openCustomerPerformancePage () {
    this.navCtrl.navigateForward('/reports/customer-performance')
  }

  openSKUPerformancePage () {
    this.navCtrl.navigateForward('/reports/sku-performance')
  }

  openVANPerformancePage () {
    this.navCtrl.navigateForward('/reports/van-performance')
  }

  // openTargetVSAchPage () {
  //   this.navCtrl.navigateForward(ReportTargetVsAchievementPage)
  // }

  // openFocusedPackPage () {
  //   this.navCtrl.navigateForward(ReportFocusedPackPage)
  // }

  openPriceListPage () {
    this.navCtrl.navigateForward('/reports/price-list')
  }

}
