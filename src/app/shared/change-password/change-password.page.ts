import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileModel } from '../../../providers/models/profile.model';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { DashboardService } from '../../../providers/services/dashboard/dashboard.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  providers: [DashboardService]
})

export class ChangePasswordPage implements OnInit {
  changePasswordForm: FormGroup;
  user: ProfileModel;
  hrefTag = '';

  constructor(
    private formBuilder: FormBuilder,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private dashboardService: DashboardService,
    private navCtr: NavController,

  ) { }

  async ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPasssword: ['', Validators.required],
      reEnterPassword: ['', Validators.required]
    });
    this.user = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + this.user.userType;
  }

  async changePassword() {
    const loader = await this.widgetUtil.showLoader('Please wait...', 2000);
    if (this.changePasswordForm.value.reEnterPassword.trim() === this.changePasswordForm.value.newPasssword.trim()) {
      let data = {
        currentPassword: this.changePasswordForm.value.oldPassword.trim(),
        newPassword: this.changePasswordForm.value.newPasssword.trim(),
        userId: this.user._id
      }
      this.dashboardService.changePassword(data).subscribe((result) => {
        loader.dismiss();
        this.widgetUtil.presentToast(CONSTANTS.PASSWORD_CHANGE_SUCCESS)
        setTimeout(() => {
          this.logout()
        }, 1500)
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE)
        } else {

          this.widgetUtil.presentToast(CONSTANTS.INCORRECT_PASSWORD)
        }
        loader.dismiss();
      })
    } else {
      loader.dismiss();
      this.widgetUtil.presentToast(CONSTANTS.PASSWORD_MISMTACH)
    }
  }


  async logout() {
    this.storageService.clearStorage();
    localStorage.clear();
    this.navCtr.navigateRoot('/auth');
  }
}
