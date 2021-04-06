import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceCapturingRoutingModule } from './price-capturing-routing.module';
import { CaptureDetailsPage } from './capture-details/capture-details.page';
import { ParentCategoryPage } from '../price-capturing/parent-category/parent-category.page';
import { ChildCategoryPage } from '../price-capturing/child-category/child-category.page';
import { PriceCapturingProductListPage } from './price-capturing-product-list/price-capturing-product-list.page';
import { PriceCapturingReviewPage } from './price-capturing-review/price-capturing-review.page';
import { UnitSizeListPage } from './unit-size-list/unit-size-list.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';





@NgModule({
  imports: [
    CommonModule,
    PriceCapturingRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CaptureDetailsPage,
    ParentCategoryPage,
    ChildCategoryPage,
    PriceCapturingProductListPage,
    PriceCapturingReviewPage,
    UnitSizeListPage

  ],
  providers: []
})
export class PriceCapturingPageModule { }
