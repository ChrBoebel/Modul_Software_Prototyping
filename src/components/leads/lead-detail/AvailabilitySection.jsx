import { MapPin } from 'lucide-react';

const AvailabilitySection = ({ personalData, productAvailability, onNavigateToProduktMapping }) => (
  <div className="section-content">
    {!personalData.address ? (
      <p className="text-muted text-sm text-[var(--text-secondary)]">
        Keine Adresse bekannt
      </p>
    ) : productAvailability === null ? (
      <p className="text-muted text-sm text-[var(--text-secondary)]">
        Verfügbarkeit konnte nicht geprüft werden
      </p>
    ) : productAvailability.availableProducts?.length > 0 ? (
      <div className="availability-list">
        <p className="text-sm mb-3 text-[var(--text-secondary)]">
          Verfügbare Produkte an dieser Adresse:
        </p>
        <div className="flex flex-wrap gap-2">
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
          <p className="text-xs mt-3 text-[var(--text-tertiary)]">
            Adresse gefunden: {productAvailability.matchedAddress.street} {productAvailability.matchedAddress.housenumber}, {productAvailability.matchedAddress.zip} {productAvailability.matchedAddress.city}
          </p>
        )}
      </div>
    ) : (
      <p className="text-sm text-[var(--warning)]">
        Keine Produkte an dieser Adresse verfügbar
      </p>
    )}
    {/* Button to navigate to Produkt-Mapping for address check */}
    {onNavigateToProduktMapping && personalData.address && (
      <div className="mt-4 pt-3 border-t border-[var(--border-light)]">
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
