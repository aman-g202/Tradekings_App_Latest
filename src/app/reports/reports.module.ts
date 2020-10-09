import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { CustomerPerformancePage } from './customer-performance/customer-performance.page';
import { SkuPerformancePage } from './sku-performance/sku-performance.page';
import { VanPerformancePage } from './van-performance/van-performance.page';
import { PriceListPage } from './price-list/price-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule
  ],
  declarations: [ReportsPage, CustomerPerformancePage, SkuPerformancePage, VanPerformancePage, PriceListPage]
})
export class ReportsPageModule {}
