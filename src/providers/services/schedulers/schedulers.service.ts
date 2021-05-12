import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulersService {

  constructor(
   private httpClient: HttpClient
  ) { }

  updateProductInMongo() {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.updateProductInMongo, {});
  }

  updateProductStatInEP() {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.updateProductStatInERP, {});
  }

  updateCustomerInMong() {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.updateCustomerInMongo, {});
  }

  updateCustomerStatInRP() {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.updateCustomerStatInERP, {});
  }

  createNewCustomerInMngo() {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.createNewCustomerInMongo, {});
  }

  createNewProductInMogo() {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.createNewProductInMongo, {});
  }

  updateParentIdInUserDoc() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateParentIdInUserDoc, {});
  }

  updateUserDashboardData() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateUserDashboardData, {});
  }

  updateNonCustomerDashboardData() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateNonCustomerDashboardData, {});
  }

  updateAssociatedSMListToMongo() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateAssociatedSMListToMongo, {});
  }

  createCustomerStatements() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.createCustomerStatements, {});
  }

  createCustomerPendingInvoice() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.createCustomerPendingInvoice, {});
  }

  createCustomerInvoiceAgainstOrder() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.createCustomerInvoiceAgainstOrder, {});
  }

  storeInProgressOrderInErp() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.storeInProgressOrderInErp, {});
  }

  updateOrderStatusToBilled() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateOrderStatusToBilled, {});
  }
// reports api
  updateInvoiceOrderGap() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateInvoiceOrderGap , {});
  }

  updateCustomerPerformance() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateCustomerPerformance, {});
  }

  updateSkuPerformance() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateSkuPerformance, {});
  }

  updateVanPerformance() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.updateVanPerformance, {});
  }


}
