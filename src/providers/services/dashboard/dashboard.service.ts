import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StorageServiceProvider } from '../storage/storage.service';

@Injectable()
export class DashboardService {

  constructor(
    private httpClient: HttpClient,
    private strogeService: StorageServiceProvider
  ) { }

  async isAuthorized () {
    const loggedInUser: any = await this.strogeService.getFromStorage('profile')
    if (loggedInUser.isAuthorized) {
      return true
    } else {
        return false
    }
}

  getDashboardData(customerCode: string) {
    const data = { externalId: customerCode };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getDashboard, { params: data });
  }
}
