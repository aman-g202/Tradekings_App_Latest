import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getDashboardData(customerCode: string) {
    const data = { externalId: customerCode };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getDashboard, { params: data });
  }
}
