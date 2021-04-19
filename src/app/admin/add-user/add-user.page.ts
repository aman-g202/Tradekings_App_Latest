import { Component, OnInit } from '@angular/core';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { UserListService } from '../../../providers/services/userList/user-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../../../providers/utils/constants';
import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  providers: [DashboardService, UserListService]
})
export class AddUserPage implements OnInit {
  hrefTag = '';

  addAdminForm: FormGroup;
  addAdminHOForm: FormGroup;
  addCustomerForm: FormGroup;
  addSalesmanForm: FormGroup;
  addSalesmanagerForm: FormGroup;
  name: FormControl;
  password: FormControl;
  userLoginId: FormControl;
  externalId: FormControl;
  country: FormControl;
  channel: FormControl;
  province: FormControl;
  showLoader = false;
  userTypeList: Array<any> =  [ 'CUSTOMER', 'ADMIN', 'ADMINHO', 'SALESMAN', 'SALESMANAGER', 'PRICEEXECUTIVE'];
  countryList: Array<any> =  [ 'ZAMBIA'];
  provinceList: Array<any> =  [ 'BOTSWANA', 'COPPERBELT', 'DRC', 'EASTERN', 'KENYA', 'LUAPULA', 'LUSAKA', 'MALAWI', 'MOZAMBIQUE', 'NORTH WESTERN', 'NORTHERN'
  , 'SOUTH AFRICA', 'SOUTHERN', 'TANZANIA', 'WESTERN', 'ZIMBABWE' ];
  selectedUserType = 'CUSTOMER';
  selectedCountry = 'ZAMBIA';
  selectedProvince = 'BOTSWANA';
  showCustomerForm = 'CUSTOMER';
  isUserAuthorized = false;
  constructor(private userService: UserListService,
              private widgetUtil: WidgetUtilService,
              private dashboardService: DashboardService) {
    this.showCustomerForm = this.selectedUserType;
  }

  async ngOnInit() {
    this.hrefTag = '/dashboard/ADMIN';
    this.createFormControls();
    this.createAdminForm();
    this.createAdminHOForm();
    this.createCustomerForm();
    this.createSalesmanForm();

    // Salesmanager Form
    this.createSalesmanagerForm();

    // enable, disable CRUD button
    this.isUserAuthorized = await this.dashboardService.isAuthorized();

  }

  createFormControls() {
    this.userLoginId = new FormControl('', [
      Validators.required
    ]);
    this.password = new FormControl(CONSTANTS.DEFAULT_PASSWORD, [
      Validators.required
    ]);
    this.name = new FormControl('', [
      Validators.required
    ]);
    this.externalId = new FormControl('', [
      Validators.required
    ]);
    this.externalId = new FormControl('', [
      Validators.required
    ]);
    this.country = new FormControl('', [
      Validators.required
    ]);
    this.channel = new FormControl('', [
      Validators.required
    ]);
    this.province = new FormControl('', [
      Validators.required
    ]);
  }

  createAdminForm() {
    this.addAdminForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password
    });
  }

  // ADMINHO Form
  createAdminHOForm() {
    this.addAdminHOForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password
    });
  }

  createSalesmanForm() {
    this.addSalesmanForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password,
      externalId: this.externalId,
    });
  }

  // Salesmanager Form
  createSalesmanagerForm() {
    this.addSalesmanagerForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password,
      externalId: this.externalId,
    });
  }

  createCustomerForm() {
    this.addCustomerForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password,
      externalId: this.externalId,
      channel: this.channel
    });
  }

  onUserTypeSelect() {
    this.showCustomerForm = this.selectedUserType;
    this.addAdminForm.reset();
    this.addAdminHOForm.reset();
    this.addCustomerForm.reset();
    this.addSalesmanForm.reset();
    this.addSalesmanagerForm.reset();
  }

  createUser(userType) {
    let message = '';
    this.showLoader = true;
    let data: any = {};
    if (userType === 'customer') {
      message = CONSTANTS.CUSTOMER_CREATED;
      data = {
        lastUpdatedAt: Date.now(),
        name: this.name.value.trim(),
        userLoginId : this.userLoginId.value.trim(),
        password : this.password.value.trim(),
        userType : this.selectedUserType,
        country : this.selectedCountry.trim(),
        channel: this.channel.value.trim(),
        province : this.selectedProvince.trim(),
        externalId : this.externalId.value.trim()
      };
    } else if (userType === 'admin') {
      message = CONSTANTS.ADMIN_CREATED;
      data = {
        lastUpdatedAt: Date.now(),
        name: this.name.value.trim(),
        userLoginId : this.userLoginId.value.trim(),
        password : this.password.value.trim(),
        userType : this.selectedUserType,
        country : this.selectedCountry.trim(),
        province : this.selectedProvince.trim(),
      };
    } else if (userType === 'ADMINHO') {
      message = CONSTANTS.ADMINHO_CREATED;
      data = {
        lastUpdatedAt: Date.now(),
        name: this.name.value.trim(),
        userLoginId : this.userLoginId.value.trim(),
        password : this.password.value.trim(),
        userType : this.selectedUserType,
        country : this.selectedCountry.trim(),
        province : this.selectedProvince.trim()      };
    } else {
      if (userType === 'salesmanager'){
        message = CONSTANTS.SALESMANAGER_CREATED;
      } else if (userType === 'priceexecutive') {
        message = CONSTANTS.PRICEEXECUTIVE_CREATED;
      } else{
        message = CONSTANTS.SALESMAN_CREATED;
      }
      data = {
        lastUpdatedAt: Date.now(),
        name: this.name.value.trim(),
        userLoginId : this.userLoginId.value.trim(),
        password : this.password.value.trim(),
        userType : this.selectedUserType,
        country : this.selectedCountry.trim(),
        province : this.selectedProvince.trim(),
        externalId : this.externalId.value.trim()
      }
    }
    this.userService.createUser(data).subscribe((result) => {
      this.widgetUtil.presentToast(message);
      this.showLoader = false;
      this.addAdminForm.reset();
      this.addCustomerForm.reset();
    }, (error) => {
      this.showLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else if (error.error.message === 'UserLoginId already exist') {
        this.widgetUtil.presentToast(CONSTANTS.USER_LOGIN_ID_ALREADY_EXIST);
      }else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }

}
