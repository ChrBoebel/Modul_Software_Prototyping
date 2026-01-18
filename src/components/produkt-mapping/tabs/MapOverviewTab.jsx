import { useState, useMemo } from 'react';
import { Card, Button, Input, Select, Modal, DrawableGeoMap, Badge } from '../../ui';
import { Layers, Trash2, MapPin, Package } from 'lucide-react';
import { getProductColor, TECHNOLOGY_COLORS, getTechnologyFromProductId } from '../../../theme/productColors';
import { theme } from '../../../theme/colors';

const MapOverviewTab = ({
    customZones = [],
    onZoneCreated,
    onZoneUpdated,
    onZoneDeleted,
    products = [],
    showToast
}) => {
    const [zoneModalOpen, setZoneModalOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [zoneDraft, setZoneDraft] = useState({ name: '', productId: '' });

    // Product options for zone assignment
    const productOptions = useMemo(() =>
        products.map(p => ({
            value: p.id,
            label: p.name
        })),
        [products]
    );

    const handleZoneCreated = (zone) => {
        onZoneCreated?.(zone);
        // Automatically open edit modal for the new zone
        setSelectedZone(zone);
        setZoneDraft({ name: zone.name, productId: '' });
        setZoneModalOpen(true);
    };

    const handleZoneClick = (zone) => {
        setSelectedZone(zone);
        setZoneDraft({ name: zone.name || '', productId: zone.productId || '' });
        setZoneModalOpen(true);
    };

    // Handle coordinate edits from map (when user drags vertices)
    const handleZoneEdited = (zoneId, updates) => {
        onZoneUpdated?.(zoneId, updates);
        showToast?.('Zone-Koordinaten aktualisiert');
    };

    const handleSaveZone = () => {
        if (selectedZone) {
            onZoneUpdated?.(selectedZone.id, {
                name: zoneDraft.name.trim() || `Zone ${selectedZone.id}`,
                productId: zoneDraft.productId || null
            });
            showToast?.('Zone gespeichert');
        }
        setZoneModalOpen(false);
        setSelectedZone(null);
    };

    const handleDeleteZone = () => {
        if (selectedZone && window.confirm(`Zone "${zoneDraft.name || selectedZone.id}" wirklich löschen?`)) {
            onZoneDeleted?.(selectedZone.id);
            showToast?.('Zone gelöscht');
            setZoneModalOpen(false);
            setSelectedZone(null);
        }
    };

    // Calculate total area
    const totalArea = useMemo(() => {
        if (customZones.length === 0) return 0;
        
        let total = 0;
        customZones.forEach(zone => {
            if (zone.coordinates && zone.coordinates.length >= 3) {
                const latToMeters = 111320;
                const lngToMeters = 111320 * Math.cos(47.7 * Math.PI / 180);
                let area = 0;
                const n = zone.coordinates.length;
                for (let i = 0; i < n; i++) {
                    const j = (i + 1) % n;
                    const xi = zone.coordinates[i][1] * lngToMeters;
                    const yi = zone.coordinates[i][0] * latToMeters;
                    const xj = zone.coordinates[j][1] * lngToMeters;
                    const yj = zone.coordinates[j][0] * latToMeters;
                    area += xi * yj;
                    area -= xj * yi;
                }
                total += Math.abs(area / 2);
            }
        });
        return total;
    }, [customZones]);

    const formatArea = (areaM2) => {
        if (areaM2 >= 1000000) {
            return `${(areaM2 / 1000000).toFixed(2)} km²`;
        } else if (areaM2 >= 10000) {
            return `${(areaM2 / 10000).toFixed(2)} ha`;
        } else {
            return `${Math.round(areaM2).toLocaleString('de-DE')} m²`;
        }
    };

    return (
        <>
            <Card
                headerTitle="Kartenzonen & Abdeckung"
                hoverable={false}
            >
                <div style={{
                    marginBottom: '16px',
                    padding: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '16px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Layers size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>Verfügbarkeitszonen verwalten</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Zeichnen und bearbeiten Sie Polygone auf der Karte um Versorgungsgebiete zu definieren.
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Polygon zeichnen:</strong> Klicken für Eckpunkte, auf ersten Punkt zum Abschließen.</li>
                                <li><strong>Bearbeiten:</strong> Klicke auf "Edit" in der Toolbar, dann Punkte verschieben.</li>
                                <li><strong>Löschen:</strong> Klicke auf "Delete" in der Toolbar oder nutze die Zone-Liste.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {customZones.length > 0 && (
                            <>
                                <Badge variant="default" className="text-sm px-3 py-1">
                                    {customZones.length} {customZones.length === 1 ? 'Zone' : 'Zonen'}
                                </Badge>
                                <span className="text-xs text-secondary">
                                    Gesamt: {formatArea(totalArea)}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <DrawableGeoMap
                    zones={customZones}
                    onZoneCreated={handleZoneCreated}
                    onZoneEdited={handleZoneEdited}
                    onZoneDeleted={onZoneDeleted}
                    onZoneClick={handleZoneClick}
                    products={products}
                    height="650px"
                    editable={true}
                />

                {/* Zone Statistics - Visual Summary (Tufte: show data context) */}
                {customZones.length > 0 && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-primary)'
                        }}>
                            <MapPin size={16} />
                            Zonen-Statistik
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {customZones.map((zone, idx) => {
                                // Calculate area for this zone
                                let zoneArea = 0;
                                if (zone.coordinates && zone.coordinates.length >= 3) {
                                    const latToMeters = 111320;
                                    const lngToMeters = 111320 * Math.cos(47.7 * Math.PI / 180);
                                    const n = zone.coordinates.length;
                                    for (let i = 0; i < n; i++) {
                                        const j = (i + 1) % n;
                                        const xi = zone.coordinates[i][1] * lngToMeters;
                                        const yi = zone.coordinates[i][0] * latToMeters;
                                        const xj = zone.coordinates[j][1] * lngToMeters;
                                        const yj = zone.coordinates[j][0] * latToMeters;
                                        zoneArea += xi * yj;
                                        zoneArea -= xj * yi;
                                    }
                                    zoneArea = Math.abs(zoneArea / 2);
                                }
                                const percentage = totalArea > 0 ? (zoneArea / totalArea * 100) : 0;
                                const zoneColor = zone.productId ? getProductColor(zone.productId) : theme.colors.slate400;

                                return (
                                    <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)',
                                            width: 120,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {zone.name || `Zone ${idx + 1}`}
                                        </span>
                                        <div style={{
                                            flex: 1,
                                            height: 8,
                                            backgroundColor: 'var(--slate-100)',
                                            borderRadius: 4,
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${percentage}%`,
                                                height: '100%',
                                                backgroundColor: zoneColor,
                                                borderRadius: 4,
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.6875rem',
                                            fontWeight: 600,
                                            color: zoneColor,
                                            width: 60,
                                            textAlign: 'right'
                                        }}>
                                            {formatArea(zoneArea)}
                                        </span>
                                        {zone.productId && (
                                            <span style={{
                                                fontSize: '0.625rem',
                                                padding: '2px 6px',
                                                borderRadius: 4,
                                                backgroundColor: `${zoneColor}20`,
                                                color: zoneColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <Package size={10} />
                                                {products.find(p => p.id === zone.productId)?.name || 'Produkt'}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Summary - Uses SWK brand colors */}
                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--slate-100)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                Gesamtfläche: {formatArea(totalArea)}
                            </span>
                            <span style={{
                                fontSize: '0.6875rem',
                                padding: '4px 8px',
                                borderRadius: 4,
                                backgroundColor: customZones.filter(z => z.productId).length === customZones.length
                                    ? theme.colors.secondaryLight
                                    : theme.colors.slate100,
                                color: customZones.filter(z => z.productId).length === customZones.length
                                    ? theme.colors.secondary
                                    : theme.colors.slate600,
                                fontWeight: 600
                            }}>
                                {customZones.filter(z => z.productId).length}/{customZones.length} mit Produkt
                            </span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Zone Editor Modal */}
            <Modal
                isOpen={zoneModalOpen}
                onClose={() => setZoneModalOpen(false)}
                title="Zone konfigurieren"
            >
                <div className="flex flex-col gap-5">
                    <Input
                        label="Bezeichnung"
                        value={zoneDraft.name}
                        onChange={(e) => setZoneDraft(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="z.B. Ausbaugebiet Nord"
                        autoFocus
                    />

                    <Select
                        label="Zugeordnetes Produkt"
                        value={zoneDraft.productId}
                        onChange={(e) => setZoneDraft(prev => ({ ...prev, productId: e.target.value }))}
                        options={[
                            { value: '', label: '-- Kein Produkt --' },
                            ...productOptions
                        ]}
                    />

                    {zoneDraft.productId && (
                        <div className="p-3 bg-bg-secondary rounded border border-border flex items-center gap-3">
                            <span
                                className="w-8 h-8 rounded shrink-0"
                                style={{ backgroundColor: getProductColor(zoneDraft.productId) }}
                            />
                            <div>
                                <div className="font-medium text-sm">
                                    {products.find(p => p.id === zoneDraft.productId)?.name}
                                </div>
                                <div className="text-xs text-secondary mt-0.5">
                                    {(() => {
                                        const tech = getTechnologyFromProductId(zoneDraft.productId);
                                        return tech ? TECHNOLOGY_COLORS[tech]?.name : '';
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedZone && selectedZone.coordinates && (
                        <div className="p-3 bg-bg-secondary rounded border border-border">
                            <div className="text-xs text-secondary mb-1">Fläche</div>
                            <div className="font-medium">
                                {(() => {
                                    const coords = selectedZone.coordinates;
                                    if (!coords || coords.length < 3) return '–';
                                    const latToMeters = 111320;
                                    const lngToMeters = 111320 * Math.cos(47.7 * Math.PI / 180);
                                    let area = 0;
                                    const n = coords.length;
                                    for (let i = 0; i < n; i++) {
                                        const j = (i + 1) % n;
                                        const xi = coords[i][1] * lngToMeters;
                                        const yi = coords[i][0] * latToMeters;
                                        const xj = coords[j][1] * lngToMeters;
                                        const yj = coords[j][0] * latToMeters;
                                        area += xi * yj;
                                        area -= xj * yi;
                                    }
                                    return formatArea(Math.abs(area / 2));
                                })()}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border mt-2 flex justify-between items-center">
                        <Button
                            variant="danger"
                            icon={Trash2}
                            onClick={handleDeleteZone}
                            className="text-danger hover:bg-danger/10 border-danger/20"
                        >
                            Löschen
                        </Button>

                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={() => setZoneModalOpen(false)}>
                                Abbrechen
                            </Button>
                            <Button variant="primary" onClick={handleSaveZone}>
                                Speichern
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MapOverviewTab;
