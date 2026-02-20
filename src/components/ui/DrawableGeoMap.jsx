import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Pencil, Trash2, Maximize2, Minimize2, Focus, Hexagon, Check, X } from 'lucide-react';

// Import sub-components
import MapController from './drawable-geo-map/MapController';
import HelpBox from './drawable-geo-map/HelpBox';
import TechnologyLegend from './drawable-geo-map/TechnologyLegend';
import ToolbarButton from './drawable-geo-map/ToolbarButton';
import ZoneListOverlay from './drawable-geo-map/ZoneListOverlay';

// Import utils (triggers Leaflet icon fix side effect)
import './drawable-geo-map/utils';

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
        if (window.confirm('Zone wirklich l\u00F6schen?')) {
            onZoneDeleted?.(zoneId);
        }
    }, [onZoneDeleted]);

    const handleFitToZones = useCallback(() => {
        fitToZonesRef.current?.();
    }, []);

    // Handle ESC key for fullscreen and drawing mode
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (mode === 'draw') {
                    cancelDraw();
                } else if (mode === 'edit') {
                    cancelEdit();
                } else if (mode === 'delete') {
                    cancelDelete();
                } else if (isFullscreen) {
                    setIsFullscreen(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, mode]);

    // Cursor feedback for drawing mode
    useEffect(() => {
        if (mode === 'draw') {
            document.body.style.cursor = 'crosshair';
        } else {
            document.body.style.cursor = '';
        }
        return () => {
            document.body.style.cursor = '';
        };
    }, [mode]);

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
    const mapShellStyle = { '--geo-map-height': isFullscreen ? '100vh' : height };

    return (
        <div
            ref={mapRef}
            className={`geo-map-shell ${isFullscreen ? 'map-fullscreen-wrapper' : ''}`}
            style={mapShellStyle}
        >
            <MapContainer
                center={center}
                zoom={zoom}
                className="geo-map-canvas"
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
            <div className="map-controls-group map-controls-top-right-offset">
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
                <div className="map-controls-group map-controls-top-right">
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
                                tooltip="Zonen l\u00F6schen"
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
                                tooltip="\u00C4nderungen speichern"
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
                                tooltip="L\u00F6schung best\u00E4tigen"
                                onClick={saveDelete}
                                variant="danger"
                            />
                            <ToolbarButton
                                icon={X}
                                tooltip="L\u00F6schen abbrechen"
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
