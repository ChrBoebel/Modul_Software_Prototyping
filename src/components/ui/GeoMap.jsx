import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { getProductColor, getTechnologyFromProductId, TECHNOLOGY_COLORS } from '../../theme/productColors';
import { theme } from '../../theme/colors';
import { Maximize2, Minimize2, Focus, ChevronDown, ChevronUp } from 'lucide-react';

// Fix for default Leaflet icons in Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * FitBounds Component
 */
const FitBoundsController = ({ polygons }) => {
    const map = useMap();

    const fitToPolygons = useCallback(() => {
        if (polygons.length === 0) return;

        const allCoords = polygons.flatMap(p => p.coordinates || []);
        if (allCoords.length > 0) {
            map.fitBounds(allCoords, { padding: [50, 50], maxZoom: 15 });
        }
    }, [polygons, map]);

    useEffect(() => {
        // Expose fitToPolygons to parent
    }, [fitToPolygons]);

    return null;
};

/**
 * MapLegend Component - Improved with collapsible groups
 */
const MapLegend = ({
    products,
    visibleProducts,
    onProductToggle,
    position = 'bottomright'
}) => {
    const [collapsedGroups, setCollapsedGroups] = useState(new Set());

    // Group products by technology
    const grouped = useMemo(() => {
        const groups = { FTTH: [], KABEL: [], DSL: [] };
        products.forEach(p => {
            const tech = getTechnologyFromProductId(p.id);
            if (tech && groups[tech]) {
                groups[tech].push(p);
            }
        });
        return groups;
    }, [products]);

    const techOrder = ['FTTH', 'KABEL', 'DSL'];

    const toggleGroup = (tech) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(tech)) {
                next.delete(tech);
            } else {
                next.add(tech);
            }
            return next;
        });
    };

    const getVisibleCount = (techProducts) => {
        if (visibleProducts === null) return techProducts.length;
        return techProducts.filter(p => visibleProducts.has(p.id)).length;
    };

    const toggleAllInGroup = (tech, techProducts) => {
        if (!onProductToggle) return;
        const allVisible = techProducts.every(p => visibleProducts === null || visibleProducts.has(p.id));
        techProducts.forEach(p => {
            if (allVisible) {
                // Hide all
                if (visibleProducts === null || visibleProducts.has(p.id)) {
                    onProductToggle(p.id);
                }
            } else {
                // Show all
                if (visibleProducts !== null && !visibleProducts.has(p.id)) {
                    onProductToggle(p.id);
                }
            }
        });
    };

    return (
        <div className={`map-legend map-legend-${position}`}>
            <div className="map-legend-header">Produkt-Verfügbarkeit</div>

            {techOrder.map(tech => {
                const techProducts = grouped[tech];
                if (!techProducts || techProducts.length === 0) return null;

                const isCollapsed = collapsedGroups.has(tech);
                const visibleCount = getVisibleCount(techProducts);
                const techColor = TECHNOLOGY_COLORS[tech]?.base || theme.colors.muted;

                return (
                    <div key={tech} className="map-legend-group">
                        <div
                            className="map-legend-tech"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                padding: '4px 0',
                                marginBottom: isCollapsed ? 0 : 4
                            }}
                            onClick={() => toggleGroup(tech)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: techColor
                                    }}
                                />
                                <span>{TECHNOLOGY_COLORS[tech]?.name || tech}</span>
                                <span style={{ opacity: 0.6, fontSize: '10px' }}>
                                    ({visibleCount}/{techProducts.length})
                                </span>
                            </div>
                            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </div>

                        {!isCollapsed && (
                            <div style={{ paddingLeft: 4 }}>
                                {techProducts.map(product => {
                                    const isVisible = visibleProducts === null || visibleProducts.has(product.id);
                                    return (
                                        <label key={product.id} className="map-legend-item">
                                            <input
                                                type="checkbox"
                                                checked={isVisible}
                                                onChange={() => onProductToggle?.(product.id)}
                                            />
                                            <span
                                                className="map-legend-color"
                                                style={{
                                                    backgroundColor: getProductColor(product.id),
                                                    opacity: isVisible ? 1 : 0.4
                                                }}
                                            />
                                            <span
                                                className="map-legend-label"
                                                style={{ opacity: isVisible ? 1 : 0.5 }}
                                            >
                                                {product.name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Interactive Polygon with hover effects
 */
const InteractivePolygon = ({ polygon, products, isHovered, onHover }) => {
    const [localHover, setLocalHover] = useState(false);

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product?.name || productId;
    };

    const isActive = localHover || isHovered;
    const baseOpacity = polygon.fillOpacity ?? 0.2;

    return (
        <Polygon
            positions={polygon.coordinates}
            pathOptions={{
                color: polygon.color || 'blue',
                fillColor: polygon.fillColor || polygon.color || 'blue',
                fillOpacity: isActive ? Math.min(baseOpacity + 0.15, 0.6) : baseOpacity,
                weight: isActive ? 2 : 1,
            }}
            eventHandlers={{
                mouseover: () => {
                    setLocalHover(true);
                    onHover?.(polygon.id);
                },
                mouseout: () => {
                    setLocalHover(false);
                    onHover?.(null);
                }
            }}
        >
            <Popup>
                {polygon.isLegacyZone ? (
                    <div style={{ fontSize: '14px' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>{polygon.title}</strong>
                        {polygon.description && <div style={{ color: theme.colors.muted }}>{polygon.description}</div>}
                    </div>
                ) : (
                    <div style={{ fontSize: '14px', minWidth: '160px' }}>
                        <strong style={{ display: 'block', marginBottom: '8px', fontSize: '15px' }}>
                            PLZ {polygon.postalCode}
                        </strong>
                        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                borderRadius: '4px',
                                backgroundColor: polygon.color,
                            }} />
                            <span style={{ fontWeight: 500 }}>{getProductName(polygon.productId)}</span>
                        </div>
                        <div style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 500,
                            backgroundColor: polygon.effect === 'allow' ? theme.colors.availabilityAllowLight : theme.colors.availabilityDenyLight,
                            color: polygon.effect === 'allow' ? theme.colors.availabilityAllow : theme.colors.danger
                        }}>
                            {polygon.effect === 'allow' ? '✓ Verfügbar' : '✗ Nicht verfügbar'}
                        </div>
                    </div>
                )}
            </Popup>
        </Polygon>
    );
};

/**
 * GeoMap Component
 * @param {Array} markers - Array of objects { id, lat, lng, title, description, color }
 * @param {Array} zones - Legacy: Array of zone objects for backward compatibility
 * @param {Array} productLayers - Array of product layer objects { productId, postalCode, coordinates, effect }
 * @param {Array} products - Product catalog for legend labels
 * @param {Array} center - [lat, lng]
 * @param {Number} zoom - Initial zoom level
 * @param {String} height - height of the map container
 * @param {Boolean} showLegend - Show/hide legend
 * @param {String} legendPosition - 'topright', 'bottomright', 'bottomleft', 'topleft'
 * @param {Set} visibleProducts - Set of product IDs to show (null = all)
 * @param {Function} onProductToggle - Callback when product visibility changes
 */
const GeoMap = ({
    markers = [],
    zones = [],
    productLayers = [],
    products = [],
    center = [47.71, 9.15], // Konstanz north (land areas)
    zoom = 12,
    height = '500px',
    showLegend = false,
    legendPosition = 'bottomright',
    visibleProducts = null,
    onProductToggle,
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hoveredPolygonId, setHoveredPolygonId] = useState(null);
    const mapRef = useRef(null);

    // Combine legacy zones with product layers
    const allPolygons = useMemo(() => {
        const polygons = [];

        // Add legacy zones (backward compatibility)
        zones.forEach(zone => {
            polygons.push({
                ...zone,
                isLegacyZone: true,
                fillOpacity: 0.2
            });
        });

        // Add product layers
        productLayers.forEach(layer => {
            // Skip if product is filtered out
            if (visibleProducts !== null && !visibleProducts.has(layer.productId)) {
                return;
            }

            const color = getProductColor(layer.productId);
            polygons.push({
                id: `${layer.productId}-${layer.postalCode}`,
                coordinates: layer.coordinates,
                color: color,
                fillColor: color,
                fillOpacity: 0.3,
                productId: layer.productId,
                postalCode: layer.postalCode,
                effect: layer.effect,
                isLegacyZone: false
            });
        });

        return polygons;
    }, [zones, productLayers, visibleProducts]);

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
            className={`relative transition-all duration-300 ${isFullscreen ? 'map-fullscreen-wrapper' : ''}`}
            style={{
                height: isFullscreen ? '100vh' : height,
                width: '100%',
                borderRadius: isFullscreen ? 0 : 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
            }}
        >
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBoundsController polygons={allPolygons} />

                {/* Render polygons with hover effects */}
                {allPolygons.map((polygon) => (
                    <InteractivePolygon
                        key={polygon.id}
                        polygon={polygon}
                        products={products}
                        isHovered={hoveredPolygonId === polygon.id}
                        onHover={setHoveredPolygonId}
                    />
                ))}

                {/* Render markers */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        icon={marker.icon || DefaultIcon}
                    >
                        <Popup>
                            <div style={{ fontSize: '14px' }}>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>{marker.title}</strong>
                                {marker.description && <div style={{ color: theme.colors.muted }}>{marker.description}</div>}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend overlay */}
            {showLegend && products.length > 0 && (
                <MapLegend
                    products={products}
                    visibleProducts={visibleProducts}
                    onProductToggle={onProductToggle}
                    position={legendPosition}
                />
            )}

            {/* Control Buttons */}
            <div className="map-controls-group map-controls-top-right">
                <button
                    className={`map-control-btn ${isFullscreen ? 'active' : ''}`}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? 'Vollbild beenden (ESC)' : 'Vollbild'}
                >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
            </div>
        </div>
    );
};

export default GeoMap;
