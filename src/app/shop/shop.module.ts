import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';
import { ParentCategoryPage } from './parent-category/parent-category.page';
import { ChildCategoryPage } from './child-category/child-category.page';
import { ProductPage } from './product/product.page';
import { ProductService } from '../../providers/services/products/products.service';
import { EditProductPage } from './edit-product/edit-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ShopPageRoutingModule
  ],
  declarations: [ParentCategoryPage, ChildCategoryPage, ProductPage, EditProductPage],
  providers: [ProductService]
})
export class ShopPageModule {}
