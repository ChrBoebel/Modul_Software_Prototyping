import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Maximize2, Minimize2, Focus, X } from 'lucide-react';
import streets from '../../data/konstanzStreets.json';
import { designTokens } from '../../theme/designTokens';

const TECH_COLORS = {
  FTTH: designTokens.colors.availabilityFtth,
  KABEL: designTokens.colors.availabilityKabel,
  DSL: designTokens.colors.availabilityDsl,
  NONE: designTokens.colors.availabilityNone
};

const TECH_LABELS = {
  FTTH: 'Glasfaser',
  KABEL: 'Kabel',
  DSL: 'DSL',
  NONE: 'Nicht verfügbar'
};

// Component to handle map events and fly to location
const MapController = ({ flyTo, onFlyComplete, fitBoundsData, fitBoundsTrigger }) => {
  const map = useMap();

  // Handle fly to
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], 16, { duration: 0.8 });
      onFlyComplete?.();
    }
  }, [flyTo, map, onFlyComplete]);

  // Handle fit bounds
  useEffect(() => {
    if (fitBoundsTrigger > 0 && fitBoundsData && fitBoundsData.length > 0) {
      const bounds = fitBoundsData.map(b => [b.lat, b.lng]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true, duration: 0.5 });
    }
  }, [fitBoundsTrigger, fitBoundsData, map]);

  return null;
};

// Search Component
const MapSearch = ({ streets, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const filteredStreets = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return streets
      .filter(s => s.street.toLowerCase().includes(q) || s.postalCode.includes(q))
      .slice(0, 10);
  }, [query, streets]);

  useEffect(() => {
    if (query.length > 0) {
      setIsOpen(true);
    }
  }, [query]);

  const handleSelect = (street) => {
    onSelect(street);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="map-search-box">
      <Search size={16} className="map-search-icon" />
      <input
        ref={inputRef}
        type="text"
        className="map-search-input"
        placeholder="Straße suchen..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {query && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          onClick={() => { setQuery(''); inputRef.current?.focus(); }}
        >
          <X size={14} />
        </button>
      )}
      {isOpen && filteredStreets.length > 0 && (
        <div className="map-search-results">
          {filteredStreets.map(street => (
            <div
              key={street.id}
              className="map-search-result"
              onClick={() => handleSelect(street)}
            >
              <span
                className="map-search-result-icon"
                style={{ backgroundColor: TECH_COLORS[street.product.tech] }}
              />
              <div className="map-search-result-text">
                <div className="map-search-result-street">{street.street}</div>
                <div className="map-search-result-meta">
                  {street.postalCode} {street.borough} · {street.product.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && query && filteredStreets.length === 0 && (
        <div className="map-search-results">
          <div className="map-search-empty">Keine Ergebnisse für "{query}"</div>
        </div>
      )}
    </div>
  );
};

// Filter Pills Component
const FilterPills = ({ filter, setFilter, counts }) => {
  const filters = [
    { key: 'ALL', label: 'Alle', color: null },
    { key: 'FTTH', label: 'Glasfaser', color: TECH_COLORS.FTTH },
    { key: 'KABEL', label: 'Kabel', color: TECH_COLORS.KABEL },
    { key: 'DSL', label: 'DSL', color: TECH_COLORS.DSL },
    { key: 'NONE', label: 'Keine', color: TECH_COLORS.NONE },
  ];

  return (
    <div className="map-overlay-panel" style={{ top: 12, left: 300, right: 'auto' }}>
      <div className="map-filter-pills">
        {filters.map(f => (
          <button
            key={f.key}
            className={`map-filter-pill ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.color && (
              <span className="pill-dot" style={{ backgroundColor: f.color }} />
            )}
            <span>{f.label}</span>
            <span className="pill-count">({counts[f.key] || 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Stats Panel Component
const StatsPanel = ({ data, total }) => {
  const counts = useMemo(() => {
    const c = { FTTH: 0, KABEL: 0, DSL: 0, NONE: 0 };
    data.forEach(addr => {
      c[addr.product.tech] = (c[addr.product.tech] || 0) + 1;
    });
    return c;
  }, [data]);

  const stats = [
    { key: 'FTTH', label: 'Glasfaser', color: TECH_COLORS.FTTH },
    { key: 'KABEL', label: 'Kabel', color: TECH_COLORS.KABEL },
    { key: 'DSL', label: 'DSL', color: TECH_COLORS.DSL },
    { key: 'NONE', label: 'Nicht verfügbar', color: TECH_COLORS.NONE },
  ];

  return (
    <div className="map-overlay-panel map-stats-panel" style={{ top: 12, right: 56, width: 200 }}>
      <div className="map-stats-header">
        <span>Verfügbarkeit</span>
        <span className="map-stats-total">{total} Straßen</span>
      </div>
      {stats.map(stat => {
        const count = counts[stat.key];
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={stat.key} className="map-stat-row">
            <span className="map-stat-dot" style={{ backgroundColor: stat.color }} />
            <div className="map-stat-bar-wrapper">
              <div
                className="map-stat-bar"
                style={{ width: `${percent}%`, backgroundColor: stat.color }}
              />
            </div>
            <div className="map-stat-value">
              {count}
              <span className="map-stat-percent"> ({percent}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Legend Component
const Legend = () => (
  <div className="map-overlay-panel" style={{ bottom: 12, left: 12 }}>
    <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Legende</div>
    <div className="space-y-2">
      {Object.entries(TECH_COLORS).map(([tech, color]) => (
        <div key={tech} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs">{TECH_LABELS[tech]}</span>
        </div>
      ))}
    </div>
  </div>
);

// Interactive Circle Marker with hover effect
const InteractiveMarker = ({ street, isHighlighted, onHover }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <CircleMarker
      center={[street.lat, street.lng]}
      radius={hovered || isHighlighted ? 8 : 5}
      pathOptions={{
        fillColor: TECH_COLORS[street.product.tech],
        color: hovered || isHighlighted ? designTokens.colors.white : designTokens.colors.overlayWhite80,
        weight: hovered || isHighlighted ? 2 : 1,
        fillOpacity: hovered || isHighlighted ? 1 : 0.85
      }}
      eventHandlers={{
        mouseover: () => {
          setHovered(true);
          onHover?.(street);
        },
        mouseout: () => {
          setHovered(false);
          onHover?.(null);
        }
      }}
    >
      <Popup>
        <div className="min-w-[180px]">
          <div className="font-semibold text-base mb-1">{street.street}</div>
          <div className="text-slate-500 text-sm mb-3">
            {street.postalCode} {street.borough}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: TECH_COLORS[street.product.tech] }}
            />
            <span className="font-medium">{street.product.name}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(street.street + ', ' + street.postalCode + ' Konstanz')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              In Google Maps öffnen
            </a>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
};

const KonstanzMap = () => {
  const [filter, setFilter] = useState('ALL');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flyTo, setFlyTo] = useState(null);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);
  const [hoveredStreet, setHoveredStreet] = useState(null);
  const mapRef = useRef(null);

  // Calculate counts for all filters
  const allCounts = useMemo(() => {
    const c = { ALL: streets.length, FTTH: 0, KABEL: 0, DSL: 0, NONE: 0 };
    streets.forEach(s => {
      c[s.product.tech] = (c[s.product.tech] || 0) + 1;
    });
    return c;
  }, []);

  const filteredStreets = useMemo(() =>
    filter === 'ALL'
      ? streets
      : streets.filter(s => s.product.tech === filter),
    [filter]
  );

  const center = [47.69, 9.175];

  const handleSearchSelect = useCallback((street) => {
    setFlyTo(street);
  }, []);

  const handleZoomToFit = useCallback(() => {
    setFitBoundsTrigger(prev => prev + 1);
  }, []);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div
      ref={mapRef}
      className={`relative w-full rounded-lg overflow-hidden border border-slate-200 transition-all duration-300 ${
        isFullscreen ? 'map-fullscreen-wrapper' : 'h-[600px]'
      }`}
    >
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          flyTo={flyTo}
          onFlyComplete={() => setFlyTo(null)}
          fitBoundsData={filteredStreets}
          fitBoundsTrigger={fitBoundsTrigger}
        />

        {filteredStreets.map(street => (
          <InteractiveMarker
            key={street.id}
            street={street}
            isHighlighted={hoveredStreet?.id === street.id}
            onHover={setHoveredStreet}
          />
        ))}
      </MapContainer>

      {/* Search Box */}
      <MapSearch
        streets={streets}
        onSelect={handleSearchSelect}
      />

      {/* Filter Pills */}
      <FilterPills
        filter={filter}
        setFilter={setFilter}
        counts={allCounts}
      />

      {/* Stats Panel */}
      <StatsPanel data={filteredStreets} total={streets.length} />

      {/* Control Buttons */}
      <div className="map-controls-group map-controls-top-right">
        <button
          className={`map-control-btn ${isFullscreen ? 'active' : ''}`}
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Vollbild beenden (ESC)' : 'Vollbild'}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        <button
          className="map-control-btn"
          onClick={handleZoomToFit}
          title="Auf alle Punkte zoomen"
        >
          <Focus size={18} />
        </button>
      </div>

      {/* Legend */}
      <Legend />

      {/* Hover Tooltip */}
      {hoveredStreet && (
        <div
          className="absolute z-[1001] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border text-sm pointer-events-none"
          style={{ bottom: 60, left: 12 }}
        >
          <span className="font-medium">{hoveredStreet.street}</span>
          <span className="text-slate-400 ml-2">{hoveredStreet.product.name}</span>
        </div>
      )}
    </div>
  );
};

export default KonstanzMap;
