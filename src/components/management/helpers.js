// Pure helpers shared across the Management Dashboard split-out components.
// No React/JSX here — safe to import from anywhere without pulling extra weight.

export const getUnitData = (unit) => {
  if (typeof unit === 'object' && unit !== null) {
    const type = unit.type || 'flat';
    const sizeStr = unit.sizeSqft ? `${unit.sizeSqft} বর্গফুট` : '';
    const fallbackName = `${unit.floor ? unit.floor + ', ' : ''}${unit.unitNo || ''}${sizeStr ? ' (' + sizeStr + ')' : ''}`;
    const landNum = Number(unit.landPrice) || 0;
    const constrNum = Number(unit.constructionPrice) || 0;
    const priceNum = Number(unit.price) || (landNum + constrNum > 0 ? landNum + constrNum : 0);

    return {
      id: unit.id || `u-${unit.unitNo || Math.random().toString(36).substr(2, 6)}`,
      name: unit.name || fallbackName,
      unitNo: unit.unitNo || unit.name || '',
      type,
      floor: unit.floor || '',
      sizeSqft: unit.sizeSqft || '',
      beds: unit.beds || '',
      baths: unit.baths || '',
      packageIncludes: unit.packageIncludes || 'ফ্ল্যাট + ল্যান্ড শেয়ার',
      hasParking: Boolean(unit.hasParking),
      landPrice: landNum,
      constructionPrice: constrNum,
      price: priceNum,
      notes: unit.notes || '',
      status: unit.status || 'available'
    };
  }
  const str = String(unit || '');
  let type = 'flat';
  if (str.includes('দোকান') || str.includes('শপ') || str.includes('বাণিজ্যিক')) {
    type = 'shop';
  } else if (str.includes('পার্কিং')) {
    type = 'parking';
  } else if (str.includes('শেয়ার') || str.includes('শেয়ার')) {
    type = 'share';
  }

  const sizeMatch = str.match(/\(([^)]+)\)/);
  const size = sizeMatch ? sizeMatch[1].replace('বর্গফুট', '').replace('Sq. Ft.', '').trim() : '';

  return {
    id: `str-${str}`,
    name: str,
    unitNo: str,
    type,
    floor: str.split(',')[0]?.trim() || '',
    sizeSqft: size,
    beds: '',
    baths: '',
    packageIncludes: 'ফ্ল্যাট + ল্যান্ড শেয়ার',
    hasParking: str.includes('পার্কিং সহ'),
    landPrice: 0,
    constructionPrice: 0,
    price: 0,
    notes: '',
    status: 'available'
  };
};
