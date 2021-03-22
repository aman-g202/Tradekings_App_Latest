export interface ProductModel {
    categoryId: string;
    currentCaseSize: string;
    inventoryDetails?: InventoryDetailModel[];
    lastUpdatedAt: number;
    name: string;
    productName: string;
    netWeight: number;
    parentCategoryId: string;
    price: number | string;
    productDetail?: ProductDetailModel;
    priceType: string;
    productCode: string;
    productSysCode: string;
    tkPoint: number;
    quantity?: number | string;
    subTotal: number | string;
    _id: string;
}

interface InventoryDetailModel {
    inTransit: number;
    inventory: number;
    storeName: string;
}
interface ProductDetailModel {
    name: string;
    productCode: string;
    price: number | string;
}
