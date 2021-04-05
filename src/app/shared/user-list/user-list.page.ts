import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../../../providers/models/profile.model';
import { UserListService } from '../../../providers/services/userList/user-list.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CONSTANTS } from '../../../providers/utils/constants';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { ModalController } from '@ionic/angular';
import { PriceExecutiveDashboardPage } from '../../price-executive-dashboard/price-executive-dashboard.page';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  title: string;
  profile: ProfileModel;
  userList: any[];
  allCustomerList: any[];
  skipValue = 0;
  limitValue = CONSTANTS.PAGINATION_LIMIT;
  loaderDownloading: any;
  userType: string;
  placeHolderValue: string;
  isCustomerList = false;
  scrolling = false;
  hrefTag = '';
  userListAvailable = true;


  constructor(
    private userListService: UserListService,
    private strogeService: StorageServiceProvider,
    private router: Router,
    private route: ActivatedRoute,
    private widgetUtil: WidgetUtilService,
    private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.profile = await this.strogeService.getFromStorage('profile') as ProfileModel;
    this.userType = this.profile.userType;
    this.hrefTag = '/dashboard/' + this.userType;
    this.route.params.subscribe((params) => {
      if (params.id === 'customerList') {
        this.placeHolderValue = 'Search Customer...';
        this.title = 'Customer';
        this.isCustomerList = true;
        this.scrolling = true;
        this.getCustomerList();
      } else {
        this.placeHolderValue = 'Search Salesman...';
        this.title = 'Salesman';
        this.getAllSalemanList();
        this.scrolling = false;
      }
    });
  }


  async getCustomerList() {
    this.loaderDownloading = await this.widgetUtil.showLoader('Data Fetching...', 2000);
    if (this.userType === 'ADMINHO') {
      try {
        this.userListService.getCustomerList(this.skipValue, this.limitValue).subscribe((res: any) => {
          this.userList = res.body;
          this.loaderDownloading.dismiss();
          this.userListAvailable = true;
        }, (error) => {
          if (error.statusText === 'Unknown Error') {
            this.loaderDownloading.dismiss();
            this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
          } else {
            this.loaderDownloading.dismiss();
            this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
          }
        }
        );
      } catch (err) {
        this.loaderDownloading.dismiss();
        console.log('error: Customer list could not Load', err);
      }
    } else {
      try {
        this.userListService.getCustomerByProvince(this.profile.province).subscribe((res: any) => {
          this.scrolling = false;
          this.userList = res.body;
          this.loaderDownloading.dismiss();
          if (this.userList.length > 0) {
            this.userListAvailable = true;
          } else {
            this.userListAvailable = false;
          }
        }, (error) => {
          this.loaderDownloading.dismiss();
          if (error.statusText === 'Unknown Error') {
            this.loaderDownloading.dismiss();
            this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
          } else {
            this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
          }
        });
      } catch (error) {
        this.loaderDownloading.dismiss();
        console.log('error: Customer List Could not load', error);
      }
    }
  }


  async getAllSalemanList() {
    this.loaderDownloading = await this.widgetUtil.showLoader('Data Fetching...', 2000);
    try {
      this.userListService.getAllSalesmanList().subscribe((res: any) => {
        this.scrolling = false;
        this.loaderDownloading.dismiss();
        this.userList = res.body;
        if (this.userList.length > 0) {
          this.userListAvailable = true;
        } else {
          this.userListAvailable = false;
        }
        if (this.userList.length > 0) {
          this.userListAvailable = true;
        } else {
          this.userListAvailable = false;
        }
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.loaderDownloading.dismiss();
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    } catch (err) {
      this.loaderDownloading.dismiss();
      console.error('error: SalemanList not could not load', err);
    }
  }

  // this filter wii be move backend
  searchUser(value) {

  }

  doRefresh(refresher): void {
    if (this.isCustomerList) {
      this.getCustomerList();
    } else {
      this.getAllSalemanList();
    }
    setTimeout(() => {
      refresher.target.complete();
    }, 1000);
  }


  async doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limitValue;
    if (this.userType === 'ADMINHO') {
      this.userListService.getCustomerList(this.skipValue, this.limitValue)
        .subscribe((res: any) => {
          if (res.body.length > 0) {
            res.body.map((value) => {
              this.userList.push(value);
            });
          } else {
            this.skipValue = this.limitValue;
          }
          infiniteScroll.target.complete();
        }, (error) => {
          infiniteScroll.target.complete();
          if (error.statusText === 'Unknown Error') {
            this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
          } else {
            this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
          }
        });
    }
  }

 async onNavigateDashboard(user) {
    this.strogeService.setToStorage('selectedCustomer', user);
    const data = {
      isAdminFlow: true,
      timeStamp: new Date().getTime()
    };
    if (user.userType === 'PRICEEXECUTIVE'){
      const openModel = await this.modalCtrl.create({
        component: PriceExecutiveDashboardPage,
        componentProps: data
   })
   return await openModel.present();
   //   this.router.navigate(['/price-executive-dashboard/' + this.profile.userType], { queryParams: data })
    } else {
     this.router.navigate(['/dashboard/' + this.profile.userType], { queryParams: data });
    }
  }

  onEditUser(user) {
    this.strogeService.setToStorage('editUserInfo', user);
    this.router.navigate(['/edit-user']);
  }
}
