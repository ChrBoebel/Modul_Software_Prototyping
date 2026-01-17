import { useState } from 'react';
import {
  Play,
  Pause,
  Edit,
  Plus,
  Package,
} from 'lucide-react';
import { Panel, Input, Button } from '../../ui';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import defaultProducts from '../../../data/productCatalog.json';

const FlowKampagnenTab = ({ showToast, onEditFlow }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '', productIds: [] });

  // Load products from localStorage
  const [products] = useLocalStorage('swk:productCatalog', defaultProducts);

  // Mock campaign data
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp-001',
      name: 'Kampagne Strom',
      description: 'Neukunden Stromtarif Flow',
      status: 'eingeordnet',
      type: 'aktiv',
      leads: 145,
      productIds: ['glasfaser-1000', 'glasfaser-500'],
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
      productIds: ['kabel-400'],
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
      productIds: [],
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
      productIds: ['dsl-100', 'dsl-50'],
      createdAt: '2024-11-15',
      updatedAt: '2025-01-10 11:00'
    }
  ]);

  const handleCreateCampaign = () => {
    if (!newCampaign.name.trim()) {
      showToast?.('Bitte einen Namen eingeben');
      return;
    }
    const campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaign.name,
      description: newCampaign.description || 'Neue Kampagne',
      status: 'entwurf',
      type: 'note',
      leads: 0,
      productIds: newCampaign.productIds || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toLocaleString('de-DE')
    };
    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({ name: '', description: '', productIds: [] });
    setPanelOpen(false);
    showToast?.(`Kampagne "${campaign.name}" erstellt`);
  };

  // Toggle product selection for new campaign
  const toggleProductSelection = (productId) => {
    setNewCampaign(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  // Get active products for selection
  const activeProducts = products.filter(p => p.config?.active !== false);

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
        <button
          className="btn btn-primary"
          aria-label="Neue Kampagne erstellen"
          onClick={() => setPanelOpen(true)}
        >
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
            {/* Product badges */}
            {campaign.productIds?.length > 0 && (
              <div className="campaign-product-badges" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                <Package size={14} style={{ color: 'var(--text-tertiary)', marginRight: '2px' }} />
                {campaign.productIds.slice(0, 3).map(productId => {
                  const product = products.find(p => p.id === productId);
                  return product ? (
                    <span key={productId} className="badge neutral" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                      {product.name}
                    </span>
                  ) : null;
                })}
                {campaign.productIds.length > 3 && (
                  <span className="badge neutral" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    +{campaign.productIds.length - 3}
                  </span>
                )}
              </div>
            )}

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

      {/* Neue Kampagne Panel */}
      <Panel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Neue Kampagne erstellen"
        width="400px"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Kampagnen-Name"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
            placeholder="z.B. Solar Frühling 2025"
          />
          <Input
            label="Beschreibung"
            value={newCampaign.description}
            onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Kurze Beschreibung der Kampagne"
          />
          {/* Product Selection */}
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>
              Produkte zuordnen
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '8px', background: 'var(--slate-50)', borderRadius: '8px' }}>
              {activeProducts.length > 0 ? (
                activeProducts.map(product => (
                  <label
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      background: newCampaign.productIds.includes(product.id) ? 'var(--primary-light)' : 'white',
                      border: `1px solid ${newCampaign.productIds.includes(product.id) ? 'var(--primary)' : 'var(--slate-200)'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newCampaign.productIds.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      style={{ width: '14px', height: '14px' }}
                    />
                    <span>{product.name}</span>
                  </label>
                ))
              ) : (
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                  Keine aktiven Produkte vorhanden
                </span>
              )}
            </div>
            {newCampaign.productIds.length > 0 && (
              <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {newCampaign.productIds.length} Produkt{newCampaign.productIds.length !== 1 ? 'e' : ''} ausgewählt
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={() => setPanelOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={handleCreateCampaign}>
              Erstellen
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default FlowKampagnenTab;
