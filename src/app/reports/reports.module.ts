import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { CustomerPerformancePage } from './customer-performance/customer-performance.page';
import { SkuPerformancePage } from './sku-performance/sku-performance.page';
import { VanPerformancePage } from './van-performance/van-performance.page';
import { PriceListPage } from './price-list/price-list.page';
import { ReportService } from 'src/providers/services/reports/reports.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule
  ],
  declarations: [ReportsPage, CustomerPerformancePage, SkuPerformancePage, VanPerformancePage, PriceListPage],
  providers: [ReportService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ReportsPageModule {}
