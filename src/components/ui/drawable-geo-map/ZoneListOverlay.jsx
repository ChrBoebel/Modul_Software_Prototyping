import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { getProductColor } from '../../../theme/productColors';
import { theme } from '../../../theme/colors';
import { calculateArea, formatArea } from './utils';

/**
 * Zone List Overlay Component
 */
const ZoneListOverlay = ({
    zones,
    products,
    onZoneClick,
    onZoneToggleVisibility,
    onZoneDelete,
    hoveredZoneId,
    onZoneHover,
    hiddenZones
}) => {
    if (zones.length === 0) return null;

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product?.name || 'Kein Produkt';
    };

    return (
        <div className="map-overlay-panel" style={{ bottom: 12, left: 12, width: 260, maxHeight: 320, overflowY: 'auto' }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Zonen ({zones.length})</span>
            </div>
            <div className="map-zone-list">
                {zones.map(zone => {
                    const color = zone.productId ? getProductColor(zone.productId) : theme.colors.slate400;
                    const area = calculateArea(zone.coordinates);
                    const isHidden = hiddenZones?.has(zone.id);
                    const isHovered = hoveredZoneId === zone.id;

                    return (
                        <div
                            key={zone.id}
                            className={`map-zone-item ${isHovered ? 'active' : ''}`}
                            onClick={() => onZoneClick?.(zone)}
                            onMouseEnter={() => onZoneHover?.(zone.id)}
                            onMouseLeave={() => onZoneHover?.(null)}
                            style={{ opacity: isHidden ? 0.5 : 1 }}
                        >
                            <span className="map-zone-color" style={{ backgroundColor: color }} />
                            <div className="map-zone-info">
                                <div className="map-zone-name">{zone.name}</div>
                                <div className="map-zone-meta">
                                    <span>{getProductName(zone.productId)}</span>
                                    <span>{formatArea(area)}</span>
                                </div>
                            </div>
                            <div className="map-zone-actions">
                                <button
                                    className="map-zone-action-btn"
                                    onClick={(e) => { e.stopPropagation(); onZoneToggleVisibility?.(zone.id); }}
                                    title={isHidden ? 'Zone anzeigen' : 'Zone ausblenden'}
                                >
                                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button
                                    className="map-zone-action-btn danger"
                                    onClick={(e) => { e.stopPropagation(); onZoneDelete?.(zone.id); }}
                                    title="Zone l\u00F6schen"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ZoneListOverlay;
