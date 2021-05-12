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
    getOrderListByProvince: 'api/order/list/province/',
    getOrderListForSalesman: 'api/order/list/associated/user/',
    getAllOrderList: 'api/order/list/',
    getProductList: 'api/product/list/category/',
    searchProductInParentCategory: 'api/product/search/parentCategory/',
    submitOrder: 'api/order/',
    createPayment: 'api/user/create/payment',
    getPaymentHistory: 'api/user/payment/history',
    getPaymentHistoryForSm: 'api/user/list/payments/SM',
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
    getUnitSizeList: 'api/product/list/unitsize',
    getCaptureProductList: 'api/product/list/unitsize/products',
    captureProduct: 'api/order/capture/price',
    createOrderToErp: 'api/erp/createOrderToERP',
    createEditOrderToErp: 'api/erp/createEditedOrderToERP',
    updateProduct: 'api/product/update',
    getPriceExecutiveDashboardData: 'api/user/priceExecutive/dashboard',
    getPendingInvoiceData: 'api/user/customer/pendinginvoice',
    createUser: 'api/user/',
    // oracles endpoint
    updateProductInMongo: 'api/erp/update/product/mongo',
    updateProductStatInERP: 'api/erp/update/product/erp',
    updateCustomerInMongo: 'api/erp/update/customer/mongo',
    updateCustomerStatInERP: 'api/erp/update/customer/erp',
    createNewCustomerInMongo: 'api/erp/create/new/customer/mongo',
    createNewProductInMongo: 'api/erp/create/new/product/mongo',
    updateParentIdInUserDoc: 'api/erp/update/parent/mongo',
    updateUserDashboardData: 'api/erp/update/dashboard/data',
    updateNonCustomerDashboardData: 'api/erp/update/noncustomer/dashboard/data',
    updateAssociatedSMListToMongo: 'api/erp/update/associated/sm/mongo',
    storeInProgressOrderInErp: 'api/erp/store/inprogress/order/to/erp',
    updateOrderStatusToBilled: 'api/erp/update/order/status/billed/mongo',
    createCustomerStatements: 'api/erp/create/customer/statements',
    createCustomerPendingInvoice: 'api/erp/create/customer/pendinginvoice',
    createCustomerInvoiceAgainstOrder: 'api/erp/customer/report/invoiceagainstorder',
    updateInvoiceOrderGap: 'api/erp/customer/report/invoiceagainstorder',
    updateCustomerPerformance: 'api/erp/customer/report/customerperformance',
    updateSkuPerformance: 'api/erp/customer/report/skuperformance',
    updateVanPerformance: 'api/erp/customer/report/vanperformance',

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
