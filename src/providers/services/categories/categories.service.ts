import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CategoriesService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getParentCategoryList (skip: number, limit:number): any {
    let data = {skip: skip.toString(), limit: limit.toString()}
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getParentCategory, {params: data})
  }
}
