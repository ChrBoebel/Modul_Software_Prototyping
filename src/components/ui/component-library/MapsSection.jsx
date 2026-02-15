import GeoMap from '../GeoMap';
import { ComponentSection, ComponentShowcase } from './shared';

const MapsSection = () => {
  const sampleLocations = [
    { id: 1, lat: 47.6779, lng: 9.1732, label: 'Konstanz Zentrum' },
    { id: 2, lat: 47.6821, lng: 9.1654, label: 'Bahnhof' }
  ];

  return (
    <ComponentSection
      title="Maps"
      description="Kartenkomponenten für geografische Darstellungen."
    >
      <ComponentShowcase
        title="GeoMap"
        code={`<GeoMap
  center={[47.6779, 9.1732]}
  zoom={13}
  markers={[
    { lat: 47.6779, lng: 9.1732, label: 'Standort' }
  ]}
  height="300px"
/>`}
      >
        <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
          <GeoMap
            center={[47.6779, 9.1732]}
            zoom={13}
            markers={sampleLocations}
          />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="DrawableGeoMap (Info)"
        code={`<DrawableGeoMap
  center={[47.6779, 9.1732]}
  zoom={13}
  onZoneCreated={(zone) => handleZone(zone)}
  drawingEnabled={true}
/>`}
      >
        <div className="preview-stack">
          <p>Die <strong>DrawableGeoMap</strong> erweitert die GeoMap um Zeichenfunktionen:</p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Polygone zeichnen (Zonen definieren)</li>
            <li>Escape-Taste zum Abbrechen</li>
            <li>Crosshair-Cursor im Zeichenmodus</li>
            <li>Zone-Callbacks für CRUD-Operationen</li>
          </ul>
          <p><em>Siehe Produkt-Mapping &rarr; Map-Overview für ein Live-Beispiel.</em></p>
        </div>
      </ComponentShowcase>
    </ComponentSection>
  );
};

export default MapsSection;
