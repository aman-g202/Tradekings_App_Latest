import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompProductPage } from './comp-product/comp-product.page';
import { TkProductsPage } from './tk-products/tk-products.page';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tklist'
  },
  {
    path: 'tklist',
    component: TkProductsPage
  },
  {
    path: 'comp-product',
    component: CompProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCOMPProductPageRoutingModule {}
