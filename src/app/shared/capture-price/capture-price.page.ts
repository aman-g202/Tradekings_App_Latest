import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProfileModel } from '../../../providers/models/profile.model';

@Component({
  selector: 'app-capture-price',
  templateUrl: './capture-price.page.html',
  styleUrls: ['./capture-price.page.scss'],
  providers: [StorageServiceProvider]
})
export class CapturePricePage implements OnInit {
  addCustomerForm: FormGroup;
  hrefTag = '';

  constructor(
    private storageService: StorageServiceProvider,
    private widgetUtil: WidgetUtilService,
    private NavCtrl: NavController,
    private router: Router) {
    this.createAddCustomerForm();
  }

  async ngOnInit() {
    const profile: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + profile.userType;
    const customerInfo: any = await this.storageService.getFromStorage('customerInfo');
    if (!!customerInfo) {
      const agree = await this.widgetUtil.showConfirm('Capturing Exists!', `Continue with the last captured shop name : ${customerInfo.shopName}`);
      if (agree === 'Yes') {
        this.NavCtrl.navigateRoot('shop/parent-category');
      } else {
        await this.storageService.removeFromStorage('customerInfo');
        this.addCustomerForm.reset();
      }
    }
  }


  createAddCustomerForm() {
    this.addCustomerForm = new FormGroup({
      reportType: new FormControl('price_capturing', [Validators.required]),
      priceType: new FormControl('CASE', [Validators.required]),
      channel: new FormControl('formal_trade', [Validators.required]),
      shopName: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      city: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required)
    });
  }


  async addCustomer() {
    await this.storageService.setToStorage('customerInfo', this.addCustomerForm.value);
    this.router.navigate(['/shop']);
  }
}
