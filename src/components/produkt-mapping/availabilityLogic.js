const toStringSafe = (value) => (value === null || value === undefined ? '' : String(value));

const normalizeGerman = (value) => toStringSafe(value)
  .trim()
  .toLowerCase()
  .replaceAll('ß', 'ss')
  .replaceAll('ä', 'ae')
  .replaceAll('ö', 'oe')
  .replaceAll('ü', 'ue');

const normalizeFreeText = (value) => normalizeGerman(value)
  .replaceAll(/[^a-z0-9 ]/g, ' ')
  .replaceAll(/\s+/g, ' ')
  .trim();

const normalizeStreet = (value) => {
  const normalized = normalizeFreeText(value);
  if (!normalized) return '';

  return normalized
    .replaceAll(/\bstr\b/g, 'strasse')
    .replaceAll(/\bstrasse\b/g, 'strasse')
    .trim();
};

const normalizePostalCode = (value) => normalizeFreeText(value).replaceAll(' ', '');

const extractHouseNumberInt = (value) => {
  const match = toStringSafe(value).trim().match(/\d+/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const isNonEmpty = (value) => Boolean(toStringSafe(value).trim());

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getRuleSpecificity = (rule) => {
  const typeScore = rule.type === 'street-range' ? 20 : rule.type === 'postal-code' ? 10 : 0;
  const postalScore = isNonEmpty(rule.postalCode) ? 5 : 0;
  const cityScore = isNonEmpty(rule.city) ? 2 : 0;
  const streetScore = isNonEmpty(rule.street) ? 3 : 0;
  const rangeScore = toNumberOrNull(rule.houseNumberFrom) !== null || toNumberOrNull(rule.houseNumberTo) !== null ? 1 : 0;

  return typeScore + postalScore + cityScore + streetScore + rangeScore;
};

const doesRuleMatchAddress = (rule, address) => {
  if (!rule?.active) return false;

  const addressPostalCode = normalizePostalCode(address?.postalCode);
  const addressCity = normalizeFreeText(address?.city);
  const addressStreet = normalizeStreet(address?.street);
  const addressHouseNumber = extractHouseNumberInt(address?.houseNumber);

  const rulePostalCode = normalizePostalCode(rule?.postalCode);
  const ruleCity = normalizeFreeText(rule?.city);
  const ruleStreet = normalizeStreet(rule?.street);

  if (isNonEmpty(rulePostalCode) && rulePostalCode !== addressPostalCode) return false;
  if (isNonEmpty(ruleCity) && ruleCity !== addressCity) return false;

  if (rule.type === 'postal-code') {
    return isNonEmpty(rulePostalCode);
  }

  if (rule.type === 'street-range') {
    if (!isNonEmpty(ruleStreet) || ruleStreet !== addressStreet) return false;

    const rawFrom = toNumberOrNull(rule.houseNumberFrom);
    const rawTo = toNumberOrNull(rule.houseNumberTo);
    if (rawFrom === null && rawTo === null) return true;
    if (addressHouseNumber === null) return false;

    const from = rawFrom === null ? Number.NEGATIVE_INFINITY : Math.min(rawFrom, rawTo ?? rawFrom);
    const to = rawTo === null ? Number.POSITIVE_INFINITY : Math.max(rawTo, rawFrom ?? rawTo);
    return addressHouseNumber >= from && addressHouseNumber <= to;
  }

  return false;
};

export const getAvailabilityForAddress = (address, { products = [], rules = [] } = {}) => {
  const productsById = new Map((products || []).map((product) => [product.id, product]));

  const matchedRules = (rules || [])
    .filter((rule) => doesRuleMatchAddress(rule, address))
    .sort((a, b) => {
      const prioA = Number(a.priority) || 0;
      const prioB = Number(b.priority) || 0;
      if (prioA !== prioB) return prioA - prioB;

      const specA = getRuleSpecificity(a);
      const specB = getRuleSpecificity(b);
      if (specA !== specB) return specA - specB;

      const createdA = Date.parse(a.createdAt || '') || 0;
      const createdB = Date.parse(b.createdAt || '') || 0;
      if (createdA !== createdB) return createdA - createdB;

      return toStringSafe(a.id).localeCompare(toStringSafe(b.id));
    });

  const availableProductIds = new Set();
  const appliedRules = [];

  for (const rule of matchedRules) {
    const beforeSize = availableProductIds.size;
    const productIds = Array.isArray(rule.productIds) ? rule.productIds : [];

    if (rule.effect === 'deny') {
      for (const productId of productIds) {
        availableProductIds.delete(productId);
      }
    } else {
      for (const productId of productIds) {
        availableProductIds.add(productId);
      }
    }

    if (availableProductIds.size !== beforeSize) {
      appliedRules.push(rule);
    }
  }

  const availableProducts = [...availableProductIds]
    .map((id) => productsById.get(id) || { id, name: id, active: false, missing: true })
    .filter((p) => p && (p.active !== false))
    .sort((a, b) => toStringSafe(a.name).localeCompare(toStringSafe(b.name)));

  return {
    isServiceable: availableProducts.length > 0,
    availableProductIds: [...availableProductIds],
    availableProducts,
    matchedRules,
    appliedRules
  };
};

export const formatRuleScope = (rule) => {
  if (!rule) return '';
  const postalCode = toStringSafe(rule.postalCode).trim();
  const city = toStringSafe(rule.city).trim();
  const street = toStringSafe(rule.street).trim();

  if (rule.type === 'postal-code') {
    return [postalCode && `PLZ ${postalCode}`, city].filter(Boolean).join(' ');
  }

  if (rule.type === 'street-range') {
    const from = toNumberOrNull(rule.houseNumberFrom);
    const to = toNumberOrNull(rule.houseNumberTo);
    const range = from === null && to === null
      ? ''
      : from !== null && to !== null
        ? `${Math.min(from, to)}–${Math.max(from, to)}`
        : from !== null
          ? `ab ${from}`
          : `bis ${to}`;

    const streetWithRange = [street, range].filter(Boolean).join(' ');
    const location = [postalCode, city].filter(Boolean).join(' ');
    return [streetWithRange, location].filter(Boolean).join(', ');
  }

  return '';
};

// Extract house number addition (e.g., "a", "b", "1/2" from "12a")
export const extractHouseNumberAddition = (value) => {
  const str = toStringSafe(value).trim();
  const match = str.match(/^\d+\s*(.*)$/);
  return match ? match[1].trim().toLowerCase() : '';
};

// Find matching address in stored addresses
export const findMatchingAddress = (inputAddress, addressRecords = []) => {
  const normalizedInput = {
    zip: normalizePostalCode(inputAddress?.postalCode),
    street: normalizeStreet(inputAddress?.street),
    housenumber_numeric: extractHouseNumberInt(inputAddress?.houseNumber),
    housenumber_addition: extractHouseNumberAddition(inputAddress?.houseNumber),
    city: normalizeFreeText(inputAddress?.city)
  };

  return addressRecords.find(addr => {
    const normalizedAddr = {
      zip: normalizePostalCode(addr?.zip),
      street: normalizeStreet(addr?.street),
      housenumber_numeric: addr?.housenumber_numeric,
      housenumber_addition: toStringSafe(addr?.housenumber_addition).trim().toLowerCase(),
      city: normalizeFreeText(addr?.city)
    };

    return normalizedAddr.zip === normalizedInput.zip &&
      normalizedAddr.street === normalizedInput.street &&
      normalizedAddr.housenumber_numeric === normalizedInput.housenumber_numeric &&
      normalizedAddr.housenumber_addition === normalizedInput.housenumber_addition;
  });
};

// Get direct availability for an address
export const getDirectAvailability = (address, { addresses = [], availability = [], availabilityStatus = [], products = [] } = {}) => {
  const matchedAddress = findMatchingAddress(address, addresses);

  if (!matchedAddress) {
    return {
      matchedAddress: null,
      directMappings: [],
      hasDirectMapping: false
    };
  }

  const statusById = new Map(availabilityStatus.map(s => [s.id, s]));
  const productsById = new Map(products.map(p => [p.id, p]));

  const directMappings = availability
    .filter(avail => avail.address_id === matchedAddress.id)
    .map(avail => ({
      availability: avail,
      product: productsById.get(avail.product_id) || { id: avail.product_id, name: avail.product_id, missing: true },
      status: statusById.get(avail.status_id) || { id: avail.status_id, value: 'unknown', key: 'UNKNOWN' }
    }))
    .sort((a, b) => toStringSafe(a.product.name).localeCompare(toStringSafe(b.product.name)));

  return {
    matchedAddress,
    directMappings,
    hasDirectMapping: directMappings.length > 0
  };
};

// Get combined availability (rules + direct mappings)
export const getCombinedAvailabilityForAddress = (address, options = {}) => {
  const { products = [], rules = [], addresses = [], availability = [], availabilityStatus = [] } = options;

  // Get rule-based availability
  const ruleBasedResult = getAvailabilityForAddress(address, { products, rules });

  // Get direct mappings
  const directResult = getDirectAvailability(address, { addresses, availability, availabilityStatus, products });

  // Create a map of direct mappings by product ID
  const directMappingsByProductId = new Map(
    directResult.directMappings.map(dm => [dm.product.id, dm])
  );

  // Merge results: direct mappings take precedence
  const combinedProducts = [];
  const processedProductIds = new Set();

  // First, add all direct mappings
  for (const dm of directResult.directMappings) {
    combinedProducts.push({
      product: dm.product,
      status: dm.status,
      source: 'direct',
      isAvailable: dm.status.value === 'available',
      isPlanned: dm.status.value === 'planned'
    });
    processedProductIds.add(dm.product.id);
  }

  // Then, add rule-based products that don't have direct mappings
  for (const product of ruleBasedResult.availableProducts) {
    if (!processedProductIds.has(product.id)) {
      combinedProducts.push({
        product,
        status: { id: 'rule-based', value: 'available', key: 'AVAILABLE', type: 'positive' },
        source: 'rule',
        isAvailable: true,
        isPlanned: false
      });
      processedProductIds.add(product.id);
    }
  }

  // Sort by product name
  combinedProducts.sort((a, b) => toStringSafe(a.product.name).localeCompare(toStringSafe(b.product.name)));

  const availableProducts = combinedProducts.filter(cp => cp.isAvailable || cp.isPlanned);

  return {
    isServiceable: availableProducts.length > 0,
    combinedProducts,
    availableProducts,
    ruleBasedResult,
    directResult,
    matchedAddress: directResult.matchedAddress,
    hasDirectMapping: directResult.hasDirectMapping
  };
};

// Status badge helpers
export const getStatusBadgeVariant = (statusValue) => {
  switch (statusValue) {
    case 'available': return 'success';
    case 'planned': return 'warning';
    case 'unavailable': return 'danger';
    default: return 'neutral';
  }
};

export const getStatusLabel = (statusValue) => {
  switch (statusValue) {
    case 'available': return 'Verfügbar';
    case 'planned': return 'Geplant';
    case 'unavailable': return 'Nicht verfügbar';
    default: return statusValue;
  }
};

// Helper to access product fields with backward compatibility
export const getProductField = (product, field) => {
  if (!product) return undefined;
  return product?.config?.[field] ?? product?.[field];
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';
  const housenumber = [address.housenumber, address.housenumber_addition].filter(Boolean).join('');
  const streetLine = [address.street, housenumber].filter(Boolean).join(' ');
  const cityLine = [address.zip, address.city].filter(Boolean).join(' ');
  return [streetLine, cityLine].filter(Boolean).join(', ');
};
