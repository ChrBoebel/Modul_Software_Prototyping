import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { getProductColor } from '../../../theme/productColors';
import { GERMAN_DRAW_STRINGS } from './utils';

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
            // Properly patch German localization without replacing entire object
            if (L.drawLocal && L.drawLocal.draw && L.drawLocal.draw.handlers && L.drawLocal.draw.handlers.polygon) {
                L.drawLocal.draw.handlers.polygon.tooltip = GERMAN_DRAW_STRINGS.draw.handlers.polygon.tooltip;
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
                        message: '<strong>Fehler:</strong> Linien d\u00FCrfen sich nicht kreuzen!'
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

export default MapController;
