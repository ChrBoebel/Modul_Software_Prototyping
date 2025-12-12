import { useState } from 'react';
import {
  Play,
  Pause,
  Edit,
  Plus,
} from 'lucide-react';

const FlowKampagnenTab = ({ showToast, onEditFlow }) => {
  // Mock campaign data
  const campaigns = [
    {
      id: 'camp-001',
      name: 'Kampagne Strom',
      description: 'Neukunden Stromtarif Flow',
      status: 'eingeordnet',
      type: 'aktiv',
      leads: 145,
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15 14:30'
    },
    {
      id: 'camp-002',
      name: 'Kampagne Solar',
      description: 'Solar PV Beratungs-Flow',
      status: 'eingeordnet',
      type: 'aktiv',
      leads: 89,
      createdAt: '2025-01-05',
      updatedAt: '2025-01-14 09:15'
    },
    {
      id: 'camp-003',
      name: 'Kampagne Wärme',
      description: 'Wärmepumpe Lead-Qualifizierung',
      status: 'eingeordnet',
      type: 'note',
      leads: 67,
      createdAt: '2024-12-20',
      updatedAt: '2025-01-12 16:45'
    },
    {
      id: 'camp-004',
      name: 'Kampagne E-Mobil',
      description: 'E-Auto Förderung & Wallbox',
      status: 'pausiert',
      type: 'note',
      leads: 34,
      createdAt: '2024-11-15',
      updatedAt: '2025-01-10 11:00'
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'eingeordnet': 'success',
      'pausiert': 'warning',
      'entwurf': 'info'
    };
    return statusMap[status] || 'neutral';
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      'aktiv': 'success',
      'note': 'info'
    };
    return typeMap[type] || 'neutral';
  };

  return (
    <div className="flow-kampagnen-tab">
      <h2 className="sr-only">Flow Kampagnen Übersicht</h2>
      {/* Header */}
      <div className="tab-header">
        <button className="btn btn-primary" aria-label="Neue Kampagne erstellen">
          <Plus size={16} aria-hidden="true" />
          Neue Kampagne
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="campaign-cards-grid">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-card-header">
              <div className="campaign-title">
                <h4>{campaign.name}</h4>
                <p>{campaign.description}</p>
              </div>
              <div className="campaign-badges">
                <span className={`badge ${getStatusBadge(campaign.status)}`}>
                  {campaign.status}
                </span>
                <span className={`badge ${getTypeBadge(campaign.type)}`}>
                  {campaign.type}
                </span>
              </div>
            </div>

            <div className="campaign-card-stats">
              <div className="stat">
                <span className="stat-label">Leads</span>
                <span className="stat-value">{campaign.leads}</span>
              </div>
              <div className="stat">
                <span className="stat-label">aktualisiert</span>
                <span className="stat-value">{campaign.updatedAt}</span>
              </div>
            </div>

            <div className="campaign-card-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onEditFlow(campaign)}
                aria-label={`${campaign.name} bearbeiten`}
              >
                <Edit size={14} aria-hidden="true" />
                Bearbeiten
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => showToast(`${campaign.name} Status ändern`)}
                aria-label={campaign.status === 'pausiert' ? `${campaign.name} starten` : `${campaign.name} pausieren`}
              >
                {campaign.status === 'pausiert' ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                {campaign.status === 'pausiert' ? 'Starten' : 'Pausieren'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowKampagnenTab;
