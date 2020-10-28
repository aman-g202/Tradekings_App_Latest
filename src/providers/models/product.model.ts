export interface ProductModel {
    categoryId: string;
    currentCaseSize: string;
    inventoryDetails?: InventoryDetailModel[];
    lastUpdatedAt: number;
    name: string;
    netWeight: number;
    parentCategoryId: string;
    price: number | string;
    priceType: string;
    productCode: string;
    productSysCode: string;
    tkPoint: number;
    quantity?: number | string;
    _id: string;
}

interface InventoryDetailModel {
    inTransit: number;
    inventory: number;
    storeName: string;
}
