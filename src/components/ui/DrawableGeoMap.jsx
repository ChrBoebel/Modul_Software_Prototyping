import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { getProductColor, TECHNOLOGY_COLORS } from '../../theme/productColors';
import { Eye, EyeOff, Pencil, Trash2, Maximize2, Minimize2, Focus, Info, Move, Hexagon, Check, X, Layers } from 'lucide-react';
import { Tooltip } from './Tooltip';

// Fix for default Leaflet icons
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

// German localization for leaflet-draw
const GERMAN_DRAW_STRINGS = {
    draw: {
        handlers: {
            polygon: {
                tooltip: {
                    start: 'Klicken um mit dem Zeichnen zu beginnen.',
                    cont: 'Klicken um weitere Punkte hinzuzufügen.',
                    end: 'Auf den ersten Punkt klicken um das Polygon zu schließen.'
                }
            }
        }
    }
};

/**
 * Calculate polygon area in square meters
 */
const calculateArea = (coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;

    const latToMeters = 111320;
    const lngToMeters = 111320 * Math.cos(47.7 * Math.PI / 180);

    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const xi = coordinates[i][1] * lngToMeters;
        const yi = coordinates[i][0] * latToMeters;
        const xj = coordinates[j][1] * lngToMeters;
        const yj = coordinates[j][0] * latToMeters;
        area += xi * yj;
        area -= xj * yi;
    }

    return Math.abs(area / 2);
};

/**
 * Format area for display
 */
const formatArea = (areaM2) => {
    if (areaM2 >= 1000000) {
        return `${(areaM2 / 1000000).toFixed(2)} km²`;
    } else if (areaM2 >= 10000) {
        return `${(areaM2 / 10000).toFixed(2)} ha`;
    } else {
        return `${Math.round(areaM2).toLocaleString('de-DE')} m²`;
    }
};

/**
 * MapController Component
 * Handles draw controls and edit functionality (Logic Only)
 */
const MapController = ({
    zones,
    onZoneCreated,
    onZoneEdited,
    onZoneDeleted,
    onDrawStart,
    onDrawEnd,
    onEditStart,
    onEditEnd,
    editable,
    controllerRef,
    products,
    fitToZonesRef
}) => {
    const map = useMap();
    const drawnItemsRef = useRef(null);
    const zoneLayersRef = useRef(new Map());

    // Handlers refs
    const polygonDrawerRef = useRef(null);
    const editHandlerRef = useRef(null);
    const deleteHandlerRef = useRef(null);

    // Create/update zone layers
    useEffect(() => {
        if (!map || !drawnItemsRef.current) return;

        const drawnItems = drawnItemsRef.current;

        // Clear existing layers
        drawnItems.clearLayers();
        zoneLayersRef.current.clear();

        // Add zones as layers
        zones.forEach(zone => {
            const color = zone.productId ? getProductColor(zone.productId) : '#94A3B8';
            const polygon = L.polygon(zone.coordinates, {
                color: color,
                fillColor: color,
                fillOpacity: 0.3,
                weight: 2,
            });

            // Store zone id on layer
            polygon.zoneId = zone.id;

            drawnItems.addLayer(polygon);
            zoneLayersRef.current.set(zone.id, polygon);
        });
    }, [zones, map, products]);

    // Initialize map layers and handlers
    useEffect(() => {
        if (!map) return;

        // Safety check for Leaflet Draw
        if (!L.Control?.Draw) {
            console.error('Leaflet Draw not loaded correctly');
            return;
        }

        try {
            if (L.drawLocal) {
                L.drawLocal = GERMAN_DRAW_STRINGS;
            }

            const drawnItems = new L.FeatureGroup();
            drawnItemsRef.current = drawnItems;
            map.addLayer(drawnItems);

            // Initialize Handlers
            if (editable) {
                // Polygon Drawer
                polygonDrawerRef.current = new L.Draw.Polygon(map, {
                    allowIntersection: false,
                    drawError: {
                        color: '#ef4444',
                        message: '<strong>Fehler:</strong> Linien dürfen sich nicht kreuzen!'
                    },
                    shapeOptions: {
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.2,
                        weight: 2,
                        dashArray: '5, 5'
                    },
                    showArea: true,
                    metric: true,
                    guidelineDistance: 10
                });

                // Edit Handler
                editHandlerRef.current = new L.EditToolbar.Edit(map, {
                    featureGroup: drawnItems,
                    selectedPathOptions: {
                        dashArray: '10, 10',
                        fillOpacity: 0.15,
                        maintainColor: true
                    }
                });

                // Delete Handler
                deleteHandlerRef.current = new L.EditToolbar.Delete(map, {
                    featureGroup: drawnItems
                });
            }
        } catch (error) {
            console.error('Error initializing map controls:', error);
        }

        // Event Handlers
        const handleCreated = (e) => {
            const layer = e.layer;
            if (e.layerType === 'polygon') {
                const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
                const id = `zone-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

                onZoneCreated?.({
                    id,
                    coordinates,
                    productId: null,
                    name: `Zone ${zones.length + 1}`
                });
            }
            onDrawEnd?.();
        };

        const handleDrawStart = () => {
            onDrawStart?.();
        }

        // const handleDrawStop = () => { onDrawEnd?.(); };

        const handleEdited = (e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
                if (layer.zoneId) {
                    const newCoordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
                    onZoneEdited?.(layer.zoneId, { coordinates: newCoordinates });
                }
            });
            onEditEnd?.();
        };

        const handleDeleted = (e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
                if (layer.zoneId) {
                    onZoneDeleted?.(layer.zoneId);
                }
            });
        };

        try {
            map.on(L.Draw.Event.CREATED, handleCreated);
            map.on(L.Draw.Event.DRAWSTART, handleDrawStart);
            map.on(L.Draw.Event.EDITED, handleEdited);
            map.on(L.Draw.Event.DELETED, handleDeleted);
        } catch (e) {
            console.warn('Failed to attach draw events', e);
        }

        return () => {
            // Cleanup
            try {
                map.off(L.Draw.Event.CREATED, handleCreated);
                map.off(L.Draw.Event.DRAWSTART, handleDrawStart);
                map.off(L.Draw.Event.EDITED, handleEdited);
                map.off(L.Draw.Event.DELETED, handleDeleted);
                if (drawnItems) map.removeLayer(drawnItems);

                if (polygonDrawerRef.current) polygonDrawerRef.current.disable();
                if (editHandlerRef.current) editHandlerRef.current.disable();
                if (deleteHandlerRef.current) deleteHandlerRef.current.disable();
            } catch (e) {
                console.warn('Error cleanup map controls', e);
            }
        };
    }, [map, editable, zones.length, onZoneCreated, onDrawStart, onDrawEnd, onZoneEdited, onEditEnd, onZoneDeleted]); // Added zones.length to keep drawnitems sync

    // Assign methods to ref
    useEffect(() => {
        if (controllerRef && editable) {
            controllerRef.current = {
                startDraw: () => {
                    polygonDrawerRef.current?.enable();
                },
                cancelDraw: () => {
                    polygonDrawerRef.current?.disable();
                    onDrawEnd?.();
                },
                startEdit: () => {
                    editHandlerRef.current?.enable();
                    onEditStart?.();
                },
                saveEdit: () => {
                    editHandlerRef.current?.save();
                    editHandlerRef.current?.disable();
                },
                cancelEdit: () => {
                    editHandlerRef.current?.revertLayers();
                    editHandlerRef.current?.disable();
                    onEditEnd?.();
                },
                startDelete: () => {
                    deleteHandlerRef.current?.enable();
                },
                saveDelete: () => {
                    deleteHandlerRef.current?.save();
                    deleteHandlerRef.current?.disable();
                },
                cancelDelete: () => {
                    deleteHandlerRef.current?.revertLayers();
                    deleteHandlerRef.current?.disable();
                }
            };
        }
    }, [controllerRef, editable, onDrawStart, onDrawEnd, onEditStart, onEditEnd]);

    // Expose fitToZones
    useEffect(() => {
        if (fitToZonesRef) {
            fitToZonesRef.current = () => {
                const allCoords = zones.flatMap(z => z.coordinates);
                if (allCoords.length > 0) {
                    map.fitBounds(allCoords, { padding: [50, 50], maxZoom: 15 });
                }
            };
        }
    }, [zones, map, fitToZonesRef]);

    return null; // No UI rendering!
};

/**
 * Help Box Component
 */
const HelpBox = ({ isDrawing, isEditing, isDeleting, zonesCount }) => {
    if (isDrawing) {
        return (
            <div className="map-help-box">
                <Hexagon size={18} className="map-help-box-icon" />
                <div>
                    <strong>Polygon zeichnen:</strong> Klicken für Eckpunkte, auf ersten Punkt klicken zum Abschließen.
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="map-help-box" style={{ background: 'rgba(234, 88, 12, 0.95)' }}>
                <Move size={18} className="map-help-box-icon" />
                <div>
                    <strong>Bearbeiten:</strong> Weiße Punkte verschieben. Klicke auf <Check size={14} className="inline" /> zum Speichern.
                </div>
            </div>
        );
    }

    if (isDeleting) {
        return (
            <div className="map-help-box" style={{ background: 'rgba(220, 38, 38, 0.95)' }}>
                <Trash2 size={18} className="map-help-box-icon" />
                <div>
                    <strong>Löschen:</strong> Klicke auf zu löschende Zonen. Bestätige mit <Check size={14} className="inline" />.
                </div>
            </div>
        );
    }

    if (zonesCount === 0) {
        return (
            <div className="map-draw-instructions">
                <span className="map-draw-icon">✏️</span>
                <span>Nutze das Zeichnen-Werkzeug oben rechts</span>
            </div>
        );
    }

    return null;
};

/**
 * Technology Legend Component
 */
const TechnologyLegend = ({ zones, products }) => {
    // Get unique technologies used in zones
    const usedTechnologies = useMemo(() => {
        const techSet = new Set();
        zones.forEach(zone => {
            if (zone.productId) {
                const product = products.find(p => p.id === zone.productId);
                if (product?.config?.technology) {
                    techSet.add(product.config.technology);
                }
            }
        });
        return Array.from(techSet);
    }, [zones, products]);

    if (usedTechnologies.length === 0) return null;

    return (
        <div className="map-overlay-panel" style={{ top: 12, left: 12, width: 'auto', minWidth: 140 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={14} />
                <span>Legende</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {usedTechnologies.map(tech => {
                    const config = TECHNOLOGY_COLORS[tech];
                    if (!config) return null;
                    return (
                        <div key={tech} className="flex items-center gap-2 text-xs">
                            <span
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{ backgroundColor: config.base }}
                            />
                            <span className="text-slate-600">{config.name}</span>
                        </div>
                    );
                })}
                <div className="flex items-center gap-2 text-xs mt-1 pt-1 border-t border-slate-200">
                    <span
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: '#94A3B8' }}
                    />
                    <span className="text-slate-500">Kein Produkt</span>
                </div>
            </div>
        </div>
    );
};

/**
 * Toolbar Button with Tooltip
 */
const ToolbarButton = ({
    icon: Icon,
    tooltip,
    onClick,
    active = false,
    disabled = false,
    variant = 'default' // 'default', 'success', 'danger'
}) => {
    const variantClasses = {
        default: active ? 'bg-primary text-white' : '',
        success: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
        danger: 'bg-red-100 text-red-600 hover:bg-red-200'
    };

    return (
        <Tooltip content={tooltip} position="left">
            <button
                className={`map-control-btn ${variantClasses[variant]} ${active ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={onClick}
                disabled={disabled}
                style={{ opacity: disabled ? 0.5 : 1 }}
                aria-label={tooltip}
            >
                <Icon size={18} />
            </button>
        </Tooltip>
    );
};

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
                    const color = zone.productId ? getProductColor(zone.productId) : '#94A3B8';
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
                                    title="Zone löschen"
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

/**
 * DrawableGeoMap Component
 * Allows users to draw and edit zones on the map with improved UX
 */
const DrawableGeoMap = ({
    zones = [],
    onZoneCreated,
    onZoneEdited,
    onZoneDeleted,
    onZoneClick,
    products = [],
    center = [47.71, 9.15],
    zoom = 12,
    height = '500px',
    editable = true,
}) => {
    // UI State
    const [mode, setMode] = useState(null); // 'draw', 'edit', 'delete', null
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hoveredZoneId, setHoveredZoneId] = useState(null);
    const [hiddenZones, setHiddenZones] = useState(new Set());
    const mapRef = useRef(null);
    const fitToZonesRef = useRef(null);
    const controllerRef = useRef(null); // To control MapController

    const handleToggleVisibility = useCallback((zoneId) => {
        setHiddenZones(prev => {
            const next = new Set(prev);
            if (next.has(zoneId)) {
                next.delete(zoneId);
            } else {
                next.add(zoneId);
            }
            return next;
        });
    }, []);

    const handleDelete = useCallback((zoneId) => {
        if (window.confirm('Zone wirklich löschen?')) {
            onZoneDeleted?.(zoneId);
        }
    }, [onZoneDeleted]);

    const handleFitToZones = useCallback(() => {
        fitToZonesRef.current?.();
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

    // Filter visible zones
    const visibleZones = useMemo(() =>
        zones.filter(z => !hiddenZones.has(z.id)),
        [zones, hiddenZones]
    );

    // Handler wrappers
    const startDraw = () => {
        setMode('draw');
        controllerRef.current?.startDraw();
    };

    const cancelDraw = () => {
        controllerRef.current?.cancelDraw();
        // Mode cleared by callback
    };

    const startEdit = () => {
        setMode('edit');
        controllerRef.current?.startEdit();
    };

    const saveEdit = () => {
        controllerRef.current?.saveEdit();
        // Mode cleared by callback
    };

    const cancelEdit = () => {
        controllerRef.current?.cancelEdit();
        // Mode cleared by callback
    };

    const startDelete = () => {
        setMode('delete');
        controllerRef.current?.startDelete();
    };

    const saveDelete = () => {
        controllerRef.current?.saveDelete();
        setMode(null); // Delete handler doesn't fire editEnd equivalent often
    };

    const cancelDelete = () => {
        controllerRef.current?.cancelDelete();
        setMode(null);
    };

    return (
        <div
            ref={mapRef}
            className={`relative w-full rounded-lg overflow-hidden border border-slate-200 transition-all duration-300 ${isFullscreen ? 'map-fullscreen-wrapper' : ''
                }`}
            style={{ height: isFullscreen ? '100vh' : height }}
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

                <MapController
                    zones={visibleZones}
                    onZoneCreated={onZoneCreated}
                    onZoneEdited={onZoneEdited}
                    onZoneDeleted={onZoneDeleted}
                    onDrawStart={() => setMode('draw')}
                    onDrawEnd={() => setMode(null)}
                    onEditStart={() => setMode('edit')}
                    onEditEnd={() => setMode(null)}
                    editable={editable}
                    controllerRef={controllerRef}
                    fitToZonesRef={fitToZonesRef}
                    products={products}
                />
            </MapContainer>

            {/* Help Box */}
            <HelpBox
                isDrawing={mode === 'draw'}
                isEditing={mode === 'edit'}
                isDeleting={mode === 'delete'}
                zonesCount={zones.length}
            />

            {/* Technology Legend */}
            <TechnologyLegend zones={zones} products={products} />

            {/* Zone List Overlay */}
            <ZoneListOverlay
                zones={zones}
                products={products}
                onZoneClick={onZoneClick}
                onZoneToggleVisibility={handleToggleVisibility}
                onZoneDelete={handleDelete}
                hoveredZoneId={hoveredZoneId}
                onZoneHover={setHoveredZoneId}
                hiddenZones={hiddenZones}
            />

            {/* Control Buttons - Fullscreen & Focus */}
            <div className="map-controls-group" style={{ top: 12, right: 62 }}>
                <ToolbarButton
                    icon={isFullscreen ? Minimize2 : Maximize2}
                    tooltip={isFullscreen ? 'Vollbild beenden (ESC)' : 'Vollbild'}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    active={isFullscreen}
                />
                {zones.length > 0 && (
                    <ToolbarButton
                        icon={Focus}
                        tooltip="Auf alle Zonen zoomen"
                        onClick={handleFitToZones}
                    />
                )}
            </div>

            {/* Toolbar - Now Sibling to MapContainer */}
            {editable && (
                <div className="map-controls-group" style={{ top: 12, right: 12 }}>
                    {!mode && (
                        <>
                            <ToolbarButton
                                icon={Hexagon}
                                tooltip="Polygon zeichnen"
                                onClick={startDraw}
                            />
                            <ToolbarButton
                                icon={Pencil}
                                tooltip="Zonen bearbeiten"
                                onClick={startEdit}
                                disabled={zones.length === 0}
                            />
                            <ToolbarButton
                                icon={Trash2}
                                tooltip="Zonen löschen"
                                onClick={startDelete}
                                disabled={zones.length === 0}
                            />
                        </>
                    )}

                    {mode === 'draw' && (
                        <ToolbarButton
                            icon={X}
                            tooltip="Zeichnen abbrechen"
                            onClick={cancelDraw}
                            variant="danger"
                        />
                    )}

                    {mode === 'edit' && (
                        <>
                            <ToolbarButton
                                icon={Check}
                                tooltip="Änderungen speichern"
                                onClick={saveEdit}
                                variant="success"
                            />
                            <ToolbarButton
                                icon={X}
                                tooltip="Bearbeiten abbrechen"
                                onClick={cancelEdit}
                            />
                        </>
                    )}

                    {mode === 'delete' && (
                        <>
                            <ToolbarButton
                                icon={Check}
                                tooltip="Löschung bestätigen"
                                onClick={saveDelete}
                                variant="danger"
                            />
                            <ToolbarButton
                                icon={X}
                                tooltip="Löschen abbrechen"
                                onClick={cancelDelete}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DrawableGeoMap;
