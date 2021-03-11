import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class CategoriesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getParentCategoryList(skip: number, limit: number): any {
    const data = { skip: skip.toString(), limit: limit.toString() };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getParentCategory, { params: data });
  }

  getChildCategoryList(parentCategoryId: string, skip: number, limit: number): any {
    const data = { skip: skip.toString(), limit: limit.toString() };
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getChildCategory + parentCategoryId, { params: data });
  }

  getChildCategoryForAddProduct() {
    return this.httpClient.get(environment.baseUrl + environment.endPoints.getChildCategory);
  }

  addProduct(productDetail: {
    name: string,
    price: number,
    productCode: string,
    priceType: string,
    packType: string,
    productSysCode: string,
    currentCaseSize: string,
    categoryId: string,
    parentCategoryId: string,
    lastUpdatedAt: number
  }){
    return this.httpClient.post(environment.baseUrl + environment.endPoints.appProduct, productDetail);
  }
}
