import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/services/auth/auth.service';
import { WidgetUtilService } from '../../providers/utils/widget';
import { CONSTANTS } from '../../providers/utils/constants';
import { StorageServiceProvider } from '../../providers/services/storage/storage.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  providers: [AuthService]
})
export class AuthPage implements OnInit {
  loginForm: FormGroup;
  showLoginLoader = false;
  isActive = false;
  passwordFieldType = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userLoginId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidEnter() {
    this.loginForm.reset();
  }

  login() {
    this.showLoginLoader = true;
    this.authService.login(this.loginForm.value).subscribe((responseData: any) => {
      this.showLoginLoader = false;
      if (responseData.status === 200) {
        this.storageService.setToStorage('token', responseData.body[0].token);
        this.storageService.setToStorage('profile', responseData.body[0]);
        this.storageService.setToStorage('userType', responseData.body[0].userType);
        localStorage.setItem('token', responseData.body[0].token);
        if (responseData.body[0].userLoginId === 'R0001'){
          this.router.navigateByUrl('/schedulers')
      } else {
        if (responseData.body[0].userType === 'PRICEEXECUTIVE') {
          this.router.navigateByUrl('/price-executive-dashboard/' + responseData.body[0].userType);
        } else {
          this.router.navigateByUrl('/dashboard/' + responseData.body[0].userType);
        }
      }
    }
    }, (error: any) => {
      this.showLoginLoader = false;
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.AUTH_FAIL);
      }
    });
  }



  showPassword() {
    this.isActive = !this.isActive;
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
    } else {
      this.passwordFieldType = 'password';
    }
  }

}
