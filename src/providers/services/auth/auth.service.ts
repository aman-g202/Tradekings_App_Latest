import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) {}

  login (data : FormData) {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.login, data)
  }
}
