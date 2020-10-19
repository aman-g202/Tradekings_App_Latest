import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class CategoriesService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getParentCategoryList (skip: number, limit:number): any {
    return this.httpClient.get(environment.baseUrl + 'api/category/list/parent?skip='+skip.toString() + "&limit="+ limit.toString())
  }
}
