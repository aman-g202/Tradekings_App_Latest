import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthPage } from './auth/auth.page';
import { DashboardPage } from './shared/dashboard/dashboard.page';
import { NavigationDrawerPage } from './shared/navigation-drawer/navigation-drawer.page';
import { PaymentHistoryPage } from './shared/payment-history/payment-history.page';
import { AddPaymentPage } from './shared/add-payment/add-payment.page';
import { CapturePricePage } from './shared/capture-price/capture-price.page';
import { ChangePasswordPage } from './shared/change-password/change-password.page';
import { EditUserPage } from './shared/edit-user/edit-user.page';
import { UserListPage } from './shared/user-list/user-list.page';
import { SelectCustomerPage } from './select-customer/select-customer.page';
import { CartPage } from './shared/cart/cart.page';
import { CategoryTotalModalPage } from './shared/category-total-modal/category-total-modal.page';
import { ViewStatementPage } from './shared/view-statement/view-statement.page';
import { AddUserPage } from './admin/add-user/add-user.page';
import { AddCategoryPage } from './admin/add-category/add-category.page';
import { AddProductPage } from './admin/add-product/add-product.page';
import { AddTKProductPage } from './admin/add-tk-product/add-tk-product.page';
import { TokenInterceptor } from '../../src/providers/interceptors/http.interceptor';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { PopoverComponent } from './shared/popover/popover.component';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@NgModule({
  declarations: [
    AppComponent,
    AuthPage,
    DashboardPage,
    NavigationDrawerPage,
    PaymentHistoryPage,
    AddPaymentPage,
    CapturePricePage,
    ChangePasswordPage,
    EditUserPage,
    UserListPage,
    SelectCustomerPage,
    CartPage,
    CategoryTotalModalPage,
    ViewStatementPage,
    AddUserPage,
    AddCategoryPage,
    AddProductPage,
    AddTKProductPage,
    SideBarComponent,
    PopoverComponent
  ],
  entryComponents: [CategoryTotalModalPage, SideBarComponent, PopoverComponent],
  imports: [BrowserModule, CommonModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule,
    IonicStorageModule.forRoot(
      {
        name: '__tradekings',
        driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
      }
    ),
  ],
  providers: [
    StatusBar,
    File,
    SocialSharing,
    FileOpener,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
