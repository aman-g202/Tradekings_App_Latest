import { Component, NgModule, OnInit, ViewContainerRef } from '@angular/core';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { PaymentService } from '../../../providers/services/payment/payment.service ';
import { LoadingController, ModalController } from '@ionic/angular';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileModel } from '../../../providers/models/profile.model';

@NgModule({
  imports: [FormsModule]
})
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.page.html',
  styleUrls: ['./add-payment.page.scss'],
  providers: [PaymentService, FormsModule],

})

export class AddPaymentPage implements OnInit {
  selectedSalesman: any;
  isEnabled = false;
  cashIsSelected = false;
  chequeIsSelected = false;
  onlineIsSelected = false;
  salesmanName: any;
  userTypeSalesman = false;
  salesmanCode: string;
  customerCode = '';
  salesmanList = [];
  paymentObj: any = {};
  amountIsZero = true;
  createPaymentForm: FormGroup;
  profile: ProfileModel;
 


  constructor(
    private view: ModalController,
    private formBuilder: FormBuilder,
    private storageService: StorageServiceProvider,
    private paymentService: PaymentService,
    private loadingCtrl: LoadingController,
    private widgetUtil: WidgetUtilService,
  ) { }

  ngOnInit() {
    this.getData();
    this.createPaymentForm = this.formBuilder.group({
      paymentMode: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      chequeId: ['', Validators.required],
      transactionId: ['', Validators.required],
      paidTo: ['', Validators.required],
      comment: ['', Validators.required],
    });

  }
  async getData() {
    try {
      this.profile = await this.storageService.getFromStorage('profile') as ProfileModel;
      if ((this.profile.userType === 'SALESMAN') || (this.profile.userType === 'SALESMANAGER')) {
        this.salesmanName = this.profile.name;
        this.salesmanCode = this.profile.externalId;
        this.userTypeSalesman = true;
        const customer = await this.storageService.getFromStorage('selectedCustomer');
        this.customerCode = customer['externalId'];
      } else {
        this.customerCode = this.profile.externalId;
      }
    }
    catch (err) {
      console.log('Error: Profile Details could not Load', err);
    }
  }

  closePayModal() {
    this.view.dismiss();
  }

  // Check if Amount is 0
  checkAmount(keyCode) {
    if (this.createPaymentForm.value.paymentAmount > 0) {
      this.amountIsZero = false;
    }
    else {
      this.amountIsZero = true;
    }
  }

  paymentModeSelectionChanged() {
    switch (this.createPaymentForm.value.paymentMode) {
      case 'cash':
        this.cashIsSelected = true;
        this.chequeIsSelected = false;
        this.onlineIsSelected = false;
        this.isEnabled = true;
        break;
      case 'cheque':
        this.chequeIsSelected = true;
        this.cashIsSelected = false;
        this.onlineIsSelected = false;
        this.isEnabled = true;
        break;
      case 'bank transfer':
        this.onlineIsSelected = true;
        this.chequeIsSelected = false;
        this.cashIsSelected = false;
        this.isEnabled = true;
        break;
      default:
        this.onlineIsSelected = false;
        this.chequeIsSelected = false;
        this.cashIsSelected = false;
        this.isEnabled = false;
    }
  }

  async submitPayment() {
    // Payment Loader
    const payLoader = await this.loadingCtrl.create({
      message: 'Adding Payment...',
    });
    payLoader.present();
    const formValue = this.createPaymentForm.value;
    this.paymentObj.mode = formValue.paymentMode.toUpperCase();
    this.paymentObj.amount = formValue.paymentAmount ? formValue.paymentAmount : undefined;
    this.paymentObj.transactionId = formValue.transactionId ? formValue.transactionId : undefined;
    this.paymentObj.chequeId = formValue.chequeId ? formValue.chequeId : undefined;
    this.paymentObj.comment = formValue.comment ? formValue.comment : undefined;
    this.paymentObj.paidTo = formValue.paidTo ? formValue.paidTo : undefined;
    this.paymentObj.customerCode = this.customerCode;
    this.paymentObj.lastUpdatedAt = Date.now();
    if (this.salesmanCode && this.salesmanName) {
      this.paymentObj.salesmanCode = this.salesmanCode;
      this.paymentObj.salesmanName = this.salesmanName;
    }
    this.paymentService.createPayment(this.paymentObj).subscribe((res: any) => {
      if (res.status === 200) {
        this.widgetUtil.presentToast('Payment created successfully...');
        this.createPaymentForm.reset();
        payLoader.dismiss();
      } else {
        this.widgetUtil.presentToast('Error while creating payment...');
        payLoader.dismiss();
      }
    });
 }
}
