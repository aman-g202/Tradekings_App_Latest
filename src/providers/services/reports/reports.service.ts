import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class ReportService {
    constructor(
        private http: HttpClient
    ) {}

    getCustomerPerformanceData (externalId: string): any {
        return this.http.get(environment.baseUrl + 'api/user/customer/report/performance?externalId=' + externalId);
      }
    
      getVANPerformanceData (externalId: string): any {
        return this.http.get(environment.baseUrl + 'api/user/van/report/performance?externalId=' + externalId);
      }
    
      getSKUPerformanceData (externalId: string): any {
        return this.http.get(environment.baseUrl + 'api/user/sku/report/performance?externalId=' + externalId);
      }

      getSKUPerformanceFilterData (filter: {externalId?: string, skip: string, limit: string, skuName?: string, categoryName?: string, searchQuery?: string }):any {
        return this.http.get(environment.baseUrl + 'api/user/filter/sku/report/performance', {params: filter});
       }

       downloadReport (type: string): any {
        return this.http.get(environment.baseUrl + `api/category/pricelist/download?type=${type}`,
          {
            responseType: 'blob'
          }
        )
      }

      getInvoiceAgainstOrderData (filter: {externalId?: any, skip: string, limit: string, fromDate?: string, throughDate?: string}): any {
        filter = JSON.parse(JSON.stringify(filter));
        return this.http.get(environment.baseUrl + 'api/user/customer/report/invoiceagainstorder', { params: filter });
      }
}
