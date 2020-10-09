import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';
import { ParentCategoryPage } from './parent-category/parent-category.page';
import { ChildCategoryPage } from './child-category/child-category.page';
import { ProductPage } from './product/product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule
  ],
  declarations: [ParentCategoryPage, ChildCategoryPage, ProductPage]
})
export class ShopPageModule {}
