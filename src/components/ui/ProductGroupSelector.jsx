import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Check, Minus } from 'lucide-react';
import { TECHNOLOGY_COLORS } from '../../theme/productColors';

/**
 * ProductGroupSelector - Gruppierte Produkt-Auswahl mit "Alle auswählen" pro Gruppe
 *
 * Reduziert kognitiven Overload durch:
 * - Gruppierung nach Technologie (FTTH, KABEL, DSL)
 * - Aufklappbare Gruppen
 * - "Alle auswählen/abwählen" pro Gruppe
 * - Visuelle Farb-Badges pro Technologie
 *
 * @param {Array} products - Array von Produkten mit {id, name, config: {technology, downloadMbps, uploadMbps}}
 * @param {Array} selected - Array von ausgewählten Produkt-IDs
 * @param {function} onChange - Callback mit neuem selected Array
 * @param {string} className - Zusätzliche CSS-Klassen
 */
export const ProductGroupSelector = ({
  products = [],
  selected = [],
  onChange,
  className = ''
}) => {
  const [expandedGroups, setExpandedGroups] = useState({
    FTTH: true,
    KABEL: true,
    DSL: true
  });

  // Gruppiere Produkte nach Technologie
  const groupedProducts = useMemo(() => {
    const groups = { FTTH: [], KABEL: [], DSL: [] };

    products.forEach(product => {
      const tech = product.config?.technology || 'DSL';
      if (groups[tech]) {
        groups[tech].push(product);
      }
    });

    // Sortiere innerhalb jeder Gruppe nach Download-Speed (absteigend)
    Object.keys(groups).forEach(tech => {
      groups[tech].sort((a, b) =>
        (b.config?.downloadMbps || 0) - (a.config?.downloadMbps || 0)
      );
    });

    return groups;
  }, [products]);

  const toggleGroup = (tech) => {
    setExpandedGroups(prev => ({
      ...prev,
      [tech]: !prev[tech]
    }));
  };

  const toggleProduct = (productId) => {
    const newSelected = selected.includes(productId)
      ? selected.filter(id => id !== productId)
      : [...selected, productId];
    onChange(newSelected);
  };

  const toggleAllInGroup = (tech) => {
    const groupProductIds = groupedProducts[tech].map(p => p.id);
    const allSelected = groupProductIds.every(id => selected.includes(id));

    let newSelected;
    if (allSelected) {
      // Alle abwählen
      newSelected = selected.filter(id => !groupProductIds.includes(id));
    } else {
      // Alle auswählen
      newSelected = [...new Set([...selected, ...groupProductIds])];
    }
    onChange(newSelected);
  };

  const getGroupSelectionState = (tech) => {
    const groupProductIds = groupedProducts[tech].map(p => p.id);
    const selectedCount = groupProductIds.filter(id => selected.includes(id)).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === groupProductIds.length) return 'all';
    return 'some';
  };

  const techColors = {
    FTTH: 'bg-swk-blue text-white',
    KABEL: 'bg-primary text-white',
    DSL: 'bg-slate-500 text-white'
  };

  const techBorderColors = {
    FTTH: 'border-swk-blue/30',
    KABEL: 'border-primary/30',
    DSL: 'border-slate-300'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Object.entries(TECHNOLOGY_COLORS).map(([tech, config]) => {
        const groupProducts = groupedProducts[tech];
        if (groupProducts.length === 0) return null;

        const isExpanded = expandedGroups[tech];
        const selectionState = getGroupSelectionState(tech);
        const selectedCount = groupProducts.filter(p => selected.includes(p.id)).length;

        return (
          <div
            key={tech}
            className={`
              border rounded-lg overflow-hidden
              ${techBorderColors[tech]}
            `}
          >
            {/* Group Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50">
              <button
                type="button"
                onClick={() => toggleGroup(tech)}
                className="flex items-center gap-2 text-left flex-1"
              >
                {isExpanded ? (
                  <ChevronDown size={16} className="text-slate-400" />
                ) : (
                  <ChevronRight size={16} className="text-slate-400" />
                )}
                <span className={`
                  px-2 py-0.5 text-xs font-semibold rounded
                  ${techColors[tech]}
                `}>
                  {config.name}
                </span>
                <span className="text-sm text-slate-500">
                  ({selectedCount}/{groupProducts.length})
                </span>
              </button>

              {/* Select All Checkbox */}
              <button
                type="button"
                onClick={() => toggleAllInGroup(tech)}
                className="
                  flex items-center gap-1.5
                  px-2 py-1
                  text-xs
                  text-slate-600
                  hover:text-slate-800
                  hover:bg-slate-100
                  rounded
                  transition-colors
                "
                title={selectionState === 'all' ? 'Alle abwählen' : 'Alle auswählen'}
              >
                <span className={`
                  w-4 h-4 flex items-center justify-center
                  border rounded
                  ${selectionState === 'all'
                    ? 'bg-primary border-primary text-white'
                    : selectionState === 'some'
                    ? 'bg-primary/50 border-primary/50 text-white'
                    : 'border-slate-300'
                  }
                `}>
                  {selectionState === 'all' && <Check size={12} />}
                  {selectionState === 'some' && <Minus size={12} />}
                </span>
                <span className="hidden sm:inline">
                  {selectionState === 'all' ? 'Alle ab' : 'Alle'}
                </span>
              </button>
            </div>

            {/* Products List */}
            {isExpanded && (
              <div className="divide-y divide-slate-100">
                {groupProducts.map(product => {
                  const isSelected = selected.includes(product.id);
                  const speed = product.config?.downloadMbps
                    ? `${product.config.downloadMbps}/${product.config.uploadMbps} Mbit/s`
                    : '';

                  return (
                    <label
                      key={product.id}
                      className={`
                        flex items-center gap-3
                        px-3 py-2.5
                        cursor-pointer
                        hover:bg-slate-50
                        transition-colors
                        ${isSelected ? 'bg-primary/5' : ''}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProduct(product.id)}
                        className="
                          w-4 h-4
                          rounded
                          border-slate-300
                          text-primary
                          focus:ring-primary
                          focus:ring-offset-0
                        "
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 truncate">
                          {product.name}
                        </div>
                        {speed && (
                          <div className="text-xs text-slate-500">
                            {speed}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Summary */}
      {selected.length > 0 && (
        <div className="text-sm text-slate-600 pt-2">
          {selected.length} Produkt{selected.length !== 1 ? 'e' : ''} ausgewählt
        </div>
      )}
    </div>
  );
};
