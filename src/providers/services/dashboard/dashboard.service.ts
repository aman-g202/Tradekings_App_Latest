import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StorageServiceProvider } from '../storage/storage.service';
import { ProfileModel } from '../../models/profile.model';

@Injectable()
export class DashboardService {

  constructor(
    private httpClient: HttpClient,
    private storgeService: StorageServiceProvider
  ) { }

  async isAuthorized() {
    const loggedInUser: ProfileModel = await this.storgeService.getFromStorage('profile') as ProfileModel;
    if (loggedInUser.isAuthorized) {
      return true;
    } else {
        return false;
    }
}

  getDashboardData(customerCode: string) {
    const data = { externalId: customerCode };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getDashboard, { params: data });
  }
}
