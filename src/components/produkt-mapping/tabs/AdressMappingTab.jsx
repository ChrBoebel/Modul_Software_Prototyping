
import { useMemo, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, MapPin, Package, Layers, ChevronDown, Check, X, Eye, SquareUser, FileText, List } from 'lucide-react';
import { Badge, Button, Card, DataTable, Input, Panel, Select, Modal, FilterChip, FilterChipGroup, CollapsibleSection } from '../../ui';
import { formatAddress, getStatusLabel, getProductField } from '../availabilityLogic';
import { getProductColor, TECHNOLOGY_COLORS, getTechnologyFromProductId } from '../../../theme/productColors';

// Wireframe-style customized Filter Pill
const FilterPill = ({ label, active = false, onClick }) => (
  <button
    className={`filter - pill ${active ? 'active' : ''} `}
    onClick={onClick}
  >
    <span>{label}</span>
    <ChevronDown size={14} />
  </button>
);

const FilterSelect = ({ placeholder, options, value, onChange }) => (
  <div className="relative">
    <select
      className="mapping-filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const AdressMappingTab = ({
  addresses = [],
  rules = [],
  availability = [],
  availabilityStatus = [],
  products = [],
  onUpsertAddress,
  onDeleteAddress,
  onUpsertAvailability,
  onDeleteAvailability,
  createId,
  showToast
}) => {
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedAddressForDetail, setSelectedAddressForDetail] = useState(null);

  // States for legacy edit panel (creation)
  const [panelOpen, setPanelOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState({});
  const [availabilityDrafts, setAvailabilityDrafts] = useState([]);
  const [errors, setErrors] = useState({});

  // Filter States
  const [filterPLZ, setFilterPLZ] = useState('');
  const [filterStreet, setFilterStreet] = useState('');
  const [filterTech, setFilterTech] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Filters (Mocking visual "active" state for now since wireframes just show "Filter v")
  // In a real app these would toggle dropdowns.
  const FILTERS = ['Status', 'Technologie', 'PLZ', 'Straße', 'Label', 'Kampagne'];

  // Product options
  const productOptions = useMemo(() =>
    products
      .filter(p => getProductField(p, 'active') !== false)
      .map(p => ({
        value: p.id,
        label: p.name
      })),
    [products]
  );

  // Status Options
  const statusOptions = useMemo(() =>
    availabilityStatus.map(s => ({
      value: s.id,
      label: getStatusLabel(s.value)
    })),
    [availabilityStatus]
  );

  // Helper to get formatted data
  const addressesWithMappings = useMemo(() => {
    return addresses.map(addr => {
      const mappings = availability.filter(a => a.address_id === addr.id);

      const primaryMapping = mappings[0];
      const primaryStatusId = primaryMapping?.status_id;
      const primaryProduct = products.find(p => p.id === primaryMapping?.product_id);
      const primaryTechId = getTechnologyFromProductId(primaryMapping?.product_id);
      const primaryTechName = primaryTechId ? TECHNOLOGY_COLORS[primaryTechId]?.name : '-';

      const verteilerId = `VT - ${addr.id.split('-')[1] || '000'} `;
      const meldung = mappings.length > 0 ? 'Automatische Zuordnung' : '-';

      return {
        ...addr,
        mappingCount: mappings.length,
        mappings,
        primaryStatusId,
        primaryTechName,
        verteilerId,
        meldung
      };
    });
  }, [addresses, availability, products]);

  // Apply filters
  const filteredAddresses = useMemo(() => {
    let result = addressesWithMappings;

    if (filterPLZ) {
      result = result.filter(addr => addr.zip === filterPLZ);
    }
    if (filterStreet) {
      result = result.filter(addr => addr.street === filterStreet);
    }
    if (filterStatus) {
      result = result.filter(addr => addr.primaryStatusId === filterStatus);
    }
    if (filterTech) {
      result = result.filter(addr => addr.primaryTechName === filterTech);
    }

    return result;
  }, [addressesWithMappings, filterPLZ, filterStreet, filterStatus, filterTech]);

  // Open Detail Panel
  const openDetail = (address) => {
    setSelectedAddressForDetail(address);
    setDetailPanelOpen(true);
  };

  const closeDetailPanel = () => {
    setDetailPanelOpen(false);
    setSelectedAddressForDetail(null);
  };

  // Legacy Create New (keeping simplistic for functionality, mainly focusing on new design for list/details)
  const openNew = () => {
    setAddressDraft({
      id: createId('addr'),
      street: '', housenumber: '', zip: '', city: '', country: 'DE'
    });
    setAvailabilityDrafts([]);
    setPanelOpen(true);
  };

  const openEdit = (address) => {
    setAddressDraft({ ...address });
    // Load existing availability mappings
    const existingMappings = availability
      .filter(a => a.address_id === address.id)
      .map(a => ({ ...a }));
    setAvailabilityDrafts(existingMappings);

    setPanelOpen(true);
  }

  const handleDelete = (addressId) => {
    // ... keeping existing logic
    const ok = window.confirm("Adresse wirklich löschen?");
    if (ok) onDeleteAddress?.(addressId);
  };

  // Validate and save address
  const handleSaveAddress = () => {
    const newErrors = {};

    if (!addressDraft.street?.trim()) {
      newErrors.street = 'Straße ist erforderlich';
    }
    if (!addressDraft.housenumber?.trim()) {
      newErrors.housenumber = 'Hausnummer ist erforderlich';
    }
    if (!addressDraft.zip?.trim()) {
      newErrors.zip = 'PLZ ist erforderlich';
    }
    if (!addressDraft.city?.trim()) {
      newErrors.city = 'Ort ist erforderlich';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Save the address
    const addressToSave = {
      id: addressDraft.id,
      street: addressDraft.street.trim(),
      housenumber: addressDraft.housenumber.trim(),
      housenumber_addition: addressDraft.housenumber_addition?.trim() || '',
      housenumber_numeric: parseInt(addressDraft.housenumber) || 0,
      zip: addressDraft.zip.trim(),
      city: addressDraft.city.trim(),
      country: addressDraft.country || 'DE',
      community: addressDraft.city.trim()
    };

    onUpsertAddress?.(addressToSave);

    // Save availability mappings
    availabilityDrafts.forEach(avail => {
      if (avail.product_id) {
        onUpsertAvailability?.({
          id: avail.id,
          address_id: addressDraft.id,
          product_id: avail.product_id,
          status_id: avail.status_id || 'status-available',
          config: {}
        });
      }
    });

    setPanelOpen(false);
    showToast?.('Adresse gespeichert');
  };

  // Render Status Badge
  const renderStatusBadge = (statusId) => {
    if (!statusId) return <div className="cell-box mute">-</div>;

    const statusObj = availabilityStatus.find(s => s.id === statusId);
    const statusValue = statusObj?.value || 'unknown';
    const label = getStatusLabel(statusValue);

    let variant = 'neutral';
    if (statusValue === 'available' || statusValue === 'active') variant = 'success';
    if (statusValue === 'planned') variant = 'warning';
    if (statusValue === 'unavailable' || statusValue === 'offline') variant = 'danger';

    return (
      <div className={`badge striped ${variant} `} style={{ width: '100%', textAlign: 'center', display: 'block' }}>
        {label}
      </div>
    );
  };

  // Columns Definition - matched to wireframe visual boxes
  const columns = useMemo(() => ([
    {
      key: 'zip',
      header: 'PLZ',
      width: '90px',
      render: (val) => <div className="cell-box">{val}</div>
    },
    {
      key: 'street',
      header: 'Straße',
      render: (val) => <div className="cell-box">{val}</div>
    },
    {
      key: 'housenumber',
      header: 'Nr',
      width: '70px',
      render: (val, row) => <div className="cell-box">{val}{row.housenumber_addition}</div>
    },
    {
      key: 'primaryStatusId',
      header: 'Status',
      width: '140px',
      render: (val) => renderStatusBadge(val)
    },
    {
      key: 'primaryTechName',
      header: 'Technologie',
      width: '130px',
      render: (val) => <div className="cell-box">{val}</div>
    },
    {
      key: 'meldung',
      header: 'Meldung',
      render: (val) => <div className="cell-box text-secondary">{val}</div>
    },
    {
      key: 'verteilerId',
      header: 'Verteiler-ID',
      width: '120px',
      render: (val) => <div className="cell-box font-mono text-xs">{val}</div>
    },
    {
      key: 'actions',
      header: 'Aktion',
      width: '90px',
      align: 'right',
      render: (_value, row) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); openDetail(row); }}
            className="action-btn-square"
            title="Details"
          >
            <SquareUser size={16} />{/* Using generic square icon as placeholder for detail/edit */}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
            className="action-btn-square danger"
            title="Löschen"
          >
            <X size={16} />
          </button>
        </div>
      )
    }
  ]), [availabilityStatus]);

  return (
    <>
      <Card
        headerTitle="Adress-Mapping"
        hoverable={false}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 text-sm text-secondary">
            {/* No more switch, just label or empty space */}
            <span className="flex items-center gap-2"><List size={14} /> Listenansicht</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={openNew}
            >
              Neue Adresse
            </Button>
          </div>
        </div>

        <div>
          {/* Filter Bar */}
          <div className="mapping-filter-bar no-scrollbar">
            <FilterSelect
              placeholder="PLZ Filter"
              value={filterPLZ}
              onChange={setFilterPLZ}
              options={['78462', '78464', '78465', '78467'].map(p => ({ value: p, label: p }))}
            />
            <FilterSelect
              placeholder="Straßen Filter"
              value={filterStreet}
              onChange={setFilterStreet}
              options={Array.from(new Set(addresses.map(a => a.street))).sort().map(s => ({ value: s, label: s }))}
            />
            <FilterSelect
              placeholder="Status Filter"
              value={filterStatus}
              onChange={setFilterStatus}
              options={statusOptions}
            />
            <FilterSelect
              placeholder="Technologie"
              value={filterTech}
              onChange={setFilterTech}
              options={Object.values(TECHNOLOGY_COLORS).map(t => ({ value: t.name, label: t.name }))}
            />
          </div>

          {/* Active Filter Chips */}
          {(filterPLZ || filterStreet || filterStatus || filterTech) && (
            <FilterChipGroup
              onClearAll={() => {
                setFilterPLZ('');
                setFilterStreet('');
                setFilterStatus('');
                setFilterTech('');
              }}
            >
              {filterPLZ && (
                <FilterChip
                  label={`PLZ: ${filterPLZ}`}
                  onRemove={() => setFilterPLZ('')}
                />
              )}
              {filterStreet && (
                <FilterChip
                  label={`Straße: ${filterStreet}`}
                  onRemove={() => setFilterStreet('')}
                />
              )}
              {filterStatus && (
                <FilterChip
                  label={`Status: ${statusOptions.find(s => s.value === filterStatus)?.label || filterStatus}`}
                  onRemove={() => setFilterStatus('')}
                />
              )}
              {filterTech && (
                <FilterChip
                  label={`Technologie: ${filterTech}`}
                  onRemove={() => setFilterTech('')}
                />
              )}
            </FilterChipGroup>
          )}

          <div className="table-wrapper">
            <DataTable
              columns={columns}
              data={filteredAddresses}
              onRowClick={openDetail}
              emptyMessage="Keine Einträge"
              className="mapping-table"
            />
          </div>
        </div>
      </Card>

      {/* Main Detail Overlay - Wireframe Implementation */}
      <Panel
        isOpen={detailPanelOpen}
        onClose={closeDetailPanel}
        title="Gebäude-Details"
        width="500px"
      >
        {selectedAddressForDetail && (
          <div className="flex flex-col gap-6">

            {/* Adresse Section */}
            <div>
              <label className="detail-label">Adresse</label>
              <div className="detail-value-box text-lg font-medium">
                {selectedAddressForDetail.street} {selectedAddressForDetail.housenumber}{selectedAddressForDetail.housenumber_addition}, {selectedAddressForDetail.zip} {selectedAddressForDetail.city}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="detail-label">Kundenanzahl:</label>
                  <div className="detail-value-box">
                    {Math.floor(Math.random() * 5)}
                  </div>
                </div>
                <div>
                  <label className="detail-label">Leadsanzahl:</label>
                  <div className="detail-value-box">
                    {Math.floor(Math.random() * 8)}
                  </div>
                </div>
                <div>
                  <label className="detail-label">Wohneinheiten:</label>
                  <div className="detail-value-box">
                    {Math.floor(Math.random() * 12) + 1}
                  </div>
                </div>
              </div>
            </div>

            {/* Produkte Table in Sidebar */}
            <div className="pt-4 border-t border-border">
              <div className="detail-table-header">
                <span className="w-1/3">Produkte</span>
                <span className="w-1/4">Typ</span>
                <span className="w-1/4">Status</span>
                <span className="w-1/4 text-right">Verteiler-ID</span>
              </div>

              <div className="space-y-2">
                {selectedAddressForDetail.mappings.length > 0 ? selectedAddressForDetail.mappings.map((m, idx) => {
                  const prod = products.find(p => p.id === m.product_id);
                  const tech = getTechnologyFromProductId(m.product_id);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="detail-value-box w-1/3 text-sm truncate">{prod?.name}</div>
                      <div className="detail-value-box w-1/4 text-sm truncate">{tech ? TECHNOLOGY_COLORS[tech]?.name : '-'}</div>
                      <div className="w-1/4">{renderStatusBadge(m.status_id)}</div>
                      <div className="detail-value-box w-1/4 text-sm font-mono text-right">{selectedAddressForDetail.verteilerId}</div>
                    </div>
                  );
                }) : (
                  <div className="text-secondary italic text-sm py-2">Keine Produkte</div>
                )}
              </div>

              {/* Delete button below products table as in wireframe */}
              <div className="mt-2 text-right">
                <button className="bg-danger/10 text-danger p-1 rounded hover:bg-danger/20">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Leads-Details Table (Mock) */}
            <CollapsibleSection title="Leads-Details" defaultOpen={false} badge="2">
              <div className="detail-table-header">
                <span className="w-1/4">timestamp</span>
                <span className="w-1/4">titel</span>
                <span className="w-1/4">status</span>
                <span className="w-1/4 text-right">tag</span>
              </div>
              {/* Mock Lead Rows */}
              {[1, 2].map(i => (
                <div key={i} className="flex gap-2 mb-2">
                  <div className="detail-value-box flex-1 text-xs">2024-03-{10 + i}</div>
                  <div className="detail-value-box flex-1 text-xs">Anfrage</div>
                  <div className="detail-value-box flex-1 text-xs">{i % 2 === 0 ? 'Offen' : 'Erledigt'}</div>
                  <div className="flex gap-1 items-center">
                    <div className="w-6 h-6 rounded bg-bg-secondary border border-border flex items-center justify-center">
                      <X size={12} className="text-danger" />
                    </div>
                  </div>
                </div>
              ))}
            </CollapsibleSection>

            {/* Protokoll Table (Mock) */}
            <CollapsibleSection title="Protokoll" defaultOpen={false} badge="3">
              <div className="detail-table-header">
                <span className="w-1/3">timestamp</span>
                <span className="w-2/3">titel</span>
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-2 mb-2">
                  <div className="detail-value-box w-1/3 text-xs">2024-02-{15 + i}</div>
                  <div className="detail-value-box w-2/3 text-xs">System update Log #{i}93</div>
                </div>
              ))}
            </CollapsibleSection>

          </div>
        )}
      </Panel>

      {/* Create/Edit Address Panel */}
      <Panel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={addressDraft.id?.startsWith('addr-') && !addresses.find(a => a.id === addressDraft.id) ? 'Neue Adresse anlegen' : 'Adresse bearbeiten'}
        width="520px"
      >
        <div className="form-row">
          <Input
            label="Straße"
            value={addressDraft.street || ''}
            onChange={(e) => setAddressDraft(prev => ({ ...prev, street: e.target.value }))}
            error={errors.street}
            placeholder="z.B. Hauptstraße"
          />
          <Input
            label="Hausnummer"
            value={addressDraft.housenumber || ''}
            onChange={(e) => setAddressDraft(prev => ({ ...prev, housenumber: e.target.value }))}
            error={errors.housenumber}
            placeholder="z.B. 12"
            style={{ maxWidth: '120px' }}
          />
        </div>

        <div className="form-row">
          <Input
            label="PLZ"
            value={addressDraft.zip || ''}
            onChange={(e) => setAddressDraft(prev => ({ ...prev, zip: e.target.value }))}
            error={errors.zip}
            placeholder="z.B. 78462"
            style={{ maxWidth: '120px' }}
          />
          <Input
            label="Ort"
            value={addressDraft.city || ''}
            onChange={(e) => setAddressDraft(prev => ({ ...prev, city: e.target.value }))}
            error={errors.city}
            placeholder="z.B. Konstanz"
          />
        </div>

        <Select
          label="Land"
          value={addressDraft.country || 'DE'}
          onChange={(e) => setAddressDraft(prev => ({ ...prev, country: e.target.value }))}
          options={[
            { value: 'DE', label: 'Deutschland' },
            { value: 'AT', label: 'Österreich' },
            { value: 'CH', label: 'Schweiz' }
          ]}
        />

        {/* Availability Mappings Section */}
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Produkt-Verfügbarkeit</span>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setAvailabilityDrafts(prev => [...prev, {
                id: createId('avail'),
                address_id: addressDraft.id,
                product_id: '',
                status_id: 'status-available'
              }])}
            >
              Produkt
            </Button>
          </div>

          {availabilityDrafts.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>
              Keine Produkte zugeordnet. Klicke "Produkt" um eine Verfügbarkeit hinzuzufügen.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availabilityDrafts.map((avail, index) => (
                <div key={avail.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <Select
                    label={index === 0 ? 'Produkt' : ''}
                    value={avail.product_id}
                    onChange={(e) => setAvailabilityDrafts(prev =>
                      prev.map((a, i) => i === index ? { ...a, product_id: e.target.value } : a)
                    )}
                    options={productOptions}
                    placeholder="Produkt wählen..."
                    style={{ flex: 2 }}
                  />
                  <Select
                    label={index === 0 ? 'Status' : ''}
                    value={avail.status_id}
                    onChange={(e) => setAvailabilityDrafts(prev =>
                      prev.map((a, i) => i === index ? { ...a, status_id: e.target.value } : a)
                    )}
                    options={statusOptions}
                    style={{ flex: 1 }}
                  />
                  <Button
                    variant="icon"
                    icon={Trash2}
                    onClick={() => setAvailabilityDrafts(prev => prev.filter((_, i) => i !== index))}
                    ariaLabel="Produkt entfernen"
                    style={{ marginBottom: index === 0 ? '0' : '0' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="action-buttons" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setPanelOpen(false)}>Abbrechen</Button>
          <Button variant="primary" onClick={handleSaveAddress}>Speichern</Button>
        </div>
      </Panel>

    </>
  );
};

export default AdressMappingTab;
