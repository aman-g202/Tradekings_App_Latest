import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChildCategoryPage } from './child-category/child-category.page';
import { ParentCategoryPage } from './parent-category/parent-category.page';
import { ProductPage } from './product/product.page';
import { EditProductPage } from './edit-product/edit-product.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'parent-category'
  },
  {
    path: 'parent-category',
    component: ParentCategoryPage
  },
  {
    path: 'child-category',
    component: ChildCategoryPage
  },
  {
    path: 'product',
    component: ProductPage
  },
  {
    path: 'edit-product',
    component: EditProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopPageRoutingModule {}
