import type { Product } from "@/src/types/product";

export interface ProductDeal {
  product: Product;
  salePrice: number;
  percentOff: number;
}

function hashId(id: string): number {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getProductDeal(product: Product): ProductDeal {
  const percentOff = 10 + (hashId(product.id) % 16);
  const salePrice = Number((product.price * (1 - percentOff / 100)).toFixed(2));

  return { product, salePrice, percentOff };
}

export function getDealAlerts(products: Product[]): ProductDeal[] {
  return products
    .filter((product) => product.isSaved)
    .map(getProductDeal)
    .sort((a, b) => b.percentOff - a.percentOff);
}
