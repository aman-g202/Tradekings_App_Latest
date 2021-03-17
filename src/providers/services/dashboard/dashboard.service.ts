import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { StorageServiceProvider } from '../storage/storage.service';
import { ProfileModel } from '../../models/profile.model';

@Injectable()
export class DashboardService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageServiceProvider
  ) { }
  
  async isAuthorized() {
    const loggedInUser: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    return  loggedInUser.isAuthorized;
  }

  async isAuthorized() {
    const loggedInUser: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    return loggedInUser.isAuthorized;
}

  getDashboardData(customerCode: string) {
    const data = { externalId: customerCode };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getDashboard, { params: data });
  }

  changePassword(data: { currentPassword: string, newPassword: string, userId: string }): any {
    return this.httpClient.post(environment.baseUrl + 'api/user/changePassword', data);
  }
}
