import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getParentCategoryList(skip: number, limit: number): any {
    const data = { skip: skip.toString(), limit: limit.toString() };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getParentCategory, { params: data });
  }

  getChildCategoryList (parentCategoryId: string, skip:number, limit:number): any {
    const data = { skip: skip.toString(), limit: limit.toString() };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getChildCategory + parentCategoryId, {params: data})
  }

  getProductListByCategory (categoryId: string, skip:number, limit:number): any {
    const data = { skip: skip.toString(), limit: limit.toString() };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getProductList + categoryId, {params: data})
  }

  searchProductInParentCategory (skip: number, limit:number, parentCategoryId: string, keyword: string): any {
    const data = { skip: skip.toString(), limit: limit.toString(), keyword: keyword };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.searchProductInParentCategory + parentCategoryId, {params: data})
  }
}
