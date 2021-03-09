import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getDashboardData(customerCode: string) {
    const data = { externalId: customerCode };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getDashboard, { params: data });
  }

  changePassword(data: Object): any {
    return this.httpClient.post(environment.baseUrl + 'api/user/changePassword', data)
  }
}
