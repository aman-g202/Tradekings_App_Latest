import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class ProductService {
    constructor(
        private httpClient: HttpClient
    ) {}

    getProductListByCategory(categoryId: string, skip: number, limit: number): any {
        const data = { skip: skip.toString(), limit: limit.toString() };
        return this.httpClient.get(environment.baseUrl + environment.endPoints.getProductList + categoryId, { params: data });
    }

    searchProductInParentCategory(skip: number, limit: number, parentCategoryId: string, keyword: string): any {
        const data = { skip: skip.toString(), limit: limit.toString(), keyword };
        // tslint:disable-next-line: max-line-length
        return this.httpClient.get(environment.baseUrl + environment.endPoints.searchProductInParentCategory + parentCategoryId, { params: data });
    }
}
