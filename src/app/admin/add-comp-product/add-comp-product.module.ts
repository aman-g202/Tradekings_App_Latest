import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCOMPProductPageRoutingModule } from './add-comp-product-routing.module';
import { TkProductsPage } from './tk-products/tk-products.page';
import { CompProductPage } from './comp-product/comp-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCOMPProductPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TkProductsPage, CompProductPage]
})
export class AddCOMPProductPageModule { }
