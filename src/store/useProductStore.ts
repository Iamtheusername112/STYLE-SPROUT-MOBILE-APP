import { create } from "zustand";

import { MOCK_PRODUCTS } from "@/src/constants/mockProducts";
import { PREMIUM_DROP_IDS } from "@/src/constants/premium";
import type { Product, ProductStore } from "@/src/types/product";

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 800));

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      await simulateNetworkDelay();
      const products: Product[] = MOCK_PRODUCTS.map((product) => ({
        ...product,
        isSaved: false,
        isPremiumDrop: PREMIUM_DROP_IDS.has(product.id),
      }));
      set({ products, isLoading: false });
    } catch {
      set({
        isLoading: false,
        error: "Unable to load outfits. Please pull to refresh.",
      });
    }
  },

  toggleSaveProduct: (id: string) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? {
              ...product,
              isSaved: !product.isSaved,
              savedAt: !product.isSaved ? Date.now() : undefined,
            }
          : product,
      ),
    }));
  },

  getProductById: (id: string) =>
    get().products.find((product) => product.id === id),

  getSavedProducts: () => get().products.filter((product) => product.isSaved),
}));
