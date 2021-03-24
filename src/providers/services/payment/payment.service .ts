import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaymentService {
   constructor(
      private httpClient: HttpClient
   ) { }

   createPayment(data: any) {
      return this.httpClient.post(environment.baseUrl + environment.endPoints.createPayment, data );
   }

   getPaymentHistory(externalId) {
      const data = {externalId};
      return this.httpClient.get(environment.baseUrl + environment.endPoints.getPaymentHistory, {params: data} );
    }

    getCustomerStatement(externalId: string) {
       const data = {customerCode: externalId };
       return this.httpClient.get(environment.baseUrl + environment.endPoints.getCustomerStatement, {params: data});
    }
}
