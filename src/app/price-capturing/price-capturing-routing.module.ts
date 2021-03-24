import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaptureDetailsPage } from './capture-details/capture-details.page';
import { ParentCategoryPage } from './parent-category/parent-category.page';
import { ChildCategoryPage } from './child-category/child-category.page';
import { UnitSizeListPage } from './unit-size-list/unit-size-list.page';
import { PriceCapturingProductListPage } from './price-capturing-product-list/price-capturing-product-list.page';
import { PriceCapturingReviewPage } from './price-capturing-review/price-capturing-review.page';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'capture-details'
    },
    {
        path: 'capture-details',
        component: CaptureDetailsPage
    },
    {
        path: 'parent-category',
        component: ParentCategoryPage
    },
    {
        path: 'child-category',
        component: ChildCategoryPage
    },
    {
        path: 'unit-size',
        component: UnitSizeListPage
    },
    {
        path: 'product-list',
        component: PriceCapturingProductListPage
    },
    {
        path: 'review',
        component: PriceCapturingReviewPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PriceCapturingRoutingModule { }

