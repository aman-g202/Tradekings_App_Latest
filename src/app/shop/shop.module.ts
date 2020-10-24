import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';
import { ParentCategoryPage } from './parent-category/parent-category.page';
import { ChildCategoryPage } from './child-category/child-category.page';
import { ProductPage } from './product/product.page';
import { ProductService } from '../../providers/services/products/products.service';
import { CategoriesService } from '../../providers/services/categories/categories.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule
  ],
  declarations: [ParentCategoryPage, ChildCategoryPage, ProductPage],
  providers: [ProductService, CategoriesService]
})
export class ShopPageModule {}
