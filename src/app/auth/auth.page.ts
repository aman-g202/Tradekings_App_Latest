import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/services/auth/auth.service';
import { ToastController } from '@ionic/angular';
import { CONSTANTS } from '../../providers/utils/constants';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  providers: [AuthService]
})
export class AuthPage implements OnInit {
  loginForm: FormGroup;
  showLoginLoader : boolean = false;
  isActive:boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userLoginId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    this.showLoginLoader = true;
    console.log("============value", this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe((responseData: any) => {
      this.showLoginLoader = false;
      console.log(responseData);
      if (responseData.status === 200) { 
        localStorage.setItem('token', responseData.body[0].token)
        localStorage.setItem('profile', JSON.stringify(responseData.body[0]))
        localStorage.setItem('userType', responseData.body[0].userType)
        this.router.navigateByUrl('/dashboard');
      }
    }, (error:any) => {
      this.showLoginLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.presentToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.presentToast(CONSTANTS.AUTH_FAIL)
      }
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  showPassword (){
    this.isActive = !this.isActive; 
    console.log('pass-eye Clicked!')
    if(this.passwordFieldType === 'password')
      this.passwordFieldType = 'text';
    else
    this.passwordFieldType = 'password';
   }

}
