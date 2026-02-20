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

// Generate funnel data from lead count (mock simulation)
const generateFunnelData = (leads) => {
  const qualified = Math.round(leads * 0.65); // 65% qualification rate
  const contacted = Math.round(qualified * 0.55); // 55% contacted
  const converted = Math.round(contacted * 0.25); // 25% conversion
  return { leads, qualified, contacted, converted };
};

const getFlowFunnelTone = (tone) => {
  const toneMap = {
    muted: {
      fill: 'bg-[var(--slate-400)]',
      text: 'text-[var(--slate-400)]'
    },
    neutral: {
      fill: 'bg-[var(--slate-500)]',
      text: 'text-[var(--slate-500)]'
    },
    primary: {
      fill: 'bg-[var(--primary)]',
      text: 'text-[var(--primary)]'
    },
    secondary: {
      fill: 'bg-[var(--secondary)]',
      text: 'text-[var(--secondary)]'
    }
  };
  return toneMap[tone] || toneMap.muted;
};

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
              <div className="campaign-product-badges flex flex-wrap gap-1 mt-2">
                <Package size={14} className="text-[var(--text-tertiary)] mr-0.5" />
                {campaign.productIds.slice(0, 3).map(productId => {
                  const product = products.find(p => p.id === productId);
                  return product ? (
                    <span key={productId} className="badge neutral text-[0.7rem] px-1.5 py-0.5">
                      {product.name}
                    </span>
                  ) : null;
                })}
                {campaign.productIds.length > 3 && (
                  <span className="badge neutral text-[0.7rem] px-1.5 py-0.5">
                    +{campaign.productIds.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Mini Lead Funnel - Few's principle: show data in context */}
            {(() => {
              const funnel = generateFunnelData(campaign.leads);
              const maxWidth = funnel.leads;
              return (
                <div className="campaign-card-stats flex-col gap-2">
                  <div className="flex justify-between items-center text-[0.6875rem] mb-1">
                    <span className="font-semibold text-[var(--text-primary)]">Lead Funnel</span>
                    <span className="text-[var(--text-tertiary)]">{campaign.updatedAt}</span>
                  </div>
                  {/* Funnel Bars - Uses SWK brand colors */}
                  {[
                    { label: 'Leads', value: funnel.leads, tone: 'muted' },
                    { label: 'Qualifiziert', value: funnel.qualified, tone: 'neutral' },
                    { label: 'Kontaktiert', value: funnel.contacted, tone: 'primary' },
                    { label: 'Konvertiert', value: funnel.converted, tone: 'secondary' }
                  ].map((step, idx) => {
                    const tone = getFlowFunnelTone(step.tone);
                    const stepStyle = { width: `${maxWidth > 0 ? (step.value / maxWidth * 100) : 0}%` };
                    return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-[60px] shrink-0 text-[0.625rem] text-[var(--text-tertiary)]">
                        {step.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-[var(--slate-100)] rounded-[3px] overflow-hidden">
                        <div
                          className={`h-full rounded-[3px] transition-[width] duration-300 ${tone.fill}`}
                          style={stepStyle}
                        />
                      </div>
                      <span className={`w-7 text-right text-[0.6875rem] font-semibold ${tone.text}`}>
                        {step.value}
                      </span>
                    </div>
                    );
                  })}
                  {/* Conversion Rate - Uses SWK Blue */}
                  <div className="flex justify-end mt-1 pt-1 border-t border-[var(--slate-100)]">
                    <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-[var(--swk-blue-light)] text-[var(--secondary)] font-semibold">
                      Conv: {funnel.leads > 0 ? ((funnel.converted / funnel.leads) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              );
            })()}

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
            <label className="block mb-2 font-medium text-sm">
              Produkte zuordnen
            </label>
            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 bg-[var(--slate-50)] rounded-lg">
              {activeProducts.length > 0 ? (
                activeProducts.map(product => (
                  <label
                    key={product.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md cursor-pointer text-[0.8rem] transition-all ${newCampaign.productIds.includes(product.id) ? 'bg-[var(--primary-light)] border-[var(--primary)]' : 'bg-white border-[var(--slate-200)]'}`}
                  >
                    <input
                      type="checkbox"
                      checked={newCampaign.productIds.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="w-3.5 h-3.5"
                    />
                    <span>{product.name}</span>
                  </label>
                ))
              ) : (
                <span className="text-[0.8rem] text-[var(--text-tertiary)]">
                  Keine aktiven Produkte vorhanden
                </span>
              )}
            </div>
            {newCampaign.productIds.length > 0 && (
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
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
