import { useState } from 'react';
import { Download, RotateCcw, MapPin, Package, Search, Home, Layers } from 'lucide-react';
import { Button, Tabs } from '../ui';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import defaultProducts from '../../data/productCatalog.json';
import defaultRules from '../../data/availabilityRules.json';
import defaultAddresses from '../../data/addresses.json';
import defaultAvailability from '../../data/availability.json';
import defaultAvailabilityStatus from '../../data/availabilityStatus.json';
import MappingRegelnTab from './tabs/MappingRegelnTab';
import ProduktkatalogTab from './tabs/ProduktkatalogTab';
import AdressCheckTab from './tabs/AdressCheckTab';
import AdressMappingTab from './tabs/AdressMappingTab';
import MapOverviewTab from './tabs/MapOverviewTab';

const STORAGE_KEYS = {
  products: 'swk:productCatalog',
  rules: 'swk:availabilityRules',
  addresses: 'swk:addresses',
  availability: 'swk:availability',
  availabilityStatus: 'swk:availabilityStatus',
  customZones: 'swk:customZones'
};

const TABS = [
  { id: 'produkte', label: 'Produktkatalog', icon: Package, description: 'Produkte definieren' },
  { id: 'regeln', label: 'Mapping-Regeln', icon: Layers, description: 'Verfügbarkeitsregeln erstellen' },
  { id: 'adressen', label: 'Adress-Mapping', icon: Home, description: 'Einzelne Adressen verwalten' },
  { id: 'map', label: 'Map-Overview', icon: MapPin, description: 'Kartenansicht & Zonen' },
  { id: 'check', label: 'Adresse prüfen', icon: Search, description: 'Verfügbarkeit testen' }
];

const createId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const downloadJson = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

const ProduktMappingView = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('produkte'); // Start with products as first step in workflow
  const [products, setProducts, productsApi] = useLocalStorage(STORAGE_KEYS.products, defaultProducts);
  const [rules, setRules, rulesApi] = useLocalStorage(STORAGE_KEYS.rules, defaultRules);
  const [addresses, setAddresses, addressesApi] = useLocalStorage(STORAGE_KEYS.addresses, defaultAddresses);
  const [availability, setAvailability, availabilityApi] = useLocalStorage(STORAGE_KEYS.availability, defaultAvailability);
  const [availabilityStatus, setAvailabilityStatus, availabilityStatusApi] = useLocalStorage(STORAGE_KEYS.availabilityStatus, defaultAvailabilityStatus);
  const [customZones, setCustomZones, customZonesApi] = useLocalStorage(STORAGE_KEYS.customZones, []);

  // Product CRUD
  const upsertProduct = (product) => {
    setProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === product.id);
      if (existingIndex === -1) return [product, ...prev];
      return prev.map((p) => (p.id === product.id ? product : p));
    });
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setRules((prev) => prev.map((rule) => ({
      ...rule,
      productIds: Array.isArray(rule.productIds)
        ? rule.productIds.filter((id) => id !== productId)
        : []
    })));
    // Also remove from availability
    setAvailability((prev) => prev.filter((a) => a.product_id !== productId));
  };

  // Rule CRUD
  const upsertRule = (rule) => {
    setRules((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === rule.id);
      if (existingIndex === -1) return [rule, ...prev];
      return prev.map((r) => (r.id === rule.id ? rule : r));
    });
  };

  const deleteRule = (ruleId) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  };

  // Address CRUD
  const upsertAddress = (address) => {
    setAddresses((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === address.id);
      if (existingIndex === -1) return [address, ...prev];
      return prev.map((a) => (a.id === address.id ? address : a));
    });
  };

  const deleteAddress = (addressId) => {
    setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    // Also remove all availability mappings for this address
    setAvailability((prev) => prev.filter((a) => a.address_id !== addressId));
  };

  // Availability CRUD
  const upsertAvailability = (avail) => {
    setAvailability((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === avail.id);
      if (existingIndex === -1) return [avail, ...prev];
      return prev.map((a) => (a.id === avail.id ? avail : a));
    });
  };

  const deleteAvailability = (availId) => {
    setAvailability((prev) => prev.filter((a) => a.id !== availId));
  };

  // Custom Zone CRUD
  const addCustomZone = (zone) => {
    setCustomZones((prev) => [...prev, zone]);
  };

  const updateCustomZone = (zoneId, updates) => {
    setCustomZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, ...updates } : z))
    );
  };

  const deleteCustomZone = (zoneId) => {
    setCustomZones((prev) => prev.filter((z) => z.id !== zoneId));
  };

  const handleReset = () => {
    productsApi.reset();
    rulesApi.reset();
    addressesApi.reset();
    availabilityApi.reset();
    availabilityStatusApi.reset();
    customZonesApi.reset();
    showToast?.('Demo-Daten zurückgesetzt');
  };

  const handleExport = () => {
    downloadJson('produkt-verfuegbarkeit-export.json', {
      products,
      rules,
      addresses,
      availability,
      availabilityStatus,
      customZones
    });
    showToast?.('Export heruntergeladen');
  };

  return (
    <div className="view-container">
      <h1 className="sr-only">Produkt- &amp; Verfügbarkeits-Mapping</h1>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Produkt- & Verfügbarkeits-Mapping</h2>
        <div className="action-buttons">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExport}
            ariaLabel="Export als JSON herunterladen"
          >
            Export
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
            ariaLabel="Demo-Daten zurücksetzen"
          >
            Reset
          </Button>
        </div>
      </div>

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="Produkt-Mapping Bereiche"
      />

      {activeTab === 'map' && (
        <MapOverviewTab
          customZones={customZones}
          onZoneCreated={addCustomZone}
          onZoneUpdated={updateCustomZone}
          onZoneDeleted={deleteCustomZone}
          products={products}
          showToast={showToast}
        />
      )}

      {activeTab === 'regeln' && (
        <MappingRegelnTab
          rules={rules}
          products={products}
          onUpsertRule={upsertRule}
          onDeleteRule={deleteRule}
          createId={createId}
          showToast={showToast}
        />
      )}

      {activeTab === 'adressen' && (
        <AdressMappingTab
          addresses={addresses}
          rules={rules}
          availability={availability}
          availabilityStatus={availabilityStatus}
          products={products}
          onUpsertAddress={upsertAddress}
          onDeleteAddress={deleteAddress}
          onUpsertAvailability={upsertAvailability}
          onDeleteAvailability={deleteAvailability}
          createId={createId}
          showToast={showToast}
        />
      )}

      {activeTab === 'produkte' && (
        <ProduktkatalogTab
          products={products}
          onUpsertProduct={upsertProduct}
          onDeleteProduct={deleteProduct}
          createId={createId}
          showToast={showToast}
        />
      )}

      {activeTab === 'check' && (
        <AdressCheckTab
          products={products}
          rules={rules}
          addresses={addresses}
          availability={availability}
          availabilityStatus={availabilityStatus}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default ProduktMappingView;
