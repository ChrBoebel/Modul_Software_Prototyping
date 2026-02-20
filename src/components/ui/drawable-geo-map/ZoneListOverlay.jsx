import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { getProductColor } from '../../../theme/productColors';
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
        <div className="map-overlay-panel bottom-3 left-3 w-[260px] max-h-[320px] overflow-y-auto">
            <div className="font-semibold mb-3 text-[13px] flex justify-between items-center">
                <span>Zonen ({zones.length})</span>
            </div>
            <div className="map-zone-list">
                {zones.map(zone => {
                    const color = zone.productId ? getProductColor(zone.productId) : 'var(--slate-400)';
                    const colorStyle = { backgroundColor: color };
                    const area = calculateArea(zone.coordinates);
                    const isHidden = hiddenZones?.has(zone.id);
                    const isHovered = hoveredZoneId === zone.id;

                    return (
                        <div
                            key={zone.id}
                            onClick={() => onZoneClick?.(zone)}
                            onMouseEnter={() => onZoneHover?.(zone.id)}
                            onMouseLeave={() => onZoneHover?.(null)}
                            className={`map-zone-item ${isHovered ? 'active' : ''} ${isHidden ? 'opacity-50' : ''}`}
                        >
                            <span className="map-zone-color" style={colorStyle} />
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
