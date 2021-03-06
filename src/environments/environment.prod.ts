export const environment = {
  production: true,
  baseUrl: 'http://41.218.83.178:3002/',
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
    changeOrderStatus: 'api/order/status/'
  },
  storageKeys: {}
};
