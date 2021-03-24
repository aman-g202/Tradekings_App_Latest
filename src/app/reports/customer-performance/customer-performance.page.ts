import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { ReportService } from 'src/providers/services/reports/reports.service';
import { ProfileModel } from 'src/providers/models/profile.model';
import { StorageServiceProvider } from 'src/providers/services/storage/storage.service';



@Component({
  selector: 'app-customer-performance',
  templateUrl: './customer-performance.page.html',
  styleUrls: ['./customer-performance.page.scss'],
})
export class CustomerPerformancePage implements OnInit {
  profile: any;
  list = [];
  filterdList = [];
  isFilterMTD = false;
  isFilterDegrowing = false;
  isFilterNonBilling = false;
  isSortingFilter = false;
  searchQuery: string = ''
  category: string = 'Total'
  includeTonnage : boolean = false;
  selectedCategoryType = 'Total'

  constructor(
    public navCtrl: NavController, 
    public reportService: ReportService,
    private storageService: StorageServiceProvider,
    public widgetUtil: WidgetUtilService) {
    
  }

  async ngOnInit() {
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    console.log(profile);
    if (profile.userType === 'ADMIN' || profile.userType ==='ADMINHO') {
      this.getData('');
    } else {
      this.getData(profile.externalId);
    }
  }

  async showTonnage() {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    this.includeTonnage = !this.includeTonnage
    this.filterdList.map(item => {
      if (this.includeTonnage) {
        item.ftd = item[this.category].ftdTonnage;
        item.mtd = item[this.category].mtdTonnage;
        item.lymtd = item[this.category].lymtdTonnage;
        item.lmtd = item[this.category].lmtdTonnage;
        if (isNaN(item[this.category].percentageTonnage)) {
          item.percentage = 0;
        } else {
          item.percentage = item[this.category].percentageTonnage
        }
      } else {
        item.ftd = item[this.category].ftd;
        item.mtd = item[this.category].mtd;
        item.lymtd = item[this.category].lymtd;
        item.lmtd = item[this.category].lmtd;
        
        if (isNaN(item[this.category].percentage)) {
          item.percentage = 0;
        } else {
          item.percentage = item[this.category].percentage
        }
        
      }
      return item;
    })
    if (!this.isFilterDegrowing && !this.isFilterNonBilling) {
      this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
    } else {
      this.filterdList = this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
    }
    loader.dismiss();
  }

  async getData (externalId: string) {  
    const loader = await this.widgetUtil.showLoader('Getting Data...', 30000);
    ;
    this.reportService.getCustomerPerformanceData(externalId).subscribe((data: any) => {
      this.list = data.body.data;
      this.getList().then(data => {
        this.list = JSON.parse(JSON.stringify(data))
        this.filterdList = data.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
        loader.dismiss();
      }).catch(err => { console.log(err); loader.dismiss(); });
    }, err => {
      console.log(err);
      loader.dismiss();
    })
  }

  getList = async () => {
    return Promise.all(this.list.map(item => {
      if (this.includeTonnage) {
        item.ftd = item[this.category].ftdTonnage;
        item.mtd = item[this.category].mtdTonnage;
        item.lymtd = item[this.category].lymtdTonnage;
        item.lmtd = item[this.category].lmtdTonnage;
        if (isNaN(item[this.category].percentageTonnage)) {
          item.percentage = 0;
        } else {
          item.percentage = item[this.category].percentageTonnage
        }
      } else {
        item.ftd = item[this.category].ftd;
        item.mtd = item[this.category].mtd;
        item.lymtd = item[this.category].lymtd;
        item.lmtd = item[this.category].lmtd;
        if (isNaN(item[this.category].percentage)) {
          item.percentage = 0;
        } else {
          item.percentage = item[this.category].percentage
        }
      }
      return item;
    }))
  }

  async onCategoryTypeSelect(value) {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    
    this.category = value;
    this.getList().then(data => {
      this.list = JSON.parse(JSON.stringify(data))
      this.filterdList = data;
      if (this.isFilterMTD) {
        this.filterdList =  this.list.filter(item => {
          return item.ftd !== 0;
        })
      } else if (this.isFilterNonBilling){
        this.filterdList =  this.list.filter(item => {
          return item.ftd !== 0;
        })
        this.filterdList = this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
      } else if (this.isFilterDegrowing) {
        this.filterdList =  this.list.filter(item => {
          return item.percentage < 0;
        })
        this.filterdList = this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
      } else if (this.isSortingFilter) {
        this.filterdList =  this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
        this.filterdList = this.filterdList.slice(0,10);
      }
      if (this.searchQuery != '') {
        this.filterdList = this.filterdList.filter(item => {
          return item.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
        })
      }
      if (!this.isFilterDegrowing && !this.isFilterNonBilling) {
        this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
      }
      loader.dismiss();
    }).catch(err => { console.log(err); loader.dismiss(); });
  }
  
  goToInvoiceAgainstOrder(externalId: string, customerName: string) {
    // this.navCtrl.push(ReportInvoiceAgainstOrderPage, {externalId, customerName});
  }

  async filterFTDBillingOutlet() {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    
    this.isFilterMTD = !this.isFilterMTD;
    if (this.isFilterMTD) {
      this.filterdList = this.list;
      this.isFilterNonBilling = false;
      this.isSortingFilter = false;
      this.isFilterDegrowing = false;
      this.filterdList =  this.list.filter(item => {
        return item.ftd !== 0;
      })
      this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
    } else {
      this.filterdList = this.list.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);;
    }
    this.filterdList = this.filterdList.filter(item => {
      return item.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
    })
    loader.dismiss();
  }

  async filterNonBillingOutlet() {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    
    this.isFilterNonBilling = !this.isFilterNonBilling;
    if (this.isFilterNonBilling) {
      this.filterdList = this.list;
      this.isFilterMTD = false;
      this.isSortingFilter = false;
      this.isFilterDegrowing = false;
      this.filterdList = this.list.filter(item => {
        return item.mtd === 0;
      })
      this.filterdList =  this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
      
    } else {
      this.filterdList = this.list;
      this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
    }
    this.filterdList = this.filterdList.filter(item => {
      return item.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
    })
    loader.dismiss();
  }

  async filterDegrowingOutlet() {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    
    this.isFilterDegrowing = !this.isFilterDegrowing;
    if (this.isFilterDegrowing) {
      this.filterdList = this.list;
      this.isFilterNonBilling = false;
      this.isSortingFilter = false;
      this.isFilterMTD = false;
      this.filterdList =  this.list.filter(item => {
        return item.percentage < 0;
      })
      this.filterdList =  this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
      
    } else {
      this.filterdList = this.list;
      this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
    }
    this.filterdList = this.filterdList.filter(item => {
      return item.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
    })
    loader.dismiss();
  }

  async sortList() {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    
    this.isSortingFilter = !this.isSortingFilter;
    if (this.isSortingFilter) {
      this.filterdList = this.list;
      this.isFilterNonBilling = false;
      this.isFilterMTD = false;
      this.isFilterDegrowing = false;
      this.filterdList =  this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
      this.filterdList = this.filterdList.slice(0,10);
    } else {
      this.filterdList = this.list;
      this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
    }
    this.filterdList = this.filterdList.filter(item => {
      return item.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
    })
    loader.dismiss();
  }

  async searchCustomers(name) {
    const loader = await this.widgetUtil.showLoader('Please Wait...', 30000);
    this.filterdList = this.list.filter(item => {
      return item.customerName.toLowerCase().includes(name.toLowerCase());
    })
    if (this.isFilterMTD) {
      this.filterdList =  this.filterdList.filter(item => {
        return item.ftd !== 0;
      })
    } else if (this.isFilterDegrowing) {
      this.filterdList =  this.filterdList.filter(item => {
        return item.percentage < 0;
      })
      this.filterdList = this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
    } else if (this.isFilterNonBilling) {
      this.filterdList = this.filterdList.filter(item => {
        return item.mtd === 0;
      })
      this.filterdList =  this.filterdList.sort((a, b) => (a.lymtd < b.lymtd) ? 1 : -1);
    } else if (this.isSortingFilter) {
      this.filterdList =  this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
      this.filterdList = this.filterdList.slice(0,10);
    }
    if (!this.isFilterDegrowing && !this.isFilterNonBilling) {
      this.filterdList = this.filterdList.sort((a, b) => (a.mtd < b.mtd) ? 1 : -1);
    }
    loader.dismiss();
  }

}
