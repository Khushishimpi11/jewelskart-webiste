export interface CoupleRingPrices {
  womenPrice: number;
  menPrice: number;
  bothPrice: number;
  womenWeight?: number;
  menWeight?: number;
}

/**
 * Check if a product is a Couple Ring
 */
export const isCoupleRingProduct = (prod?: any): boolean => {
  if (!prod) return false;
  const cat = typeof prod.category === 'string'
    ? prod.category
    : (prod.category?.name || prod.categoryName || '');
  const lowerCat = cat.toLowerCase().trim().replace(/[-_]/g, ' ');
  const pName = (prod.name || '').toLowerCase().trim();

  const isCatCouple = lowerCat === 'couple ring' || lowerCat === 'couple rings' || lowerCat.includes('couple ring');
  const isNameCouple = pName.includes('couple ring') || pName.includes('couple set');
  const hasCoupleRingDetails = !!(prod.coupleRing && (prod.coupleRing.womenPrice || prod.coupleRing.menPrice));

  return isCatCouple || isNameCouple || hasCoupleRingDetails;
};

/**
 * Extract / calculate Couple Ring prices
 */
export const getCoupleRingPrices = (prod?: any): CoupleRingPrices => {
  if (!prod) return { womenPrice: 0, menPrice: 0, bothPrice: 0 };
  const cr = prod.coupleRing || prod.specifications?.coupleRing || {};
  let womenPrice = Number(cr.womenPrice || 0);
  let menPrice = Number(cr.menPrice || 0);
  const womenWeight = Number(cr.womenWeight || 0);
  const menWeight = Number(cr.menWeight || 0);

  if (!womenPrice && !menPrice) {
    const base = Number(prod.price || 0);
    womenPrice = Math.round(base * 0.45);
    menPrice = Math.round(base * 0.55);
  } else if (!womenPrice && menPrice > 0) {
    womenPrice = menPrice;
  } else if (!menPrice && womenPrice > 0) {
    menPrice = womenPrice;
  }

  const bothPrice = (womenPrice + menPrice) > 0 ? (womenPrice + menPrice) : Number(prod.price || 0);
  return {
    womenPrice,
    menPrice,
    bothPrice,
    womenWeight,
    menWeight,
  };
};
