/**
 * Shared address parsing for lead availability checks.
 * Used in LeadsList and LeadDetail.
 */

/**
 * Parse a lead's customer data into a structured address object.
 * @param {Object} customer - The customer object from lead.originalData
 * @returns {Object|null} Parsed address or null if unparsable
 */
export const parseCustomerAddress = (customer) => {
  if (!customer) return null;

  // Parse string address like "Hauptstraße 45, 78462 Konstanz"
  if (typeof customer.address === 'string' && customer.address.trim()) {
    const parts = customer.address.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      const streetMatch = parts[0].match(/^(.+?)\s+(\d+\w*)$/);
      const cityMatch = parts[1].match(/^(\d{5})\s+(.+)$/);
      if (streetMatch && cityMatch) {
        return {
          street: streetMatch[1],
          houseNumber: streetMatch[2],
          postalCode: cityMatch[1],
          city: cityMatch[2]
        };
      }
    }
  }

  // Handle address as object
  if (typeof customer.address === 'object' && customer.address) {
    return customer.address;
  }

  // Fallback to structured fields
  if (customer.postalCode || customer.street) {
    return {
      street: customer.street || '',
      houseNumber: customer.houseNumber || '',
      postalCode: customer.postalCode || '',
      city: customer.city || ''
    };
  }

  return null;
};
