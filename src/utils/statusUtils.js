/**
 * Shared status badge utilities used across Dashboard, Kampagnen, and Leads views
 */

/** Map campaign/integration status to badge variant */
export const getCampaignStatusVariant = (status) => {
  const map = {
    'Aktiv': 'success',
    'Pausiert': 'warning',
    'Prüfung': 'info'
  };
  return map[status] || 'neutral';
};

/** Map lead quality to badge info */
export const getLeadQualityBadge = (status) => {
  const map = {
    'hoch': { class: 'success', label: 'Hoch', color: 'var(--success)' },
    'mittel': { class: 'warning', label: 'Mittel', color: 'var(--warning)' },
    'niedrig': { class: 'danger', label: 'Niedrig', color: 'var(--danger)' }
  };
  return map[status] || { class: 'neutral', label: status, color: 'var(--slate-400)' };
};
