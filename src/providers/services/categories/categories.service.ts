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

  addTkProduct(tkProduct: {
    categoryName: string,
    product: {
      brand: string,
      masterName: string,
      caseSize: string,
      masterCode: string,
      productCategory: string,
      productCode: string,
      productName: string,
      subCategory: string,
      unitSize: string,
      isTkProduct: string,
      competitiveProduct: any[]
    }
  }): any {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.appTkProduct, tkProduct);
  }
}
