import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getCampaignStatusVariant } from '../../../../utils/statusUtils';

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
              const leadBarStyle = { width: `${Math.min(100, (camp.leads30d / 250) * 100)}%` };
              return (
                <tr
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(isSelected ? null : camp.id)}
                  className={`cursor-pointer transition-all bg-transparent border-l-[3px] border-l-transparent hover:bg-[var(--slate-50)] ${isSelected ? 'bg-[var(--primary-light)] border-l-[var(--primary)] hover:bg-[var(--primary-light)]' : ''}`}
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
                      <span className="ml-2 text-[0.625rem] text-[var(--primary)] font-semibold">
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
                    <div className="flex items-center gap-2">
                      <span className="min-w-[28px]">{camp.leads30d}</span>
                      {/* Inline bar - Few's principle of embedded graphics */}
                      <div className="w-10 h-1.5 bg-[var(--slate-100)] rounded-[3px] overflow-hidden">
                        <div
                          className="h-full bg-[var(--secondary)] rounded-[3px] transition-[width] duration-300"
                          style={leadBarStyle}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{camp.qualiQuote}</td>
                  <td>
                    {camp.trend === 'up' && (
                      <span className="text-[var(--success)]">
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="sr-only">Steigend</span>
                      </span>
                    )}
                    {camp.trend === 'down' && (
                      <span className="text-[var(--danger)]">
                        <ArrowDownRight size={16} aria-hidden="true" />
                        <span className="sr-only">Fallend</span>
                      </span>
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
