import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getDashboardData (customerCode) {
    return this.httpClient.get(environment.baseUrl + 'api/user/get/dashboard?externalId='+customerCode.toString())
  }
}
