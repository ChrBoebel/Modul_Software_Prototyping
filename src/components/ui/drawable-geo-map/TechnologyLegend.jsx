import { useMemo } from 'react';
import { Layers } from 'lucide-react';
import { TECHNOLOGY_COLORS } from '../../../theme/productColors';

const MAP_TECH_CLASS = {
    FTTH: 'map-tech-ftth',
    KABEL: 'map-tech-kabel',
    DSL: 'map-tech-dsl',
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
        <div className="map-overlay-panel top-3 left-3 w-auto min-w-[140px]">
            <div className="font-semibold mb-2 text-xs flex items-center gap-1.5">
                <Layers size={14} />
                <span>Legende</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {usedTechnologies.map(tech => {
                    const config = TECHNOLOGY_COLORS[tech];
                    if (!config) return null;
                    const colorClass = MAP_TECH_CLASS[tech] || 'map-tech-none';
                    return (
                        <div key={tech} className="flex items-center gap-2 text-xs">
                            <span className={`w-3 h-3 rounded-sm shrink-0 ${colorClass}`} />
                            <span className="text-slate-600">{config.name}</span>
                        </div>
                    );
                })}
                <div className="flex items-center gap-2 text-xs mt-1 pt-1 border-t border-slate-200">
                    <span className="w-3 h-3 rounded-sm shrink-0 map-tech-none" />
                    <span className="text-slate-500">Kein Produkt</span>
                </div>
            </div>
        </div>
    );
};

export default TechnologyLegend;
