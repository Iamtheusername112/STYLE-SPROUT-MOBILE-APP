import type { Product } from "@/src/types/product";

const SHEIN_BASE = "https://www.shein.com";

export const MOCK_PRODUCTS: Omit<Product, "isSaved">[] = [
  {
    id: "ss-001",
    title: "Linen Blend Wide-Leg Trousers",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/linen-wide-leg`,
    price: 24.99,
    description:
      "Effortless summer tailoring in breathable linen blend. High-rise waist with flowing wide leg — pairs perfectly with crop tops and sandals.",
    category: "Bottoms",
    aspectRatio: 1.35,
  },
  {
    id: "ss-002",
    title: "Ribbed Knit Crop Top",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/ribbed-crop`,
    price: 12.99,
    description:
      "Soft ribbed knit with a flattering square neckline. Stretchy fit that moves with you — your go-to layer for brunch and beyond.",
    category: "Tops",
    aspectRatio: 1.15,
  },
  {
    id: "ss-003",
    title: "Oversized Blazer Dress",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/blazer-dress`,
    price: 39.99,
    description:
      "Power dressing redefined. Structured shoulders, cinched waist, and a midi length that transitions from desk to dinner seamlessly.",
    category: "Dresses",
    aspectRatio: 1.45,
  },
  {
    id: "ss-004",
    title: "Pleated Midi Skirt",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/pleated-midi`,
    price: 18.99,
    description:
      "Romantic pleats in a dreamy satin finish. Elastic waistband for all-day comfort with an elegant drape that catches every breeze.",
    category: "Bottoms",
    aspectRatio: 1.25,
  },
  {
    id: "ss-005",
    title: "Chunky Platform Loafers",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/platform-loafers`,
    price: 32.99,
    description:
      "Statement soles meet classic preppy style. Cushioned insole and anti-slip rubber outsole for comfort that lasts from morning to midnight.",
    category: "Shoes",
    aspectRatio: 1.1,
  },
  {
    id: "ss-006",
    title: "Sheer Mesh Layer Top",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/mesh-layer`,
    price: 14.99,
    description:
      "Delicate mesh overlay adds dimension to any outfit. Layer over a bralette or cami for an editorial, runway-inspired look.",
    category: "Tops",
    aspectRatio: 1.3,
  },
  {
    id: "ss-007",
    title: "High-Waist Denim Shorts",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/denim-shorts`,
    price: 16.99,
    description:
      "Vintage-wash denim with a flattering high-rise cut. Raw hem detail and classic five-pocket styling for timeless summer vibes.",
    category: "Bottoms",
    aspectRatio: 1.2,
  },
  {
    id: "ss-008",
    title: "Satin Slip Midi Dress",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/satin-slip`,
    price: 28.99,
    description:
      "Liquid satin skims the body in all the right places. Adjustable spaghetti straps and a subtle cowl neckline for understated glamour.",
    category: "Dresses",
    aspectRatio: 1.5,
  },
  {
    id: "ss-009",
    title: "Quilted Crossbody Bag",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/quilted-bag`,
    price: 22.99,
    description:
      "Iconic quilted texture with gold-tone chain strap. Compact yet spacious enough for essentials — the finishing touch to every outfit.",
    category: "Accessories",
    aspectRatio: 1.0,
  },
  {
    id: "ss-010",
    title: "Cable Knit Cardigan",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/cable-cardigan`,
    price: 26.99,
    description:
      "Cozy cable knit in a relaxed oversized fit. Button-front closure and deep pockets — the perfect transitional layer for cool evenings.",
    category: "Outerwear",
    aspectRatio: 1.35,
  },
  {
    id: "ss-011",
    title: "Floral Wrap Maxi Dress",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92d1?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/floral-maxi`,
    price: 34.99,
    description:
      "Blooming florals on flowing chiffon. Wrap silhouette with flutter sleeves — made for garden parties and golden hour strolls.",
    category: "Dresses",
    aspectRatio: 1.55,
  },
  {
    id: "ss-012",
    title: "Gold Hoop Earrings Set",
    sheinImageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    affiliateUrl: `${SHEIN_BASE}/affiliate/gold-hoops`,
    price: 8.99,
    description:
      "Three sizes of polished gold-tone hoops for every mood. Lightweight and hypoallergenic — stack, mix, or wear solo.",
    category: "Accessories",
    aspectRatio: 1.05,
  },
];
