import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from '../../../environments/environment';

@Injectable ({providedIn: 'root'})
export class UserListService {

  constructor(private httpClient: HttpClient) { }

  getSalesmanCustomerList(externalId: any) {
    const data = {externalId};
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getCustomerListBySalesman, {params: data});
  }

  getAllCustomerList() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getAllCustomerList );
  }

  getCustomerList(skip: number, limit: number) {
    const data = {skip: skip.toString(), limit: limit.toString()};
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getCustomerListByAdmin, {params: data });
  }

  getCustomerByProvince(province: string) {
    const data = { province };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getCustomerListByProvince, {params: data});
  }

  getAllSalesmanList(){
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getAllSalesmanList);
  }

  updateUser(userDetails: {
     name: string,
     externalId: string,
     province: string,
     associatedSalesmanList: [],
     tkPoints: number,
     tkCurrency: number
  }): any {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.updateUser, userDetails);
  }

  resetPassword(externalId: string){
    return this.httpClient.post(environment.baseUrl + environment.endPoints.resetPassword + externalId, {});
  }
}
