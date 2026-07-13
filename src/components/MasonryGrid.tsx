import { useMemo } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

import { ProductCard } from "@/src/components/ProductCard";
import type { Product } from "@/src/types/product";

interface MasonryGridProps {
  products: Product[];
  onSavePress: (id: string) => void;
}

export function MasonryGrid({ products, onSavePress }: MasonryGridProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 16;
  const gap = 12;
  const columnWidth = (width - horizontalPadding * 2 - gap) / 2;

  const { leftColumn, rightColumn } = useMemo(() => {
    const left: Product[] = [];
    const right: Product[] = [];

    products.forEach((product, index) => {
      if (index % 2 === 0) {
        left.push(product);
      } else {
        right.push(product);
      }
    });

    return { leftColumn: left, rightColumn: right };
  }, [products]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="px-4 pb-8 pt-2"
    >
      <View className="flex-row" style={{ gap }}>
        <View style={{ width: columnWidth }}>
          {leftColumn.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              columnWidth={columnWidth}
              onSavePress={onSavePress}
            />
          ))}
        </View>
        <View style={{ width: columnWidth }}>
          {rightColumn.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              columnWidth={columnWidth}
              onSavePress={onSavePress}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
