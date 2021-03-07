import { AddPaymentPage } from './../add-payment/add-payment.page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart } from 'chart.js';

import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ProfileModel } from '../../../providers/models/profile.model';
import { CategoryItemModel } from '../../../providers/models/category.model';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  providers: [DashboardService, CategoriesService]
})
export class DashboardPage implements OnInit {
  partyName = '';
  @ViewChild('pieCanvas') pieCanvas;
  userType: string;
  mtdAchieved: number;
  target: number;
  pieChart: any;
  selectedCustomerprofile: any;
  userTypeCustomer = false;
  userTypeSalesman = false;
  targetCategory: any = 'Total';
  dashboardData: any;
  categoryList: CategoryItemModel[] = [];
  data: any = {};
  loader: any;
  loaderDownloading: any;
  externalId = '';
  selectedUserCustomer = false;
  selectedUser;

  constructor(
    private dashboardService: DashboardService,
    private categoriesServices: CategoriesService,
    public widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private route: ActivatedRoute,
    private menuCtrl: MenuController,
    private router: Router,
    private modal: ModalController) { }

  ngOnInit() {
    this.getData();
    this.userType = this.route.snapshot.params.userType;
  }

  displayChart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        datasets: [{
          data: [this.mtdAchieved, this.target],
          backgroundColor: [
            '#225F93',
            '#E7ECFF'
          ]
        }],
        labels: [
          'MTD Achieved',
          'Balance To Do'
        ],
        color: "red"
      },
      options: {
        legend: {
          display: true
        },
        title: {
          display: false,
          fontStyle: 'bold',
          fontSize: 18
        },
        tooltips: {
          enabled: false
        },
        events: []
      },

    });
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent)
  }

  async getData() {
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    try {
      const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
      this.selectedUser = await this.storageService.getFromStorage('selectedCustomer');
      this.partyName = profile.name;
      this.externalId = profile.externalId;
      if (this.selectedUser) {
        if ((profile.userType === 'ADMIN') || profile.userType === 'ADMINHO') {
          if (this.selectedUser['profile'] === 'SALESMAN' || this.selectedUser['profile'] === 'SALESMANAGER' || this.selectedUser['PRICEEXECUTIVE']) {
            this.partyName = this.selectedUser['profile'];
            this.externalId = this.selectedUser['externalId'];
            this.userTypeCustomer = false;
          } else {
            this.partyName = this.selectedUser['profile'];
            this.externalId = this.selectedUser['externalId'];
            this.selectedUserCustomer = true;
          }
        } else {
          this.partyName = this.selectedUser['profile'];
          this.externalId = this.selectedUser['externalId'];
          this.selectedUserCustomer = true;
        }

      } else {
        if (profile.userType === 'SALESMAN' || profile.userType === 'SALESMANAGER') {
          this.userTypeSalesman = true;
        } else if (profile.userType === 'CUSTOMER') {
          this.userTypeCustomer = true;
        } else {
          this.userTypeCustomer = false;
          this.userTypeSalesman = false;
        }
      }
      this.dashboardService.getDashboardData(this.externalId).subscribe((res: any) => {
        this.dashboardData = res.body[0];
        this.categoriesServices.getParentCategoryList(0, 20).subscribe((resp: any) => {
          this.categoryList = resp.body;
          this.prepareData('Total');
          this.loaderDownloading.dismiss();
        });
      }, error => {
        this.loaderDownloading.dismiss();
      });
    }
    catch (err) {
      console.log('Error: Profile Details could not Load', err);
      this.loaderDownloading.dismiss();
    }
  }

  openShopPage() {
    this.router.navigate(['/shop'], { queryParams: { placeOrder: true } });
  }

  async prepareData(selectedValue) {
    if (!this.dashboardData) {
      this.data.target = 0;
      this.data.achievement = 0;
      this.data.achievedPercentage = 0;
      this.data.balanceToDo = 0;
      this.data.creditLimit = 0;
      this.data.currentOutStanding = 0;
      this.data.thirtyDaysOutStanding = 0;
      this.data.availableCreditLimit = 0;
      this.data.tkPoints = 0;
      this.data.tkCurrency = 0;
      this.data.lmtdAchieve = 0;
      this.data.lymtdAchieve = 0;
      this.data.lmtdGrowthPercentage = 0;
      this.data.lymtdGrowthPercentage = 0;
      // Preparing Data for Graph
      this.mtdAchieved = this.data.achievement;
      this.target = 1;
    } else {
      if (selectedValue !== 'Total') {
        if (this.userTypeCustomer) {
          this.data.target = (this.dashboardData['target' + selectedValue.charAt(0)]).toFixed(2);
          this.data.achievement = (this.dashboardData['achive' + selectedValue.charAt(0)]).toFixed(2);
        } else {
          this.data.target = (this.dashboardData['target' + selectedValue.charAt(0)]).toFixed(2);
          this.data.achievement = (this.dashboardData['achive' + selectedValue.charAt(0)]).toFixed(2);
          this.data.lmtdAchieve = (this.dashboardData['lmtdAchive' + selectedValue.charAt(0)]).toFixed(2);
          this.data.lymtdAchieve = (this.dashboardData['lymtdAchive' + selectedValue.charAt(0)]).toFixed(2);
        }
      } else {
        if (this.userTypeCustomer) {
          this.data.target = (this.dashboardData['targetC'] + this.dashboardData['targetP'] + this.dashboardData['targetH']
            + this.dashboardData['targetL']).toFixed(2);
          this.data.achievement = (this.dashboardData['achiveC'] + this.dashboardData['achiveP'] + this.dashboardData['achiveH']
            + this.dashboardData['achiveL']).toFixed(2);
        } else {
          this.data.target = (this.dashboardData['targetC'] + this.dashboardData['targetP'] + this.dashboardData['targetH']
            + this.dashboardData['targetL']).toFixed(2);
          this.data.achievement = (this.dashboardData['achiveC'] + this.dashboardData['achiveP'] + this.dashboardData['achiveH']
            + this.dashboardData['achiveL']).toFixed(2);
          this.data.lmtdAchieve = (this.dashboardData['lmtdAchiveC'] + this.dashboardData['lmtdAchiveP'] + this.dashboardData['lmtdAchiveH']
            + this.dashboardData['lmtdAchiveL']).toFixed(2);
          this.data.lymtdAchieve = (this.dashboardData['lymtdAchiveC'] + this.dashboardData['lymtdAchiveP'] + this.dashboardData['lymtdAchiveH']
            + this.dashboardData['lymtdAchiveL']).toFixed(2);
        }
      }

      if (this.data.achievement) {
        const temp1 = this.data.lmtdAchieve ? ((this.data.achievement / this.data.lmtdAchieve) - 1) * 100 : 0;
        this.data.lmtdGrowthPercentage = temp1 ? temp1.toFixed(2) : 0;
        const temp2 = this.data.lymtdAchieve ? ((this.data.achievement / this.data.lymtdAchieve) - 1) * 100 : 0;
        this.data.lymtdGrowthPercentage = temp2 ? temp2.toFixed(2) : 0;
      }

      const temp: any = (this.data.achievement > 0 && this.data.target > 0) ? (this.data.achievement / this.data.target) : 0;
      this.data.achievedPercentage = (temp * 100).toFixed(2);

      const tempTodo = this.data.target - this.data.achievement;
      this.data.balanceToDo = (tempTodo > 0) ? (tempTodo.toFixed(2)) : 0;

      this.data.creditLimit = this.dashboardData.creditLimit ? this.dashboardData.creditLimit : 'NA';
      this.data.currentOutStanding = this.dashboardData.currentOutStanding ? this.dashboardData.currentOutStanding : 0;
      this.data.thirtyDaysOutStanding = this.dashboardData.thirtyDaysOutStanding ? this.dashboardData.thirtyDaysOutStanding : 0;
      // tslint:disable-next-line: max-line-length
      this.data.availableCreditLimit = this.data.creditLimit !== 'NA' && this.data.currentOutStanding != 0 ? ((this.data.creditLimit - this.data.currentOutStanding).toFixed(2)) : 'NA';

      // Preparing Data for Graph
      if (!(this.data.achievement && this.data.balanceToDo)) {
        this.target = 0.1;
      }
      else {
        this.target = this.data.balanceToDo;
      }
      this.mtdAchieved = this.data.achievement;
    }
    this.displayChart();
  }

  targetCategorySelectionChanged(event: CustomEvent) {
    if (event.detail.value === 'total') {
      this.prepareData('Total');
    } else {
      this.prepareData(event.detail.value);
    }
  }

  toggleMenu() {
    this.menuCtrl.toggle('menu');
  }
  async openPaymentModal() {
    const payModal = await this.modal.create({ component: AddPaymentPage })
    payModal.present();
  }

  openCustomerPaymentHistory() {
    this.router.navigate(['/payment-history']);
  }

  navigateCustomerList() {
    this.router.navigate(['/select-customer'])
  }

  navigateToViewSatetement() {
    this.router.navigate(['/view-statement'])
  }

  createPendingInvoice() {

  }
}
