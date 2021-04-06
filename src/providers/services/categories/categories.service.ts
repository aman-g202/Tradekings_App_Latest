import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CategoryItemModel } from '../../models/category.model';

@Injectable({providedIn: 'root'})
export class CategoriesService {
  parentCategoryList: CategoryItemModel [] = [];

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

  addCategory(categoryDetails: {name: string, lastUpdatedAt: number, parentCategoryId: string, type: string}) {
    return this.httpClient.post(environment.baseUrl + environment.endPoints.addCategories, categoryDetails);
  }

  setParentCat(value: any): void {
    this.parentCategoryList = value;
  }

  getParentCat() {
    return this.parentCategoryList;
  }
}
