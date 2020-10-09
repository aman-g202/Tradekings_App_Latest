import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPerformancePage } from './customer-performance/customer-performance.page';
import { PriceListPage } from './price-list/price-list.page';

import { ReportsPage } from './reports.page';
import { SkuPerformancePage } from './sku-performance/sku-performance.page';
import { VanPerformancePage } from './van-performance/van-performance.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  },
  {
    path: 'customer-performance',
    component: CustomerPerformancePage
  },
  {
    path: 'sku-performance',
    component: SkuPerformancePage
  },
  {
    path: 'van-performance',
    component: VanPerformancePage
  },
  {
    path: 'price-list',
    component: PriceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
