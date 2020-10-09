import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditOrderPage } from './edit-order/edit-order.page';
import { OrderDetailPage } from './order-detail/order-detail.page';
import { OrdersPage } from './orders.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  },
  {
    path: 'order-detail',
    component: OrderDetailPage
  },
  {
    path: 'edit-order',
    component: EditOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule {}
