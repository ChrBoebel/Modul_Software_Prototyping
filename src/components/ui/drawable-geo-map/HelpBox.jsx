import { Hexagon, Move, Trash2, Check } from 'lucide-react';

/**
 * Help Box Component
 */
const HelpBox = ({ isDrawing, isEditing, isDeleting, zonesCount }) => {
    if (isDrawing) {
        return (
            <div className="map-help-box">
                <Hexagon size={18} className="map-help-box-icon" />
                <div>
                    <strong>Polygon zeichnen:</strong> Klicken f{'\u00FC'}r Eckpunkte, auf ersten Punkt klicken zum Abschlie{'\u00DF'}en. <span className="opacity-70">(ESC zum Abbrechen)</span>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="map-help-box bg-[rgba(234,88,12,0.95)]">
                <Move size={18} className="map-help-box-icon" />
                <div>
                    <strong>Bearbeiten:</strong> Wei{'\u00DF'}e Punkte verschieben. Klicke auf <Check size={14} className="inline" /> zum Speichern.
                </div>
            </div>
        );
    }

    if (isDeleting) {
        return (
            <div className="map-help-box bg-[rgba(220,38,38,0.95)]">
                <Trash2 size={18} className="map-help-box-icon" />
                <div>
                    <strong>L{'\u00F6'}schen:</strong> Klicke auf zu l{'\u00F6'}schende Zonen. Best{'\u00E4'}tige mit <Check size={14} className="inline" />.
                </div>
            </div>
        );
    }

    if (zonesCount === 0) {
        return (
            <div className="map-draw-instructions">
                <span className="map-draw-icon">{'\u270F\uFE0F'}</span>
                <span>Nutze das Zeichnen-Werkzeug oben rechts</span>
            </div>
        );
    }

    return null;
};

export default HelpBox;
