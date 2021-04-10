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


  getAllOrderList(skip: number, limit: number){
    const data = {skip: skip.toString(), limit: limit.toString()};
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getAllOrderList , {params: data});
  }

  getOrderListByProvince(province: string, skip: number, limit: number){
    const data = { skip: skip.toString(), limit: limit.toString()};
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getOrderListByProvince + province, {params: data});
  }

  getOrderListBySalesman(userId: string, skip: number, limit: number){
    const data = { skip: skip.toString(), limit: limit.toString()};
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getOrderListForSalesman + userId, {params: data});
  }


  calculateTotalNetWeightAndTotalTk(cart) {
    let totalNetWeightLocal = 0;
    let totalTKLocal = 0;
    let orderTotal = 0;
    let totalQuantity = 0;
    const obj = {
      totalNetWeight: totalNetWeightLocal,
      totalTKPoint: totalTKLocal,
      orderTotal,
      totalQuantity
    };

    if (cart.length > 0) {
      cart.map((item) => {
        if (item.tkPoint) {
          totalTKLocal = totalTKLocal + (parseFloat(item.tkPoint) * +item.quantity);
        }
        if (item.netWeight) {
          totalNetWeightLocal = totalNetWeightLocal + (parseFloat(item.netWeight) * +item.quantity);
        }
        if (item.price && item.quantity) {
          orderTotal = orderTotal + (parseFloat(item.price) * +item.quantity);
          totalQuantity = totalQuantity + +item.quantity;
        }
      });
    }
    obj.totalNetWeight = Number((totalNetWeightLocal / 1000).toFixed(3));
    obj.totalTKPoint = totalTKLocal;
    obj.orderTotal = orderTotal;
    obj.totalQuantity = totalQuantity;
    return obj;
  }

  submitOrder(orderDetails: any): any {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.submitOrder, orderDetails);
  }

  getOrderDetail(orderId: string): any {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getOrderDetail + orderId);
  }

  changeOrderStatus(orderId: string, statusObj: { status: string}): any {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.changeOrderStatus + orderId, statusObj);
  }

  createOrderToErp(orderId: string){
    return this.httpClient.post(environment.baseUrl + environment.endPoints.createOrderToErp, {_id: orderId});
  }

  createEditOrderToErp(editOrder: {
    lastUpdatedAt: string,
    orderId: string,
    orderTotal: string,
    productList: [
      {
        netWeight: number,
        parentCategoryId: string,
        price: string,
        productDetail: {
          _id: string,
          name: string,
          price: string | number,
          porductCode: string,
          productSysCode: string
        },
        productSysCode: string,
        quantity: number,
        subTotal: string | number,
        tkPoint: number
      }
    ],
    province: string,
    salesmanCode?: string,
    salesmanName?: string,
    status: string,
    totalNetWeight: number,
    totalTkPoint: number,
    userDetail: {
      name: string,
      _id: string,
      country: string,
      province: string,
      externalId: string
    },
    userId: string,
    _id: string
  }) {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.createEditOrderToErp, editOrder)
  }
}
