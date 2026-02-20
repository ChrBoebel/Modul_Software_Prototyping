import { useState } from 'react';
import { FilterChip, FilterChipGroup } from '../FilterChip';
import { ProductGroupSelector } from '../ProductGroupSelector';
import { ComponentSection, ComponentShowcase } from './shared';

const FilterSection = () => {
  const [activeFilters, setActiveFilters] = useState(['status:aktiv', 'produkt:solar']);
  const [selectedProducts, setSelectedProducts] = useState(['glasfaser-1000']);

  const sampleProducts = [
    { id: 'glasfaser-1000', name: 'Glasfaser 1000', category: 'Internet' },
    { id: 'glasfaser-500', name: 'Glasfaser 500', category: 'Internet' },
    { id: 'strom-basic', name: 'Strom Basic', category: 'Energie' },
    { id: 'strom-premium', name: 'Strom Premium', category: 'Energie' }
  ];

  const handleRemoveFilter = (filter) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <ComponentSection
      title="Filter"
      description="Filterkomponenten für Listen und Tabellen."
    >
      <ComponentShowcase
        title="FilterChip"
        code={`<FilterChip
  label="Status: Aktiv"
  onRemove={() => handleRemove()}
/>
<FilterChip label="Produkt: Solar" removable={false} />`}
      >
        <div className="preview-row">
          <FilterChip label="Status: Aktiv" onRemove={() => {}} />
          <FilterChip label="Produkt: Solar" onRemove={() => {}} />
          <FilterChip label="Nicht entfernbar" />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="FilterChipGroup"
        code={`<FilterChipGroup
  filters={activeFilters}
  onRemove={(filter) => handleRemove(filter)}
  onClearAll={() => setFilters([])}
/>`}
      >
        <FilterChipGroup
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={() => setActiveFilters([])}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="ProductGroupSelector"
        code={`<ProductGroupSelector
  products={products}
  selectedIds={selected}
  onChange={setSelected}
/>`}
      >
        <div className="max-w-[400px]">
          <ProductGroupSelector
            products={sampleProducts}
            selectedIds={selectedProducts}
            onChange={setSelectedProducts}
          />
        </div>
      </ComponentShowcase>
    </ComponentSection>
  );
};

export default FilterSection;
