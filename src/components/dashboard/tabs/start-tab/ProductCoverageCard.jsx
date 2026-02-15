import { MapPin, Package } from 'lucide-react';
import { Tooltip as UiTooltip } from '../../../ui';
import { theme } from '../../../../theme/colors';

const ProductCoverageCard = ({ productStats, availabilityChartData, onNavigate }) => {
  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
      onClick={() => onNavigate && onNavigate('produkt-mapping')}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
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
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>
          <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Produkt-Abdeckung
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Details →</span>
      </div>
      <div style={{ padding: '0.5rem 0' }}>
        {/* Quick Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.secondary }}>
              {productStats.totalProducts}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>Produkte</div>
          </div>
          <UiTooltip content="Postleitzahlen mit aktiven Verfügbarkeitsregeln">
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0, cursor: 'help' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.primary }}>
                {productStats.coveredPlzCount}
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>PLZ</div>
            </div>
          </UiTooltip>
          <UiTooltip content="Aktive Regeln die Produktverfügbarkeit definieren">
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0, cursor: 'help' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.slate500 }}>
                {productStats.totalRules}
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>Regeln</div>
            </div>
          </UiTooltip>
          <UiTooltip content="Verhältnis zu ~8000 deutschen PLZ-Bereichen">
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0, cursor: 'help' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.success }}>
                {productStats.coveragePercent}%
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>Abdeckung</div>
            </div>
          </UiTooltip>
        </div>

        {/* Top Products */}
        {productStats.topProducts.length > 0 && (
          <div>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: '0.375rem'
            }}>
              Top Produkte
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {productStats.topProducts.map((prod, idx) => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.375rem 0.5rem',
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: idx === 0 ? theme.colors.secondary : idx === 1 ? theme.colors.slate400 : theme.colors.slate300,
                      color: '#fff',
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.name}</span>
                  </div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                    {prod.ruleCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stacked Bar - replaces Pie Chart (Tufte: maximize data-ink ratio) */}
        {(productStats.totalProducts > 0 || productStats.totalRules > 0) && (
          <div style={{ marginTop: '0.75rem' }}>
            {/* 100% Stacked Bar */}
            {(() => {
              const total = availabilityChartData.reduce((sum, d) => sum + d.value, 0);
              return (
                <div style={{
                  display: 'flex',
                  height: 8,
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'var(--slate-100)'
                }}>
                  {availabilityChartData.map((item, idx) => {
                    const width = total > 0 ? (item.value / total * 100) : 0;
                    return width > 0 ? (
                      <div
                        key={idx}
                        style={{
                          width: `${width}%`,
                          backgroundColor: item.color,
                          transition: 'width 0.3s ease'
                        }}
                        title={`${item.name}: ${item.value}`}
                      />
                    ) : null;
                  })}
                </div>
              );
            })()}
            {/* Legend with values */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              gap: '0.5rem'
            }}>
              {availabilityChartData.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.625rem'
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: item.color,
                    flexShrink: 0
                  }} />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {item.value}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)' }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {productStats.topProducts.length === 0 && productStats.totalRules === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '0.5rem',
            color: 'var(--text-tertiary)',
            fontSize: '0.75rem'
          }}>
            <Package size={18} style={{ marginBottom: '0.25rem', opacity: 0.5 }} />
            <p>Keine Regeln</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCoverageCard;
