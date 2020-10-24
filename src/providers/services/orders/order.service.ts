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
}
