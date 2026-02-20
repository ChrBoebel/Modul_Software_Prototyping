import { CheckCircle, MapPin } from 'lucide-react';
import { calculateNormalizedScore } from './previewUtils';

const PRODUCT_LABELS = {
  solar: 'Solar PV',
  heatpump: 'Wärmepumpe',
  energy_contract: 'Stromtarif',
  charging_station: 'E-Mobilität',
  energy_storage: 'Speicher'
};

const FlowSummaryView = ({
  leadCreated,
  totalScore,
  detectedProduct,
  extractedContact,
  collectedAnswers,
  addressAvailability
}) => {
  const normalizedScore = calculateNormalizedScore(totalScore);

  return (
    <div className="flow-preview-end">
      {leadCreated ? (
        <>
          <div className="flow-preview-success">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h4>Lead erfolgreich erstellt!</h4>
          <p>Der Lead wurde mit Score {normalizedScore} angelegt.</p>
        </>
      ) : (
        <>
          <h4>Flow beendet</h4>
          <p>Alle Schritte wurden durchlaufen.</p>

          {/* Summary of collected data */}
          <div className="flow-preview-summary">
            <div className="summary-item">
              <span className="summary-label">Gesammelter Score:</span>
              <span className="summary-value">
                {totalScore} Punkte → Lead-Score: {normalizedScore}
              </span>
            </div>
            {detectedProduct && (
              <div className="summary-item">
                <span className="summary-label">Erkanntes Produkt:</span>
                <span className="summary-value">
                  {PRODUCT_LABELS[detectedProduct]}
                </span>
              </div>
            )}
            {extractedContact && (
              <div className="summary-item">
                <span className="summary-label">Kontakt:</span>
                <span className="summary-value">{extractedContact}</span>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Beantwortete Fragen:</span>
              <span className="summary-value">{collectedAnswers.length}</span>
            </div>
            {addressAvailability && (
              <div className="summary-item">
                <span className="summary-label">
                  <MapPin size={14} className="inline mr-1" />
                  Verfügbare Produkte:
                </span>
                <span className="summary-value">
                  {addressAvailability.isServiceable ? (
                    <span className="availability-badges">
                      {addressAvailability.availableProducts.map(p => (
                        <span key={p.id} className="badge success mr-1">
                          {p.name}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="badge warning">Keine Produkte an dieser Adresse</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FlowSummaryView;
