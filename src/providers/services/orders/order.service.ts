import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getOrderListByUser(userId: string, skip: number, limit: number, isSalesman: any, salesmanCode: string): any {
    const data = { skip: skip.toString(), limit: limit.toString(), isSalesman, salesmanCode };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getOrderList + userId, { params: data });
  }

  calculateTotalNetWeightAndTotalTk (cart) {
    let totalNetWeightLocal = 0;
    let totalTKLocal = 0;
    let orderTotal = 0;
    let totalQuantity = 0;
    const obj = { 
            totalNetWeight: totalNetWeightLocal, 
            totalTKPoint: totalTKLocal, 
            orderTotal: orderTotal,
            totalQuantity: totalQuantity
        };
    if (cart.length > 0) {
      cart.map((item) => {
        if (item.tkPoint) {
          totalTKLocal = totalTKLocal + (parseFloat(item.tkPoint) * parseInt(item.quantity))
        }
        if (item.netWeight) {
          totalNetWeightLocal = totalNetWeightLocal + (parseFloat(item.netWeight) * parseInt(item.quantity))
        }
        if (item.price && item.quantity) {
            orderTotal = orderTotal + (parseFloat(item.price) * parseInt(item.quantity));
            totalQuantity = totalQuantity + parseInt(item.quantity);
        }
      })
    }
    obj.totalNetWeight = Number((totalNetWeightLocal/1000).toFixed(3));
    obj.totalTKPoint = totalTKLocal;
    obj.orderTotal = orderTotal;
    obj.totalQuantity = totalQuantity;
    return obj;
  }

  submitOrder (orderDetails: Object): any {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.submitOrder, orderDetails)
  }
}
