import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class ProductService {
    constructor(
        private httpClient: HttpClient
    ) { }

    getProductListByCategory(categoryId: string, skip: number, limit: number): any {
        const data = { skip: skip.toString(), limit: limit.toString() };
        return this.httpClient.get(environment.baseUrl + environment.endPoints.getProductList + categoryId, { params: data });
    }

    searchProductInParentCategory(skip: number, limit: number, parentCategoryId: string, keyword: string): any {
        const data = { skip: skip.toString(), limit: limit.toString(), keyword };
        // tslint:disable-next-line: max-line-length
        return this.httpClient.get(environment.baseUrl + environment.endPoints.searchProductInParentCategory + parentCategoryId, { params: data });
    }

    getTkProduct() {
        return this.httpClient.get(environment.baseUrl + environment.endPoints.getTkPruoduct);
    }

    addCompProduct(compProduct: {
        categoryName: string,
        masterCode: string,
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
            isTkProduct: string
        }
    }) {
        return this.httpClient.post(environment.baseUrl + environment.endPoints.addCompProduct, compProduct);
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
    }) {
        return this.httpClient.post(environment.baseUrl + environment.endPoints.appProduct, productDetail);
    }
}
