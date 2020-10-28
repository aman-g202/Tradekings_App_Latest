import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { OrderDetailPage } from './order-detail/order-detail.page';
import { EditOrderPage } from './edit-order/edit-order.page';
import { OrderService } from '../../providers/services/orders/order.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule
  ],
  declarations: [OrdersPage, OrderDetailPage, EditOrderPage],
  providers: [OrderService]
})
export class OrdersPageModule {}
