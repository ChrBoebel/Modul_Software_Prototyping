import { MapPin } from 'lucide-react';

const AvailabilitySection = ({ personalData, productAvailability, onNavigateToProduktMapping }) => (
  <div className="section-content">
    {!personalData.address ? (
      <p className="text-muted" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Keine Adresse bekannt
      </p>
    ) : productAvailability === null ? (
      <p className="text-muted" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Verfügbarkeit konnte nicht geprüft werden
      </p>
    ) : productAvailability.availableProducts?.length > 0 ? (
      <div className="availability-list">
        <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
          Verfügbare Produkte an dieser Adresse:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {productAvailability.availableProducts.map(item => (
            <span
              key={item.product?.id || item.id}
              className={`score-badge ${item.isPlanned ? 'medium' : 'high'}`}
              title={item.isPlanned ? 'Geplant' : 'Verfügbar'}
            >
              {item.product?.name || item.name || item.product?.id || item.id}
            </span>
          ))}
        </div>
        {productAvailability.matchedAddress && (
          <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', color: 'var(--text-tertiary)' }}>
            Adresse gefunden: {productAvailability.matchedAddress.street} {productAvailability.matchedAddress.housenumber}, {productAvailability.matchedAddress.zip} {productAvailability.matchedAddress.city}
          </p>
        )}
      </div>
    ) : (
      <p style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>
        Keine Produkte an dieser Adresse verfügbar
      </p>
    )}
    {/* Button to navigate to Produkt-Mapping for address check */}
    {onNavigateToProduktMapping && personalData.address && (
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigateToProduktMapping(personalData.address)}
        >
          <MapPin size={14} />
          Adresse im Mapping prüfen
        </button>
      </div>
    )}
  </div>
);

export default AvailabilitySection;
