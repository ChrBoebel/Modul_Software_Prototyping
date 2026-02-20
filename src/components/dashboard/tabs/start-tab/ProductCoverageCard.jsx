import { MapPin, Package } from 'lucide-react';
import { Tooltip as UiTooltip } from '../../../ui';

const ProductCoverageCard = ({ productStats, availabilityChartData, onNavigate }) => {
  return (
    <div
      className="card cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onNavigate && onNavigate('produkt-mapping')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate && onNavigate('produkt-mapping');
        }
      }}
      aria-label="Produkt-Mapping öffnen"
    >
      <div className="card-header flex justify-between items-center">
        <h3>
          <MapPin size={16} className="inline mr-2" />
          Produkt-Abdeckung
        </h3>
        <span className="text-xs text-[var(--text-tertiary)]">Details →</span>
      </div>
      <div className="py-2">
        {/* Quick Stats */}
        <div className="flex justify-between gap-2 mb-3">
          <div className="text-center flex-1 min-w-0">
            <div className="text-base font-bold text-[var(--secondary)]">
              {productStats.totalProducts}
            </div>
            <div className="text-[0.625rem] text-[var(--text-tertiary)]">Produkte</div>
          </div>
          <UiTooltip content="Postleitzahlen mit aktiven Verfügbarkeitsregeln">
            <div className="text-center flex-1 min-w-0 cursor-help">
              <div className="text-base font-bold text-[var(--primary)]">
                {productStats.coveredPlzCount}
              </div>
              <div className="text-[0.625rem] text-[var(--text-tertiary)]">PLZ</div>
            </div>
          </UiTooltip>
          <UiTooltip content="Aktive Regeln die Produktverfügbarkeit definieren">
            <div className="text-center flex-1 min-w-0 cursor-help">
              <div className="text-base font-bold text-[var(--slate-500)]">
                {productStats.totalRules}
              </div>
              <div className="text-[0.625rem] text-[var(--text-tertiary)]">Regeln</div>
            </div>
          </UiTooltip>
          <UiTooltip content="Verhältnis zu ~8000 deutschen PLZ-Bereichen">
            <div className="text-center flex-1 min-w-0 cursor-help">
              <div className="text-base font-bold text-[var(--success)]">
                {productStats.coveragePercent}%
              </div>
              <div className="text-[0.625rem] text-[var(--text-tertiary)]">Abdeckung</div>
            </div>
          </UiTooltip>
        </div>

        {/* Top Products */}
        {productStats.topProducts.length > 0 && (
          <div>
            <div className="text-[0.625rem] font-semibold text-[var(--text-tertiary)] uppercase mb-1.5">Top Produkte</div>
            <div className="flex flex-col gap-1">
              {productStats.topProducts.map((prod, idx) => (
                <div
                  key={prod.id}
                  className="flex justify-between items-center py-1.5 px-2 bg-[var(--slate-50)] rounded"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-4 h-4 rounded-[3px] flex items-center justify-center text-[var(--text-on-primary)] text-[0.625rem] font-semibold shrink-0 ${idx === 0 ? 'bg-[var(--secondary)]' : idx === 1 ? 'bg-[var(--slate-400)]' : 'bg-[var(--slate-300)]'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-xs overflow-hidden text-ellipsis whitespace-nowrap">{prod.name}</span>
                  </div>
                  <span className="text-[0.625rem] text-[var(--text-tertiary)] shrink-0">
                    {prod.ruleCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stacked Bar - replaces Pie Chart (Tufte: maximize data-ink ratio) */}
        {(productStats.totalProducts > 0 || productStats.totalRules > 0) && (
          <div className="mt-3">
            {/* 100% Stacked Bar */}
            {(() => {
              const total = availabilityChartData.reduce((sum, d) => sum + d.value, 0);
              return (
                <div className="flex h-2 rounded overflow-hidden bg-[var(--slate-100)]">
                  {availabilityChartData.map((item, idx) => {
                    const width = total > 0 ? (item.value / total * 100) : 0;
                    const segmentStyle = { width: `${width}%`, '--product-coverage-color': item.color };
                    return width > 0 ? (
                      <div
                        key={idx}
                        className="product-coverage-segment h-full transition-[width] duration-300"
                        style={segmentStyle}
                        title={`${item.name}: ${item.value}`}
                      />
                    ) : null;
                  })}
                </div>
              );
            })()}
            {/* Legend with values */}
            <div className="flex justify-between gap-2 mt-2">
              {availabilityChartData.map((item, idx) => {
                const legendDotStyle = { '--product-coverage-color': item.color };
                return (
                <div key={idx} className="flex items-center gap-1 text-[0.625rem]">
                  <span className="product-coverage-dot w-2 h-2 rounded-[2px] shrink-0" style={legendDotStyle} />
                  <span className="text-[var(--text-secondary)] font-medium">
                    {item.value}
                  </span>
                  <span className="text-[var(--text-tertiary)]">
                    {item.name}
                  </span>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {productStats.topProducts.length === 0 && productStats.totalRules === 0 && (
          <div className="text-center p-2 text-[var(--text-tertiary)] text-xs">
            <Package size={18} className="mb-1 opacity-50" />
            <p>Keine Regeln</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCoverageCard;
