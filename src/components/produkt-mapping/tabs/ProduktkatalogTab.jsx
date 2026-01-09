import { useMemo, useState, useRef } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Badge, Button, Card, Checkbox, DataTable, Input, Panel, SearchBox, Select, useUndoToast } from '../../ui';
import { getProductField } from '../availabilityLogic';

const TECH_OPTIONS = [
  { value: 'FTTH', label: 'FTTH (Glasfaser)' },
  { value: 'DSL', label: 'DSL' },
  { value: 'KABEL', label: 'Kabel' },
  { value: 'FWA', label: 'Funk (FWA)' }
];

const createDraft = ({ createId, product } = {}) => ({
  id: product?.id || createId('product'),
  name: product?.name || '',
  config: {
    technology: getProductField(product, 'technology') || 'FTTH',
    downloadMbps: getProductField(product, 'downloadMbps') ?? 1000,
    uploadMbps: getProductField(product, 'uploadMbps') ?? 500,
    priceMonthly: getProductField(product, 'priceMonthly') ?? 0,
    active: getProductField(product, 'active') ?? true
  }
});

const ProduktkatalogTab = ({
  products = [],
  onUpsertProduct,
  onDeleteProduct,
  createId,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState(() => createDraft({ createId }));
  const [errors, setErrors] = useState({});
  const { showUndoToast, UndoToastComponent } = useUndoToast();
  const deletedProductRef = useRef(null);

  const currency = useMemo(() => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }), []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((p) => {
      const tech = getProductField(p, 'technology') || '';
      const haystack = `${p.name} ${tech} ${p.id}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [products, search]);

  const openNew = () => {
    setErrors({});
    setDraft(createDraft({ createId }));
    setPanelOpen(true);
  };

  const openEdit = (product) => {
    setErrors({});
    setDraft(createDraft({ createId, product }));
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
  };

  const validate = (candidate) => {
    const nextErrors = {};
    if (!candidate.name.trim()) nextErrors.name = 'Bitte Produktname angeben.';

    const idCollision = products.some((p) => p.id === candidate.id && p.id !== draft.id);
    if (idCollision) nextErrors.id = 'Produkt-ID ist bereits vergeben.';

    return nextErrors;
  };

  const handleSave = () => {
    const candidate = {
      id: draft.id,
      name: draft.name.trim(),
      config: {
        technology: draft.config.technology,
        downloadMbps: Number(draft.config.downloadMbps) || 0,
        uploadMbps: Number(draft.config.uploadMbps) || 0,
        priceMonthly: Number(draft.config.priceMonthly) || 0,
        active: draft.config.active
      }
    };

    const nextErrors = validate(candidate);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onUpsertProduct?.(candidate);
    setPanelOpen(false);
    showToast?.('Produkt gespeichert');
  };

  const handleDelete = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Store for potential undo
    deletedProductRef.current = product;

    // Delete immediately (no confirm dialog)
    onDeleteProduct?.(productId);

    // Show UndoToast with undo option
    showUndoToast({
      message: `„${product.name}" gelöscht`,
      onUndo: () => {
        if (deletedProductRef.current) {
          onUpsertProduct?.(deletedProductRef.current);
          showToast?.('Produkt wiederhergestellt');
          deletedProductRef.current = null;
        }
      },
      duration: 8000
    });
  };

  const columns = useMemo(() => ([
    {
      key: 'name',
      header: 'Produkt',
      render: (value, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600 }}>{row.name}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.id}</span>
        </div>
      )
    },
    {
      key: 'technology',
      header: 'Technik',
      width: '140px',
      render: (_value, row) => getProductField(row, 'technology') || '-'
    },
    {
      key: 'downloadMbps',
      header: 'Speed',
      width: '140px',
      render: (_value, row) => {
        const down = getProductField(row, 'downloadMbps') || 0;
        const up = getProductField(row, 'uploadMbps') || 0;
        return `${down} / ${up} Mbit/s`;
      }
    },
    {
      key: 'priceMonthly',
      header: 'Preis',
      width: '120px',
      align: 'right',
      render: (_value, row) => currency.format(Number(getProductField(row, 'priceMonthly')) || 0)
    },
    {
      key: 'active',
      header: 'Status',
      width: '120px',
      render: (_value, row) => {
        const active = getProductField(row, 'active');
        return (
          <Badge variant={active ? 'success' : 'neutral'}>
            {active ? 'Aktiv' : 'Inaktiv'}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: '',
      width: '96px',
      align: 'right',
      render: (_value, row) => (
        <div className="action-buttons">
          <Button
            variant="icon"
            icon={Pencil}
            ariaLabel="Produkt bearbeiten"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
          />
          <Button
            variant="icon"
            icon={Trash2}
            ariaLabel="Produkt löschen"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          />
        </div>
      )
    }
  ]), [currency, products]);

  return (
    <>
      <Card
        headerTitle="Produktkatalog"
        headerActions={(
          <div className="action-buttons">
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Produkte suchen…"
            />
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={openNew}
              ariaLabel="Neues Produkt anlegen"
            >
              Neu
            </Button>
          </div>
        )}
        hoverable={false}
      >
        <div className="table-wrapper">
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={openEdit}
            emptyMessage="Keine Produkte vorhanden"
          />
        </div>
      </Card>

      <Panel
        isOpen={panelOpen}
        onClose={closePanel}
        title="Produkt bearbeiten"
        width="520px"
      >
        <div className="form-row">
          <Input
            label="Produkt-ID"
            value={draft.id}
            readOnly
            error={errors.id}
          />
          <Select
            label="Technik"
            value={draft.config.technology}
            onChange={(e) => setDraft((prev) => ({ ...prev, config: { ...prev.config, technology: e.target.value } }))}
            options={TECH_OPTIONS}
            placeholder=""
          />
        </div>

        <Input
          label="Produktname"
          value={draft.name}
          onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          placeholder="z.B. Glasfaser 1000"
        />

        <div className="form-row">
          <Input
            type="number"
            label="Download (Mbit/s)"
            value={draft.config.downloadMbps}
            onChange={(e) => setDraft((prev) => ({ ...prev, config: { ...prev.config, downloadMbps: e.target.value } }))}
            min="0"
          />
          <Input
            type="number"
            label="Upload (Mbit/s)"
            value={draft.config.uploadMbps}
            onChange={(e) => setDraft((prev) => ({ ...prev, config: { ...prev.config, uploadMbps: e.target.value } }))}
            min="0"
          />
        </div>

        <div className="form-row">
          <Input
            type="number"
            label="Preis/Monat (€)"
            value={draft.config.priceMonthly}
            onChange={(e) => setDraft((prev) => ({ ...prev, config: { ...prev.config, priceMonthly: e.target.value } }))}
            min="0"
            step="0.1"
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Checkbox
              checked={draft.config.active}
              onChange={(checked) => setDraft((prev) => ({ ...prev, config: { ...prev.config, active: checked } }))}
              label="Produkt aktiv"
            />
          </div>
        </div>

        <div className="action-buttons" style={{ justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="secondary" onClick={closePanel}>Abbrechen</Button>
          <Button variant="primary" onClick={handleSave}>Speichern</Button>
        </div>
      </Panel>

      <UndoToastComponent />
    </>
  );
};

export default ProduktkatalogTab;

