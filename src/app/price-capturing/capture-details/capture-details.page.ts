import { Component, OnInit } from '@angular/core';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { Router } from '@angular/router';
import { ProfileModel } from '../../../providers/models/profile.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-capture-details',
  templateUrl: './capture-details.page.html',
  styleUrls: ['./capture-details.page.scss'],
})
export class CaptureDetailsPage implements OnInit {
  addCustomerForm: FormGroup;
  hrefTag = '';

  constructor(
    private storageService: StorageServiceProvider,
    private widgetUtil: WidgetUtilService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createAddCustomerForm();
  }

  async ngOnInit() {
    this.createAddCustomerForm();
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    const customerInfo: any = await this.storageService.getFromStorage('customerInfo');
    if (!!customerInfo) {
      const agree = await this.widgetUtil.showConfirm('Capturing Exists!', `Continue with the last captured shop name : ${customerInfo.shopName}`, 'No', 'Yes');
      if (agree === 'Yes') {
        this.router.navigateByUrl('/capture-price/parent-category');
      } else {
        await this.storageService.removeFromStorage('customerInfo');
        this.addCustomerForm.reset();
      }
    }
    if (profile.userType === 'PRICEEXECUTIVE') {
      this.hrefTag = '/price-executive-dashboard/' + profile.userType;
    } else {
      this.hrefTag = '/dashboard/' + profile.userType;
    }
  }

  createAddCustomerForm() {
    this.addCustomerForm = this.formBuilder.group({
      reportType: ['price_capturing', Validators.required],
      priceType: ['CASE', Validators.required],
      channel: ['formal_trade', Validators.required],
      shopName: ['', Validators.required],
      mobile: [' ', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', Validators.required]
    });
  }

  async addCustomer() {
    const prepareCustDetail: any = this.addCustomerForm.value;
    prepareCustDetail.mobile = this.addCustomerForm.value.mobile.toString();
    await this.storageService.setToStorage('customerInfo', prepareCustDetail);
    this.router.navigateByUrl('/capture-price/parent-category');
  }
}
