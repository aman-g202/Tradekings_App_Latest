import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AddCategoryPage } from './admin/add-category/add-category.page';
import { AddProductPage } from './admin/add-product/add-product.page';
import { AddTKProductPage } from './admin/add-tk-product/add-tk-product.page';
import { AddUserPage } from './admin/add-user/add-user.page';

import { AuthPage } from './auth/auth.page';
import { SelectCustomerPage } from './select-customer/select-customer.page';
import { AddPaymentPage } from './shared/add-payment/add-payment.page';
import { CartPage } from './shared/cart/cart.page';
import { ChangePasswordPage } from './shared/change-password/change-password.page';
import { DashboardPage } from './shared/dashboard/dashboard.page';
import { EditUserPage } from './shared/edit-user/edit-user.page';
import { PaymentHistoryPage } from './shared/payment-history/payment-history.page';
import { UserListPage } from './shared/user-list/user-list.page';
import { ViewStatementPage } from './shared/view-statement/view-statement.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'auth',
    component: AuthPage
  },
  {
    path: 'dashboard/:userType',
    component: DashboardPage
  },
  {
    path: 'payment-history',
    component: PaymentHistoryPage
  },
  {
    path: 'add-payment',
    component: AddPaymentPage
  },
  {
    path: 'edit-user',
    component: EditUserPage
  },
  {
    path: 'change-password',
    component: ChangePasswordPage
  },
  {
    path: 'select-customer',
    component: SelectCustomerPage
  },
  {
    path: 'user-list/:id',
    component: UserListPage
  },
  {
    path: 'cart',
    component: CartPage
  },
  {
    path: 'view-statement',
    component: ViewStatementPage
  },
  {
    path: 'admin/add-user',
    component: AddUserPage
  },
  {
    path: 'admin/add-category',
    component: AddCategoryPage
  },
  {
    path: 'admin/add-product',
    component: AddProductPage
  },
  {
    path: 'admin/add-tk-product',
    component: AddTKProductPage
  },
  {
    path: 'admin/add-comp-product',
    loadChildren: () => import('./admin/add-comp-product/add-comp-product.module').then( m => m.AddCOMPProductPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'capture-price',
    loadChildren: () => import('./price-capturing/price-capturing.module').then( m => m.PriceCapturingPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
