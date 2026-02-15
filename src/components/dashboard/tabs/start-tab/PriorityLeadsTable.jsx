import { Avatar, ScoreBadge } from '../../../ui';

const PriorityLeadsTable = ({ priorityLeads, onNavigate, showToast }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Neueste Priorität-A Leads</h3>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Score</th>
              <th>Name</th>
              <th>Produkt</th>
              <th>Zeit</th>
            </tr>
          </thead>
          <tbody>
            {priorityLeads.map((lead) => (
              <tr
                key={lead.id}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('leads', { leadId: lead.numericId });
                  } else {
                    showToast(`Lead ${lead.id} öffnen`);
                  }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                tabIndex="0"
                role="button"
                aria-label={`Lead ${lead.name} öffnen`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onNavigate) {
                      onNavigate('leads', { leadId: lead.numericId });
                    } else {
                      showToast(`Lead ${lead.id} öffnen`);
                    }
                  }
                }}
              >
                <td>
                  <ScoreBadge
                    score={lead.score}
                    breakdown={lead.scoreBreakdown}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar
                      name={lead.name}
                      size="sm"
                      usePlaceholder
                      type={lead.customerType === 'business' ? 'company' : 'person'}
                    />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block' }}>{lead.name}</span>
                      {lead.contactPerson && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.contactPerson}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-sm">{lead.product}</td>
                <td className="text-muted text-sm">{lead.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriorityLeadsTable;
