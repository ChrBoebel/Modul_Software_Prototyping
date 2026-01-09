import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Badge, Button, Card, Checkbox, DataTable, Input, Panel, SearchBox, Select, ProductGroupSelector, Tooltip } from '../../ui';
import { formatRuleScope } from '../availabilityLogic';

const RULE_TYPE_OPTIONS = [
  { value: 'street-range', label: 'Straße + Hausnummern' },
  { value: 'postal-code', label: 'PLZ' }
];

const EFFECT_OPTIONS = [
  { value: 'allow', label: 'Erlauben (Produkte verfügbar)' },
  { value: 'deny', label: 'Sperren (Produkte NICHT verfügbar)' }
];

const createDraft = ({ createId, rule } = {}) => ({
  id: rule?.id || createId('rule'),
  type: rule?.type || 'street-range',
  effect: rule?.effect || 'allow',
  active: rule?.active ?? true,
  priority: rule?.priority ?? 0,
  postalCode: rule?.postalCode || '',
  city: rule?.city || '',
  street: rule?.street || '',
  houseNumberFrom: rule?.houseNumberFrom ?? '',
  houseNumberTo: rule?.houseNumberTo ?? '',
  productIds: Array.isArray(rule?.productIds) ? rule.productIds : [],
  createdAt: rule?.createdAt || new Date().toISOString()
});

const getRuleTypeLabel = (type) => {
  if (type === 'postal-code') return 'PLZ';
  if (type === 'street-range') return 'Straße';
  return type;
};

const MappingRegelnTab = ({
  rules = [],
  products = [],
  onUpsertRule,
  onDeleteRule,
  createId,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState(() => createDraft({ createId }));
  const [errors, setErrors] = useState({});

  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const postalCodeOptions = useMemo(() => {
    const unique = [...new Set(rules
      .map((rule) => (rule?.postalCode || '').trim())
      .filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'de-DE'));

    return [
      { value: '', label: 'Alle PLZ' },
      ...unique.map((code) => ({ value: code, label: `PLZ ${code}` }))
    ];
  }, [rules]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const subset = postalCodeFilter
      ? rules.filter((rule) => (rule?.postalCode || '').trim() === postalCodeFilter)
      : rules;

    if (!term) return subset;

    return subset.filter((rule) => {
      const productNames = (Array.isArray(rule.productIds) ? rule.productIds : [])
        .map((id) => productsById.get(id)?.name || id)
        .join(' ');
      const haystack = `${rule.id} ${rule.type} ${rule.effect} ${rule.postalCode} ${rule.city} ${rule.street} ${productNames}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [rules, search, postalCodeFilter, productsById]);

  const openNew = () => {
    setErrors({});
    setDraft(createDraft({ createId }));
    setPanelOpen(true);
  };

  const openEdit = (rule) => {
    setErrors({});
    setDraft(createDraft({ createId, rule }));
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  const validate = (candidate) => {
    const nextErrors = {};
    if (candidate.type === 'postal-code' && !candidate.postalCode.trim()) {
      nextErrors.postalCode = 'PLZ ist erforderlich.';
    }
    if (candidate.type === 'street-range' && !candidate.street.trim()) {
      nextErrors.street = 'Straße ist erforderlich.';
    }
    if (!Array.isArray(candidate.productIds) || candidate.productIds.length === 0) {
      nextErrors.productIds = 'Bitte mindestens ein Produkt auswählen.';
    }
    return nextErrors;
  };

  const handleSave = () => {
    const houseNumberFrom = draft.houseNumberFrom === '' ? null : Number(draft.houseNumberFrom);
    const houseNumberTo = draft.houseNumberTo === '' ? null : Number(draft.houseNumberTo);

    const candidate = {
      ...draft,
      postalCode: draft.postalCode.trim(),
      city: draft.city.trim(),
      street: draft.street.trim(),
      priority: Number(draft.priority) || 0,
      houseNumberFrom: Number.isFinite(houseNumberFrom) ? houseNumberFrom : null,
      houseNumberTo: Number.isFinite(houseNumberTo) ? houseNumberTo : null
    };

    const nextErrors = validate(candidate);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onUpsertRule?.(candidate);
    setPanelOpen(false);
    showToast?.('Regel gespeichert');
  };

  const handleDelete = (ruleId) => {
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return;
    const ok = window.confirm(`Regel „${formatRuleScope(rule) || rule.id}“ wirklich löschen?`);
    if (!ok) return;

    onDeleteRule?.(ruleId);
    showToast?.('Regel gelöscht');
  };

  const columns = useMemo(() => ([
    {
      key: 'active',
      header: 'Status',
      width: '120px',
      render: (value) => (
        <Badge variant={value ? 'success' : 'neutral'}>
          {value ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      )
    },
    { key: 'type', header: 'Typ', width: '110px', render: (value) => getRuleTypeLabel(value) },
    {
      key: 'scope',
      header: 'Gültig für',
      render: (_value, row) => formatRuleScope(row)
    },
    {
      key: 'effect',
      header: 'Effekt',
      width: '140px',
      render: (value) => (
        <Badge variant={value === 'deny' ? 'danger' : 'success'}>
          {value === 'deny' ? 'Sperrt' : 'Erlaubt'}
        </Badge>
      )
    },
    {
      key: 'productIds',
      header: 'Produkte',
      render: (value) => {
        const ids = Array.isArray(value) ? value : [];
        if (ids.length === 0) return '—';
        const visible = ids.slice(0, 2);
        const remaining = ids.length - 2;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((id) => (
              <Badge key={id} variant="neutral" size="sm">
                {productsById.get(id)?.name || id}
              </Badge>
            ))}
            {remaining > 0 && (
              <Tooltip content={ids.slice(2).map((id) => productsById.get(id)?.name || id).join(', ')}>
                <Badge variant="secondary" size="sm">+{remaining}</Badge>
              </Tooltip>
            )}
          </div>
        );
      }
    },
    { key: 'priority', header: 'Prio', width: '80px', align: 'right' },
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
            ariaLabel="Regel bearbeiten"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
          />
          <Button
            variant="icon"
            icon={Trash2}
            ariaLabel="Regel löschen"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          />
        </div>
      )
    }
  ]), [productsById, rules]);

  return (
    <>
      <Card
        headerTitle="Mapping-Regeln"
        headerActions={(
          <div className="action-buttons">
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Regeln suchen…"
            />
            <Select
              value={postalCodeFilter}
              onChange={(e) => setPostalCodeFilter(e.target.value)}
              options={postalCodeOptions}
              placeholder={null}
              aria-label="PLZ-Filter"
            />
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={openNew}
              ariaLabel="Neue Regel anlegen"
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
            emptyMessage="Keine Regeln vorhanden"
          />
        </div>
      </Card>

      <Panel
        isOpen={panelOpen}
        onClose={closePanel}
        title="Regel bearbeiten"
        width="560px"
      >
        <div className="form-row">
          <Select
            label="Regeltyp"
            value={draft.type}
            onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))}
            options={RULE_TYPE_OPTIONS}
            placeholder=""
          />
          <Select
            label="Effekt"
            value={draft.effect}
            onChange={(e) => setDraft((prev) => ({ ...prev, effect: e.target.value }))}
            options={EFFECT_OPTIONS}
            placeholder=""
          />
        </div>

        <div className="form-row">
          <Input
            label="PLZ"
            value={draft.postalCode}
            onChange={(e) => setDraft((prev) => ({ ...prev, postalCode: e.target.value }))}
            error={errors.postalCode}
            placeholder="z.B. 78462"
          />
          <Input
            label="Ort"
            value={draft.city}
            onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="z.B. Konstanz"
          />
        </div>

        {draft.type === 'street-range' && (
          <>
            <Input
              label="Straße"
              value={draft.street}
              onChange={(e) => setDraft((prev) => ({ ...prev, street: e.target.value }))}
              error={errors.street}
              placeholder="z.B. Musterstraße"
            />

            <div className="form-row">
              <Input
                type="number"
                label="Hausnr. von (optional)"
                value={draft.houseNumberFrom}
                onChange={(e) => setDraft((prev) => ({ ...prev, houseNumberFrom: e.target.value }))}
                min="0"
              />
              <Input
                type="number"
                label="Hausnr. bis (optional)"
                value={draft.houseNumberTo}
                onChange={(e) => setDraft((prev) => ({ ...prev, houseNumberTo: e.target.value }))}
                min="0"
              />
            </div>
          </>
        )}

        <div style={{ marginTop: '6px' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px' }}>Produkte</div>
          {errors.productIds && (
            <div className="form-error" role="alert" style={{ marginBottom: '8px' }}>
              {errors.productIds}
            </div>
          )}
          <ProductGroupSelector
            products={products}
            selected={draft.productIds}
            onChange={(newSelected) => setDraft((prev) => ({ ...prev, productIds: newSelected }))}
          />
        </div>

        <div className="form-row" style={{ marginTop: '18px' }}>
          <Input
            type="number"
            label="Priorität"
            value={draft.priority}
            onChange={(e) => setDraft((prev) => ({ ...prev, priority: e.target.value }))}
            hint="Höhere Zahl gewinnt (bei mehreren Treffern)."
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Checkbox
              checked={draft.active}
              onChange={(checked) => setDraft((prev) => ({ ...prev, active: checked }))}
              label="Regel aktiv"
            />
          </div>
        </div>

        <div className="action-buttons" style={{ justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="secondary" onClick={closePanel}>Abbrechen</Button>
          <Button variant="primary" onClick={handleSave}>Speichern</Button>
        </div>
      </Panel>
    </>
  );
};

export default MappingRegelnTab;
