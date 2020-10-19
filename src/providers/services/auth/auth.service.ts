import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) {}

  login (data) : any {
    return this.httpClient.post(environment.baseUrl + 'api/user/authenticate', data)
  }
}
