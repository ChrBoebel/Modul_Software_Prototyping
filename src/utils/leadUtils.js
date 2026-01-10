/**
 * Lead utility functions for transforming and formatting lead data
 */

// Map interest type codes to German product names
const produktMap = {
  'solar': 'Solar PV',
  'heatpump': 'Wärmepumpe',
  'charging_station': 'E-Mobilität',
  'energy_contract': 'Strom',
  'energy_storage': 'Speicher'
};

/**
 * Derive quality status from lead score
 * @param {number} score - Lead qualification score (0-100)
 * @returns {'hoch'|'mittel'|'niedrig'} Quality status
 */
export const getQualityStatus = (score) => {
  if (score >= 80) return 'hoch';
  if (score >= 50) return 'mittel';
  return 'niedrig';
};

// Alias for backwards compatibility
export const getAmpelStatus = getQualityStatus;

/**
 * Format ISO timestamp for German locale display
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date string (e.g., "16.01.2025 14:30")
 */
export const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '');
};

/**
 * Transform raw lead data (from leads.json or flow-generated) to display format
 * @param {Object} lead - Raw lead data
 * @returns {Object} Transformed lead for display
 */
export const transformLead = (lead) => {
  // Handle both leads.json format and flow-generated leads
  const score = lead.qualification?.score ?? lead.leadScore ?? 0;
  const interestType = lead.interest?.type || '';

  return {
    id: lead.id,
    leadId: lead.leadNumber || lead.leadId || lead.id,
    status: getAmpelStatus(score),
    leadScore: score,
    produkt: produktMap[interestType] || lead.produkt || 'Unbekannt',
    timestamp: formatTimestamp(lead.timestamp),
    name: lead.customer
      ? `${lead.customer.firstName || ''} ${lead.customer.lastName || ''}`.trim()
      : lead.name || 'Unbekannt',
    email: lead.customer?.email || lead.email || '',
    phone: lead.customer?.phone || lead.phone || '',
    zugewiesenAn: lead.assignedTo || 'Nicht zugewiesen',
    // Preserve original data for detail view
    originalData: lead
  };
};

/**
 * Get product name from interest type code
 * @param {string} interestType - Interest type code (e.g., 'solar')
 * @returns {string} German product name
 */
export const getProduktName = (interestType) => {
  return produktMap[interestType] || interestType || 'Unbekannt';
};

export default {
  transformLead,
  getQualityStatus,
  getAmpelStatus,
  formatTimestamp,
  getProduktName
};
