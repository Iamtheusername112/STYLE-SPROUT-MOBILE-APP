import { usePremiumGate } from "@/src/hooks/usePremiumGate";
import { useProductStore } from "@/src/store/useProductStore";

export function useSaveWithPremiumGate() {
  const {
    canSaveProduct,
    getSaveBlockReason,
    openPaywall,
    paywallModal,
    ...gate
  } = usePremiumGate();
  const toggleSaveProduct = useProductStore((state) => state.toggleSaveProduct);
  const getProductById = useProductStore((state) => state.getProductById);

  const handleSavePress = (id: string) => {
    const product = getProductById(id);
    if (!product) return;

    if (product.isSaved) {
      toggleSaveProduct(id);
      return;
    }

    const blockReason = getSaveBlockReason(product);
    if (blockReason) {
      openPaywall(blockReason, product);
      return;
    }

    if (canSaveProduct(product)) {
      toggleSaveProduct(id);
    }
  };

  return { handleSavePress, premiumModal: paywallModal, ...gate };
}
