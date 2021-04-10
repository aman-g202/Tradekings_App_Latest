import { Router } from '@angular/router';
import { StorageServiceProvider } from './../../providers/services/storage/storage.service';
import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../../providers/models/profile.model';
import { WidgetUtilService } from '../../providers/utils/widget';
import { UserListService } from '../../providers/services/userList/user-list.service';
import { CONSTANTS } from 'src/providers/utils/constants';

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.page.html',
  styleUrls: ['./select-customer.page.scss'],
})
export class SelectCustomerPage implements OnInit {
  hrefTag = '';
  profile: ProfileModel;
  userList;
  allCustomerList;
  filteredUserList;
  userListAvailable = false;
  isSalesmanFlow = true;
  skipValue = 0;
  limitValue = CONSTANTS.PAGINATION_LIMIT;


  constructor(
    private storageService: StorageServiceProvider,
    private widgetUtil: WidgetUtilService,
    private userListService: UserListService,
    private router: Router) { }

  async ngOnInit() {
    this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    if (this.profile.userType === 'PRICEEXECUTIVE') {
      this.hrefTag = '/price-executive-dashboard/' + this.profile.userType;
      this.getCustomerList();
    } else {
      this.hrefTag = '/dashboard/' + this.profile.userType;
      this.clearCart();
      this.getCustomerList();
    }
  }


  async clearCart() {
    const agree = await this.widgetUtil.showConfirm('Cart Exists!', 'Do you want to clear existing cart?', 'No', 'Yes');
    if (agree === 'Yes') {
      this.storageService.clearCart().then(() => {
        this.widgetUtil.presentToast('Existing cart has been cleared successfully...');
      }).catch(err => {
        this.widgetUtil.presentToast(`Error whlile clearing existing cart ${err}`);
      });
    }
  }



  getCustomerList() {
    try {
      this.userListService.getSalesmanCustomerList(this.profile.externalId).subscribe((res: any) => {
        this.setValues(res.body);
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
        this.userListAvailable = true;
      });

    } catch (err) {
      console.error('error: Salesman Select page could not load', err);
    }
  }


  setValues(list) {
    this.userList = list;
    this.allCustomerList = this.userList;
    this.filteredUserList = this.userList;
    this.userListAvailable = true;
  }

  doRefresh(refresher): void {
    this.getCustomerList();
    setTimeout(() => {
      refresher.target.complete();
    }, 1000);
  }

  // for pagination

  // async doInfinite(infiniteScroll) {
  //   this.skipValue = this.skipValue + this.limitValue;
  //   this.userListService.getSalesmanCustomerList(this.skipValue, this.limitValue)
  //       .subscribe((res: any) => {
  //         if (res.body.length > 0) {
  //           res.body.map((value) => {
  //             this.userList.push(value);
  //           });
  //           this.skipValue = this.limitValue;
  //         }
  //         infiniteScroll.target.complete();
  //       }, (error) => {
  //         infiniteScroll.target.complete();
  //         if (error.statusText === 'Unknown Error') {
  //           this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
  //         } else {
  //           this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
  //         }
  //       });
  // }


  searchCustomers(searchQuery) {
    this.filteredUserList = this.allCustomerList.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  selectCustomer(user) {
    this.selectedCustomer(user);
  }

  selectedCustomer(user) {
    this.storageService.setToStorage('selectedCustomer', user);
    const data = {
      isSalesmanFlow: true,
      timeStamp: new Date().getTime()
    };
    this.router.navigate(['/dashboard/' + this.profile.userType], { queryParams: data });
  }
}
