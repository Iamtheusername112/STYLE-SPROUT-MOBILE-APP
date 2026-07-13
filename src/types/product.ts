export interface Product {
  id: string;
  title: string;
  sheinImageUrl: string;
  affiliateUrl: string;
  price: number;
  description: string;
  isSaved: boolean;
  category: string;
  aspectRatio: number;
  savedAt?: number;
  isPremiumDrop?: boolean;
}

export interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  toggleSaveProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getSavedProducts: () => Product[];
}
