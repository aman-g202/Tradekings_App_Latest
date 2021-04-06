import { Subscription } from 'rxjs';
import { CONSTANTS } from 'src/providers/utils/constants';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserListService } from '../../../providers/services/userList/user-list.service';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ModalController } from '@ionic/angular';
import { EditUserSmListPage } from '../edit-user-sm-list/edit-user-sm-list.page';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
  providers: [DashboardService]
})
export class EditUserPage implements OnInit, OnDestroy {
  hrefTag = '';
  userCodeLabel: string;
  associatedSM = [];
  userName = '';
  userCode = '';
  tkPoints: number;
  editUser: any = [];
  tkCurrency: number;
  isCustomer = false;
  selectedProvince = 'BOTSWANA';
  associationAvailable = false;
  isAuthorized = false;
  querySub: Subscription;
  provinceList: Array<any> = ['BOTSWANA', 'COPPERBELT', 'DRC', 'EASTERN', 'KENYA', 'LUAPULA', 'LUSAKA', 'MALAWI', 'MOZAMBIQUE', 'NORTH WESTERN', 'NORTHERN'
    , 'SOUTH AFRICA', 'SOUTHERN', 'TANZANIA', 'WESTERN', 'ZIMBABWE'];

  constructor(
    private userListService: UserListService,
    private storageService: StorageServiceProvider,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private widgetUtil: WidgetUtilService,
    private dashboardService: DashboardService) { }

  async ngOnInit() {
    this.querySub = this.route.queryParams.subscribe((params) => {
      const salesmanExist = this.associatedSM.some(item => item.externalId === params.externalId);
      if (salesmanExist) {
        this.widgetUtil.presentToast('Salesman is already exist!!');
      } else {
        this.associatedSM.push(params);
        this.associationAvailable = true;
      }
    });
    this.isAuthorized = await this.dashboardService.isAuthorized();
    this.getEditUserData();
  }


  async getEditUserData() {
    this.editUser = await this.storageService.getFromStorage('editUserInfo');
    if (Object.keys(this.editUser).length > 0) {
      this.editUser.associatedSalesmanList = this.editUser.associatedSalesmanList ? this.editUser.associatedSalesmanList : [];
      this.isCustomer = this.editUser.userType === 'CUSTOMER' ? true : false;
      this.associationAvailable = this.editUser.associatedSalesmanList.length > 0 ? true : false;
      this.userCodeLabel = this.isCustomer ? 'Customer' : 'SM';
      this.associatedSM = this.editUser.associatedSalesmanList;
      this.userName = this.editUser.name;
      this.userCode = this.editUser.externalId;
      this.selectedProvince = this.editUser.province;
      this.tkCurrency = this.editUser.tkCurrency;
      this.tkPoints = this.editUser.tkPoints;
    } else {
      this.widgetUtil.presentToast('User not selected');
    }
    this.setBackButtonUrl();
  }


  async openSelectSmModel() {
    const showModal = await this.modalController.create({
      component: EditUserSmListPage
    });
    showModal.present();
  }


  setBackButtonUrl() {
    if (this.isCustomer) {
      this.hrefTag = 'user-list/customerList';
    } else {
      this.hrefTag = 'user-list/salesmanList';
    }
  }


  async removeSalesman(salesman) {
    const confirm = await this.widgetUtil.showConfirm('Remove Salesman for this Customer', 'Are you sure to remove?', 'Disagree', 'Agree');
    if (confirm === 'Agree') {
      this.associatedSM = this.associatedSM.filter(item => item !== salesman);
      this.editUser.associatedSalesmanList = this.associatedSM;
      if (this.associatedSM.length <= 0) {
        this.associationAvailable = false;
      }
      this.storageService.setToStorage('editUserInfo', this.editUser);
    }
  }


  async updateUser() {
    const showLoder = await this.widgetUtil.showLoader('Pleaser wait...', 2000);
    if (this.isAuthorized) {
      const updatedUserObject: any = {};
      updatedUserObject.externalId = this.userCode;
      updatedUserObject.name = this.userName;
      updatedUserObject.province = this.selectedProvince;
      updatedUserObject.tkPoints = this.tkPoints;
      updatedUserObject.tkCurrency = this.tkCurrency;
      updatedUserObject.associatedSalesmanList = this.associatedSM;
      this.userListService.updateUser(updatedUserObject).subscribe((result: any) => {
        showLoder.dismiss();
        if (result.body.nModified === 1) {
          this.widgetUtil.presentToast('User Updated Successfully');
        } else {
          this.widgetUtil.presentToast('Error while updating user');
        }
      }, (error: any) => {
        showLoder.dismiss();
        console.error('Edit user page not loaded', error);
      });
    } else {
      showLoder.dismiss();
      this.widgetUtil.presentToast('User not Authorise to edit user');
    }
  }


  async openResetModelPopUp() {
    // tslint:disable-next-line: max-line-length
    const confirm = await this.widgetUtil.showConfirm('Reset Password!!', 'Are You Sure you want to reset password for' + ' ' + this.userName, 'No', 'Yes');
    if (confirm === 'Yes') {
      this.resetPassword();
    }
  }


  resetPassword() {
    this.userListService.resetPassword(this.editUser._id).subscribe((res: any) => {
      this.widgetUtil.presentToast(`Password reset successfully. New password: ${CONSTANTS.DEFAULT_PASSWORD}`);
    }, (error: any) => {
      console.error('Edit User Page could not load');
      if (error.statusText === 'Unknow Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
