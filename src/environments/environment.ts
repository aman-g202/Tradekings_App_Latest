// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://41.218.83.178:6002/',
  endPoints: {
    login: 'api/user/authenticate',
    getDashboard: 'api/user/get/dashboard',
    getParentCategory: 'api/category/list/parent',
    getChildCategory: 'api/category/list/child/',
    getOrderList: 'api/order/list/user/',
    getProductList: 'api/product/list/category/',
    searchProductInParentCategory: 'api/product/search/parentCategory/',
    submitOrder: 'api/order/',
    createPayment: 'api/user/create/payment',
    getPaymentHistory: 'api/user/payment/history',
    getOrderDetail: 'api/order/detail/',
    changeOrderStatus: 'api/order/status/',
    addCategories: 'api/category',
    getCustomerListBySalesman: 'api/user/list/associated/customer',
    getAllCustomerList: 'api/user/list/all/customer',
    getCustomerListByAdmin: 'api/user/list/customer',
    getCustomerListByProvince: 'api/user/list/by/province/customer',
    getAllSalesmanList: 'api/user/list/all/salesman',
    changePassword: 'api/user/changePassword',
    getCustomerStatement: 'api/user/customer/statements',
    getTkPruoduct: 'api/product/list/tk/products',
    addCompProduct: 'api/product/add/comp/product',
    appTkProduct: 'api/product/add/tk/product',
    appProduct: 'api/product',
    updateUser: 'api/user/update/user',
    resetPassword: 'api/user/resetPassword/',
    getProductByUnitSize: 'api/product/list/unitsize'
  },
  storageKeys: {}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
