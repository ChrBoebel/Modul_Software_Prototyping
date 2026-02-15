import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getCampaignStatusVariant } from '../../../../utils/statusUtils';
import { theme } from '../../../../theme/colors';

const CampaignPerformanceTable = ({ campaigns, selectedCampaignId, setSelectedCampaignId }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Kampagnen Performance</h3>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Kampagne</th>
              <th>Status</th>
              <th>Leads</th>
              <th>Quali</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => {
              const isSelected = selectedCampaignId === camp.id;
              return (
                <tr
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(isSelected ? null : camp.id)}
                  style={{
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                    borderLeft: isSelected ? `3px solid ${theme.colors.primary}` : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--slate-50)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Kampagne ${camp.name} ${isSelected ? 'abwählen' : 'auswählen'} für Funnel-Anzeige`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCampaignId(isSelected ? null : camp.id);
                    }
                  }}
                >
                  <td className="font-bold text-sm">
                    {camp.name}
                    {isSelected && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.625rem',
                        color: theme.colors.primary,
                        fontWeight: 600
                      }}>
                        ● AKTIV
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getCampaignStatusVariant(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="text-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ minWidth: '28px' }}>{camp.leads30d}</span>
                      {/* Inline bar - Few's principle of embedded graphics */}
                      <div style={{
                        width: '40px',
                        height: '6px',
                        backgroundColor: 'var(--slate-100)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(100, (camp.leads30d / 250) * 100)}%`,
                          height: '100%',
                          backgroundColor: theme.colors.secondary,
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{camp.qualiQuote}</td>
                  <td>
                    {camp.trend === 'up' && (
                      <>
                        <ArrowUpRight size={16} style={{ color: theme.colors.success }} aria-hidden="true" />
                        <span className="sr-only">Steigend</span>
                      </>
                    )}
                    {camp.trend === 'down' && (
                      <>
                        <ArrowDownRight size={16} style={{ color: theme.colors.danger }} aria-hidden="true" />
                        <span className="sr-only">Fallend</span>
                      </>
                    )}
                    {camp.trend === 'stable' && (
                      <>
                        <span className="text-muted" aria-hidden="true">→</span>
                        <span className="sr-only">Stabil</span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignPerformanceTable;
