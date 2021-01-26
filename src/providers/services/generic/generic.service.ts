import { Injectable } from '@angular/core';
import { CategoriesService } from '../categories/categories.service';
@Injectable()
export class GenericService {
    parentCategories = [];

    constructor(private categoriesService: CategoriesService) { }

    getParentCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.categoriesService.getParentCategoryList(0, 20)
                .subscribe((res) => {
                    this.parentCategories = res.body;
                    resolve(this.parentCategories);
                }, err => {
                    console.error('Error while getting parent Categories: Generic Service ', err);
                    reject(err);
                });
        });
    }

    /** this function is responsible for calculating total of many fields present in cart */
    calculateTotalNetWeightAndTotalTk(cart) {
        let totalNetWeightLocal = 0;
        let totalTKLocal = 0;
        let orderTotal = 0;
        let totalQuantity = 0;
        const obj = {
                totalNetWeight: totalNetWeightLocal,
                totalTKPoint: totalTKLocal,
                orderTotal,
                totalQuantity
            };
        if (cart.length > 0) {
          cart.map((item) => {
            if (item.tkPoint) {
              totalTKLocal = totalTKLocal + (parseFloat(item.tkPoint) * parseInt(item.quantity));
            }
            if (item.netWeight) {
              totalNetWeightLocal = totalNetWeightLocal + (parseFloat(item.netWeight) * parseInt(item.quantity));
            }
            if (item.price && item.quantity) {
                orderTotal = orderTotal + (parseFloat(item.price) * parseInt(item.quantity));
                totalQuantity = totalQuantity + parseInt(item.quantity);
            }
          });
        }
        obj.totalNetWeight = Number((totalNetWeightLocal / 1000).toFixed(3));
        obj.totalTKPoint = totalTKLocal;
        obj.orderTotal = orderTotal;
        obj.totalQuantity = totalQuantity;
        return obj;
      }


}