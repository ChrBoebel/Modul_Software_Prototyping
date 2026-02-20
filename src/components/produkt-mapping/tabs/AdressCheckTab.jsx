import { useMemo, useState, useCallback } from 'react';
import { Copy, UserPlus } from 'lucide-react';
import { Badge, Button, Card, DataTable, Input, Select, Panel } from '../../ui';
import {
  getCombinedAvailabilityForAddress,
  formatRuleScope,
  formatAddress,
  getStatusBadgeVariant,
  getStatusLabel,
  getProductField
} from '../availabilityLogic';

const ADDRESS_SAMPLES = [
  {
    id: 'sample-1',
    label: 'Hauptstraße 5, 78462 Konstanz',
    value: { street: 'Hauptstraße', houseNumber: '5', postalCode: '78462', city: 'Konstanz' }
  },
  {
    id: 'sample-2',
    label: 'Bahnhofstraße 12a, 78462 Konstanz',
    value: { street: 'Bahnhofstraße', houseNumber: '12a', postalCode: '78462', city: 'Konstanz' }
  },
  {
    id: 'sample-3',
    label: 'Seestraße 8, 78464 Konstanz',
    value: { street: 'Seestraße', houseNumber: '8', postalCode: '78464', city: 'Konstanz' }
  },
  {
    id: 'sample-4',
    label: 'Rheinstraße 23b, 78467 Konstanz',
    value: { street: 'Rheinstraße', houseNumber: '23b', postalCode: '78467', city: 'Konstanz' }
  },
  {
    id: 'sample-5',
    label: 'Industriestraße 1, 78465 Konstanz',
    value: { street: 'Industriestraße', houseNumber: '1', postalCode: '78465', city: 'Konstanz' }
  },
  {
    id: 'sample-6',
    label: 'Hauptstraße 45, 78462 Konstanz',
    value: { street: 'Hauptstraße', houseNumber: '45', postalCode: '78462', city: 'Konstanz' }
  },
  {
    id: 'sample-7',
    label: 'Hussenstraße 12, 78462 Konstanz',
    value: { street: 'Hussenstraße', houseNumber: '12', postalCode: '78462', city: 'Konstanz' }
  },
  {
    id: 'sample-8',
    label: 'Mainaustraße 12, 78464 Konstanz',
    value: { street: 'Mainaustraße', houseNumber: '12', postalCode: '78464', city: 'Konstanz' }
  },
  {
    id: 'sample-9',
    label: 'Industriestraße 20, 78467 Konstanz',
    value: { street: 'Industriestraße', houseNumber: '20', postalCode: '78467', city: 'Konstanz' }
  },
  {
    id: 'sample-10',
    label: 'Bergstraße 23, 78465 Konstanz',
    value: { street: 'Bergstraße', houseNumber: '23', postalCode: '78465', city: 'Konstanz' }
  },
  {
    id: 'sample-11',
    label: 'Insel Mainau 1, 78465 Konstanz (Demo: NICHT versorgbar)',
    value: { street: 'Insel Mainau', houseNumber: '1', postalCode: '78465', city: 'Konstanz' }
  }
];

const AdressCheckTab = ({
  products = [],
  rules = [],
  addresses = [],
  availability = [],
  availabilityStatus = [],
  showToast,
  onLeadCreated,
  onNavigateToLead
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState(ADDRESS_SAMPLES[0].id);
  const [address, setAddress] = useState(() => ADDRESS_SAMPLES[0].value);
  const [showLeadPanel, setShowLeadPanel] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const combinedAvailability = useMemo(() =>
    getCombinedAvailabilityForAddress(address, {
      products,
      rules,
      addresses,
      availability,
      availabilityStatus
    }),
    [address, products, rules, addresses, availability, availabilityStatus]
  );

  const productColumns = useMemo(() => ([
    {
      key: 'product',
      header: 'Produkt',
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{row.product?.name}</span>
          <span className="text-xs text-[var(--text-secondary)]">
            {getProductField(row.product, 'technology')}
          </span>
        </div>
      )
    },
    {
      key: 'speed',
      header: 'Speed',
      width: '140px',
      render: (_value, row) => {
        const down = getProductField(row.product, 'downloadMbps') || 0;
        const up = getProductField(row.product, 'uploadMbps') || 0;
        return `${down} / ${up} Mbit/s`;
      }
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (_value, row) => (
        <Badge variant={getStatusBadgeVariant(row.status?.value)}>
          {getStatusLabel(row.status?.value)}
        </Badge>
      )
    },
    {
      key: 'source',
      header: 'Quelle',
      width: '100px',
      render: (_value, row) => (
        <Badge variant={row.source === 'direct' ? 'info' : 'neutral'} size="sm">
          {row.source === 'direct' ? 'Direkt' : 'Regel'}
        </Badge>
      )
    }
  ]), []);

  const ruleColumns = useMemo(() => ([
    { key: 'priority', header: 'Prio', width: '80px', align: 'right' },
    {
      key: 'effect',
      header: 'Effekt',
      width: '110px',
      render: (value) => (
        <Badge variant={value === 'deny' ? 'danger' : 'success'} size="sm">
          {value === 'deny' ? 'Sperrt' : 'Erlaubt'}
        </Badge>
      )
    },
    { key: 'scope', header: 'Gültig für', render: (_value, row) => formatRuleScope(row) },
    {
      key: 'productIds',
      header: 'Produkte',
      render: (value) => Array.isArray(value) ? value.join(', ') : '—'
    }
  ]), []);

  const sampleOptions = useMemo(() =>
    ADDRESS_SAMPLES.map((s) => ({ value: s.id, label: s.label })),
    []
  );

  const handleSelectSample = (sampleId) => {
    const sample = ADDRESS_SAMPLES.find((s) => s.id === sampleId);
    if (!sample) return;
    setSelectedSampleId(sampleId);
    setAddress(sample.value);
  };

  const handleCopyAddress = useCallback(() => {
    const formatted = formatAddress(address);
    navigator.clipboard.writeText(formatted).then(() => {
      showToast?.('Adresse kopiert');
    }).catch(() => {
      showToast?.('Kopieren fehlgeschlagen');
    });
  }, [address, showToast]);

  // Handle creating a lead from the address check
  const handleCreateLead = useCallback(() => {
    if (!combinedAvailability.isServiceable) {
      showToast?.('Adresse ist nicht versorgbar');
      return;
    }

    const timestamp = new Date().toISOString();
    const year = new Date().getFullYear();
    const leadNumber = `LEAD-${year}-${String(Date.now()).slice(-4)}`;

    const newLead = {
      id: Date.now(),
      leadNumber,
      timestamp,
      source: 'Adress-Check',
      status: 'new',
      priority: 'medium',
      customer: {
        firstName: newLeadData.firstName,
        lastName: newLeadData.lastName,
        email: newLeadData.email,
        phone: newLeadData.phone,
        address: `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`,
        postalCode: address.postalCode,
        city: address.city,
        street: address.street,
        houseNumber: address.houseNumber,
        customerType: 'private'
      },
      interest: {
        type: 'energy_contract',
        details: `Verfügbare Produkte: ${combinedAvailability.availableProducts.map(p => p.product?.name || p.name).join(', ')}`
      },
      qualification: {
        score: 60
      },
      availability: {
        isServiceable: combinedAvailability.isServiceable,
        availableProducts: combinedAvailability.availableProducts.map(p => ({
          id: p.product?.id || p.id,
          name: p.product?.name || p.name
        })),
        checkedAddress: address
      },
      notes: 'Lead erstellt über Adress-Check'
    };

    onLeadCreated?.(newLead);
    setShowLeadPanel(false);
    setNewLeadData({ firstName: '', lastName: '', email: '', phone: '' });
    showToast?.(`Lead ${leadNumber} erstellt`);

    if (onNavigateToLead) {
      onNavigateToLead(newLead.id);
    }
  }, [address, combinedAvailability, newLeadData, onLeadCreated, onNavigateToLead, showToast]);

  const availableCount = combinedAvailability.combinedProducts.filter(
    cp => cp.status?.value === 'available'
  ).length;

  const plannedCount = combinedAvailability.combinedProducts.filter(
    cp => cp.status?.value === 'planned'
  ).length;

  return (
    <div className="content-grid">
      <Card headerTitle="Adresse prüfen" hoverable={false}>
        <Select
          label="Beispieladresse"
          value={selectedSampleId}
          onChange={(e) => handleSelectSample(e.target.value)}
          options={sampleOptions}
          placeholder=""
        />

        <div className="form-row">
          <Input
            label="Straße"
            value={address.street}
            onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
          />
          <Input
            label="Hausnummer"
            value={address.houseNumber}
            onChange={(e) => setAddress((prev) => ({ ...prev, houseNumber: e.target.value }))}
            placeholder="z.B. 12, 12a, 12b"
          />
        </div>

        <div className="form-row">
          <Input
            label="PLZ"
            value={address.postalCode}
            onChange={(e) => setAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
          />
          <Input
            label="Ort"
            value={address.city}
            onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
          />
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="font-bold">Ergebnis:</span>
          <Badge variant={combinedAvailability.isServiceable ? 'success' : 'danger'}>
            {combinedAvailability.isServiceable ? 'Versorgbar' : 'Nicht versorgbar'}
          </Badge>

          {combinedAvailability.hasDirectMapping && (
            <Badge variant="info" size="sm">
              Direkte Zuordnung gefunden
            </Badge>
          )}

          <Button
            variant="icon"
            icon={Copy}
            onClick={handleCopyAddress}
            ariaLabel="Adresse kopieren"
            title="Adresse in Zwischenablage kopieren"
          />

          {/* Lead erstellen Button - nur wenn versorgbar und Callback vorhanden */}
          {combinedAvailability.isServiceable && onLeadCreated && (
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={() => setShowLeadPanel(true)}
            >
              Lead erstellen
            </Button>
          )}
        </div>

        {combinedAvailability.matchedAddress && (
          <div className="mt-3 py-2 px-3 bg-[var(--bg-secondary)] rounded-md text-[13px]">
            <span className="text-[var(--text-secondary)]">Adresse in DB: </span>
            <span className="font-medium">{formatAddress(combinedAvailability.matchedAddress)}</span>
          </div>
        )}
      </Card>

      <Card
        headerTitle={(
          <div className="flex items-center gap-2">
            <span>Produkte</span>
            {availableCount > 0 && <Badge variant="success" size="sm">{availableCount} verfügbar</Badge>}
            {plannedCount > 0 && <Badge variant="warning" size="sm">{plannedCount} geplant</Badge>}
          </div>
        )}
        hoverable={false}
      >
        <div className="table-wrapper">
          <DataTable
            columns={productColumns}
            data={combinedAvailability.combinedProducts}
            emptyMessage="Keine Produkte für diese Adresse"
          />
        </div>
      </Card>

      <Card
        headerTitle={`Matching-Regeln (${combinedAvailability.ruleBasedResult?.matchedRules?.length || 0})`}
        hoverable={false}
        fullWidth
      >
        <div className="table-wrapper">
          <DataTable
            columns={ruleColumns}
            data={combinedAvailability.ruleBasedResult?.matchedRules || []}
            emptyMessage="Keine Regel matcht diese Adresse"
          />
        </div>
      </Card>

      {/* Lead Creation Panel */}
      <Panel
        isOpen={showLeadPanel}
        onClose={() => setShowLeadPanel(false)}
        title="Lead aus Adresse erstellen"
        width="400px"
      >
        <div className="flex flex-col gap-4">
          {/* Address Summary */}
          <div className="p-3 bg-[var(--success-light)] rounded-lg mb-2">
            <p className="text-sm font-medium">
              {address.street} {address.houseNumber}, {address.postalCode} {address.city}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {combinedAvailability.availableProducts.length} Produkt{combinedAvailability.availableProducts.length !== 1 ? 'e' : ''} verfügbar
            </p>
          </div>

          <Input
            label="Vorname"
            value={newLeadData.firstName}
            onChange={(e) => setNewLeadData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Max"
          />
          <Input
            label="Nachname"
            value={newLeadData.lastName}
            onChange={(e) => setNewLeadData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Mustermann"
          />
          <Input
            label="E-Mail"
            type="email"
            value={newLeadData.email}
            onChange={(e) => setNewLeadData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="max@example.de"
          />
          <Input
            label="Telefon"
            type="tel"
            value={newLeadData.phone}
            onChange={(e) => setNewLeadData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+49 123 456789"
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={() => setShowLeadPanel(false)}>
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateLead}
              disabled={!newLeadData.firstName && !newLeadData.lastName && !newLeadData.email}
            >
              Lead erstellen
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default AdressCheckTab;
