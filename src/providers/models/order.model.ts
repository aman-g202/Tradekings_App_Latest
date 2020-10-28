export interface OrderItemModel {
    lastUpdatedAt: number | string;
    orderId: string;
    orderTotal: number | string;
    productList: any[];
    province: string;
    salesmanCode: string;
    salesmanName: string;
    status: string;
    totalNetWeight: number;
    totalTkPoints: number;
    userDetail: {
        country: string,
        externalId: string,
        name: string,
        province: string,
        _id: string,
    };
    userId: string;
    _id: string;
}
