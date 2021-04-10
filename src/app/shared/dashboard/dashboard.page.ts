import { DatePipe, DecimalPipe } from '@angular/common';
import { AddPaymentPage } from './../add-payment/add-payment.page';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart } from 'chart.js';

import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';
import { CategoriesService } from '../../../providers/services/categories/categories.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ProfileModel } from '../../../providers/models/profile.model';
import { CategoryItemModel } from '../../../providers/models/category.model';
import { Subscription } from 'rxjs';
import { CONSTANTS } from '../../../providers/utils/constants';
import { ReportsService } from '../../../providers/services/reports/reports.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  providers: [DashboardService, ReportsService, DecimalPipe]
})
export class DashboardPage implements OnInit, OnDestroy {
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
  externalId: string;
  selectedUserCustomer = false;
  slectedUserSalesman = false;
  selectedUser: any = [];
  isSalesmanFlow = false;
  subParams: Subscription;
  loggedInPartyName: string;
  userTypeAdmin = false;
  timeStamp: any;
  hideSideBar = false;
  useTypePriceExecutive = false;
  hrefTag = '';
  telPh = 'NA';
  height = 0;
  width = 0;
  documentDefinition: any = {};
  pendingInvoiceData: any = {
    customerName: '',
    data: [
      {
        billNumber: '',
        invoiceDate: '',
        invoiceNo: '',
        transType: '',
        days: '',
        invoiceAmt: '',
        pendingAmt: ''
      }
    ]
  };


  constructor(
    private dashboardService: DashboardService,
    private categoriesServices: CategoriesService,
    public widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private route: ActivatedRoute,
    private menuCtrl: MenuController,
    private router: Router,
    private modal: ModalController,
    private decimalPipe: DecimalPipe,
    private reportService: ReportsService) { }

  ngOnInit() {
    this.userType = this.route.snapshot.params.userType;
    this.subParams = this.route.queryParams.subscribe(params => {
      if (params.timeStamp && this.timeStamp !== params.timeStamp) {
        this.timeStamp = params.timeStamp;
        this.isSalesmanFlow = params.isSalesmanFlow ? params.isSalesmanFlow : params.isAdminFlow;
        this.resetData();
        this.getData();
      }
    });
    if (this.timeStamp === undefined) {
      this.getData();
    }
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
    this.widgetUtil.presentPopover(myEvent);
  }

  async getData() {
    this.loaderDownloading = await this.widgetUtil.showLoader('Please wait...', 2000);
    try {
      const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
      this.selectedUser = await this.storageService.getFromStorage('selectedCustomer');
      this.loggedInPartyName = profile.name;
      this.partyName = !this.isSalesmanFlow ? profile.name : this.selectedUser.name;
      this.externalId = profile.externalId;
      if (this.isSalesmanFlow) {
        if ((profile.userType === 'ADMIN') || profile.userType === 'ADMINHO') {
          this.hideSideBar = true;
          if ((this.selectedUser.userType === 'SALESMAN') || (this.selectedUser.userType === 'SALESMANAGER')) {
            this.partyName = this.selectedUser.name;
            this.externalId = this.selectedUser.externalId;
            // this.userTypeCustomer = false;
            this.selectedUserCustomer = false;
            // this.userTypeSalesman = false;
            this.userTypeAdmin = true;
          } else {
            this.partyName = this.selectedUser.name;
            this.externalId = this.selectedUser.externalId;
            this.selectedUserCustomer = true;
            // this.userTypeCustomer = false;
            this.userTypeSalesman = false;
            // this.userTypeAdmin = false;
          }
        } else if (profile.userType === 'PRICEEXECUTIVE') {
          this.externalId = this.selectedUser.externalId;
          this.useTypePriceExecutive = true;
          this.hrefTag = '/price-executive-dashboard/' + this.userType;
        }
        else {
          this.partyName = this.selectedUser.name;
          this.externalId = this.selectedUser.externalId;
          this.selectedUserCustomer = true;
          this.userTypeSalesman = true;
          this.hideSideBar = true;
        }
      } else {
        this.externalId = profile.externalId;
        this.hideSideBar = true;
        if (profile.userType === 'SALESMAN' || profile.userType === 'SALESMANAGER') {
          this.userTypeSalesman = true;
          this.selectedUserCustomer = false;
          this.storageService.removeFromStorage('selectedCustomer');
        } else if (profile.userType === 'CUSTOMER') {
          this.userTypeCustomer = true;
          // this.selectedUserCustomer = false;
        } else {
          this.selectedUserCustomer = false;
          this.userTypeAdmin = true;
        }
      }
      this.dashboardService.getDashboardData(this.externalId).subscribe((res: any) => {
        this.dashboardData = res.body[0];
        const categoryList = this.categoriesServices.getParentCat();
        if (categoryList.length > 0) {
          this.categoryList = categoryList;
          this.prepareData('Total');
          this.loaderDownloading.dismiss();
        } else {
          this.categoriesServices.getParentCategoryList(0, 30).subscribe((resp: any) => {
            this.categoryList = resp.body;
            this.categoriesServices.setParentCat(resp.body);
            this.prepareData('Total');
            this.loaderDownloading.dismiss();
          });
        }
      }, error => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
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
    if (!this.dashboardData || (selectedValue !== 'Confectionery'
      && selectedValue !== 'Laundry' && selectedValue !== 'Personal Care' && selectedValue !== 'Household' && selectedValue !== 'Total')) {
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
        if (this.userTypeCustomer || this.selectedUserCustomer) {
          this.data.target = (this.dashboardData['target' + selectedValue.charAt(0)]).toFixed(2);
          this.data.achievement = (this.dashboardData['achive' + selectedValue.charAt(0)]).toFixed(2);
        } else {
          this.data.target = (this.dashboardData['target' + selectedValue.charAt(0)]).toFixed(2);
          this.data.achievement = (this.dashboardData['achive' + selectedValue.charAt(0)]).toFixed(2);
          this.data.lmtdAchieve = (this.dashboardData['lmtdAchive' + selectedValue.charAt(0)]).toFixed(2);
          this.data.lymtdAchieve = (this.dashboardData['lymtdAchive' + selectedValue.charAt(0)]).toFixed(2);
        }
      } else {
        if (this.userTypeCustomer || this.selectedUserCustomer) {
          this.data.target = (this.dashboardData.targetC + this.dashboardData.targetP + this.dashboardData.targetH
            + this.dashboardData.targetL).toFixed(2);
          this.data.achievement = (this.dashboardData.achiveC + this.dashboardData.achiveP + this.dashboardData.achiveH
            + this.dashboardData.achiveL).toFixed(2);
        } else {
          this.data.target = (this.dashboardData.targetC + this.dashboardData.targetP + this.dashboardData.targetH
            + this.dashboardData.targetL).toFixed(2);
          this.data.achievement = (this.dashboardData.achiveC + this.dashboardData.achiveP + this.dashboardData.achiveH
            + this.dashboardData.achiveL).toFixed(2);
          this.data.lmtdAchieve = (this.dashboardData.lmtdAchiveC + this.dashboardData.lmtdAchiveP + this.dashboardData.lmtdAchiveH
            + this.dashboardData.lmtdAchiveL).toFixed(2);
          this.data.lymtdAchieve = (this.dashboardData.lymtdAchiveC + this.dashboardData.lymtdAchiveP + this.dashboardData.lymtdAchiveH
            + this.dashboardData.lymtdAchiveL).toFixed(2);
        }
      }

      if (this.data.achievement) {
        const temp1 = (this.data.lmtdAchieve > 0) ? ((this.data.achievement / this.data.lmtdAchieve) - 1) * 100 : 0;
        this.data.lmtdGrowthPercentage = temp1 ? temp1.toFixed(2) : 0;
        const temp2 = (this.data.lymtdAchieve > 0) ? ((this.data.achievement / this.data.lymtdAchieve) - 1) * 100 : 0;
        this.data.lymtdGrowthPercentage = temp2 ? temp2.toFixed(2) : 0;
      }

      const temp: any = (this.data.achievement > 0 && this.data.target > 0) ? (this.data.achievement / this.data.target) : 0;
      this.data.achievedPercentage = (temp * 100).toFixed(2);

      const tempTodo = this.data.target - this.data.achievement;
      this.data.balanceToDo = (tempTodo > 0) ? (tempTodo.toFixed(2)) : 0;

      this.data.creditLimit = this.dashboardData.creditLimit ? this.dashboardData.creditLimit : 'NA';
      this.data.currentOutStanding = this.dashboardData.currentOutStanding ? this.dashboardData.currentOutStanding : 0;
      this.data.thirtyDaysOutStanding = this.dashboardData.thirtyDaysOutStanding ? this.dashboardData.thirtyDaysOutStanding : 0;
      this.data.availableCreditLimit = this.data.creditLimit !== 'NA' &&
        // tslint:disable-next-line: triple-equals
        this.data.currentOutStanding != 0 ? ((this.data.creditLimit - this.data.currentOutStanding).toFixed(2)) : 'NA';

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
    const payModal = await this.modal.create({ component: AddPaymentPage });
    payModal.present();
  }

  openCustomerPaymentHistory() {
    this.router.navigate(['/payment-history'], { queryParams: { isSelectedCust: true } });
  }

  navigateCustomerList() {
    this.router.navigate(['/select-customer']);
  }

  navigateToViewSatetement() {
    this.router.navigate(['/view-statement']);
  }

  async createPendingInvoice() {
    const showLoder = await this.widgetUtil.showLoader('Please wait , Pdf Downloading..', 3000);
    this.dashboardService.getPendingInvoicData(this.externalId).subscribe((res: any) => {
      if (res.body && res.body[0] && res.body.length > 0) {
        showLoder.dismiss();
        this.pendingInvoiceData = res.body[0];
        this.createPdf();
      } else {
        showLoder.dismiss();
        this.widgetUtil.presentToast('No record found');
      }
    }, (error: any) => {
      showLoder.dismiss();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast('No record found');
      }
    });

  }

  resetData() {
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
  }





  prepareTableData() {
    const headingColor = 'black';
    const textColorSecondary = '#202020';
    const body = [];

    body.push(
      [
        { text: 'Customer Name:', fontSize: 9, bold: true, border: [true, true, false, false] },
        { text: `${this.pendingInvoiceData.customerName}`, noWrap: false, color: 'blue', fontSize: 9, border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
        { text: 'Add:', fontSize: 9, bold: true, border: [false, true, false, false] },
        { text: `${this.selectedUser.province}`, noWrap: true, color: 'blue', fontSize: 9, border: [false, true, false, true] },
        { text: '', border: [false, true, false, false] },
        { text: 'Tel:', fontSize: 9, bold: true, border: [false, true, false, false] },
        { text: `${this.telPh}`, noWrap: true, color: 'blue', fontSize: 9, border: [false, true, true, false] },
      ]
    );

    body.push(
      [
        {
          text: 'System Voucher', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], bold: true,
          border: [true, true, false, true]
        },
        {
          text: 'Document Date', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], bold: true,
          border: [false, true, false, true]
        },
        {
          text: 'Document No', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], bold: true,
          border: [false, true, false, true]
        },
        {
          text: 'Type', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6],
          bold: true, border: [false, true, false, true]
        },
        {
          text: 'Period (Days)', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], bold: true,
          border: [false, true, false, true]
        },
        {
          text: 'Document Amt', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], alignment: 'right', bold: true,
          border: [false, true, false, true]
        },
        {
          text: 'Balance\n(ZMW)', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], alignment: 'right', bold: true,
          border: [false, true, false, true]
        },
        {
          text: 'Ex Rate', color: headingColor, fontSize: 8, margin: [0, 6, 0, 6], alignment: 'right', bold: true,
          border: [false, true, true, true]
        },
      ]
    );
    let i = 0;
    this.pendingInvoiceData.data.forEach(item => {
      const row = [
        {
          text: item.billNumber,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [true, true, false, false] : [true, false, false, false]
        },
        {
          text: `${new DatePipe('en_ZM').transform(new Date(item.invoiceDate), 'dd.mm.yy')}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: item.invoiceNo,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: item.transType,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: `${item.days}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: this.decimalPipe.transform(item.invoiceAmt, '.2'),
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false],
          alignment: 'right'
        },
        {
          text: `${this.decimalPipe.transform(item.pendingAmt, '.2')}`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false],
          alignment: 'right'
        },
        {
          text: 'NA',
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, true, false] : [false, false, true, false],
          alignment: 'right'
        }
      ];
      i++;
      body.push(row);
    });

    body.push(
      [
        { text: 'Ledger Balance', color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [true, true, false, true] },
        {
          text: `${this.decimalPipe.transform(this.getInvoicePendingTotalBalance(), '.2')}`, color: 'brown', fontSize: 10,
          margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true]
        },
        { text: 'C Limit', color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: `NA`, noWrap: true, color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: 'Current Total:', fontSize: 8, border: [false, true, false, true] },
        {
          text: `${this.decimalPipe.transform(this.getInvoiceTotalAmount(), '.2')}`, color: headingColor, fontSize: 10,
          margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true]
        },
        {
          text: `${this.decimalPipe.transform(this.getInvoicePendingTotalBalance(), '.2')}`, color: headingColor, fontSize: 10,
          margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true]
        },
        { text: '', border: [false, true, true, true] },
      ]
    );

    body.push(
      [
        { text: '', border: [false, true, false, false] },
        { text: ``, border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
        {
          text: 'Report Total', color: headingColor, noWrap: true, fontSize: 10,
          margin: [0, 6, 0, 6], bold: true, border: [false, true, false, false]
        },
        {
          text: `${this.decimalPipe.transform(this.getInvoiceTotalAmount(), '.2')}`, color: headingColor, fontSize: 10,
          margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, false]
        },
        {
          text: `${this.decimalPipe.transform(this.getInvoicePendingTotalBalance(), '.2')}`, color: headingColor, fontSize: 10,
          margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, false]
        },
        { text: '', border: [false, true, false, false] },
      ]
    );

    return body;
  }

  getInvoiceTotalAmount() {
    let sum = 0;
    this.pendingInvoiceData.data.forEach(item => {
      sum = sum + item.invoiceAmt;
    });
    return sum;
  }

  getInvoicePendingTotalBalance() {
    let sum = 0;
    this.pendingInvoiceData.data.forEach(item => {
      sum = sum + item.pendingAmt;
    });
    return sum;
  }

  createPdf() {
    this.documentDefinition = {
      header(currentPage, pageCount, pageSize) {
        return [
          {
            text: `Page ${currentPage} of ${pageCount}`,
            fontSize: 10,
            color: 'grey',
            margin: [0, 10, 40, 0],
            alignment: 'right'
          }
        ];
      },
      pageSize: 'A4',
      content: [
        {
          text: `Date ${new DatePipe('en_ZM').transform(new Date(), 'dd/M/yy')}`, fontSize: 10, alignment: 'right', color: 'black',
          margin: [0, -10, 0, 0]
        },
        { text: 'Customer Wise Invoice/Payment Pending Report', fontSize: 13, bold: true, alignment: 'center', color: 'black', decoration: 'underline', margin: [0, 10, 0, 0] },
        { text: `Due Period ${new DatePipe('en_ZM').transform(new Date(new Date().getFullYear(), 0, 1), 'dd/M/yy')} to ${new DatePipe('en_ZM').transform(new Date(), 'dd/M/yy')}`, fontSize: 12, bold: true, alignment: 'center', color: 'black', margin: [0, 10, 0, 0] },
        {
          absolutePosition: { x: 20, y: this.height += 110 },
          table: {
            headerRows: 1,
            widths: [70, 70, 70, 40, 30, 80, 80, 40],
            body: this.prepareTableData()
          },
          layout: { hLineColor: 'black', vLineColor: 'black' }
        }
      ],
      pageBreakBefore(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        let flag = false;
        if (currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0) {
          flag = true;
        }

        if (currentNode.startPosition.top > 750) {
          flag = true;
        }
        return flag;
      }
    };
    this.reportService.downloadPdf(this.documentDefinition, 'download', 'PendingInvoice');
  }


  ngOnDestroy() {
    this.subParams.unsubscribe();
  }

}
