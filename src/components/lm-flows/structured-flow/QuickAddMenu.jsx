import { useEffect, useRef, useState } from 'react';
import {
  X,
  ListChecks,
  CheckSquare,
  Sliders,
  Type,
  ChevronDown,
  FileText,
  Image,
  Video,
  User,
  MapPin,
  Calendar,
  GitBranch,
  Target,
  Hand,
  CheckCircle,
  Search
} from 'lucide-react';

// All available elements grouped by category
const ELEMENT_CATEGORIES = [
  {
    id: 'questions',
    label: 'Fragen',
    elements: [
      {
        id: 'single-choice',
        type: 'question',
        inputType: 'Single-Choice',
        label: 'Single-Choice',
        icon: ListChecks,
        description: 'Eine Antwort auswählen',
        color: 'blue'
      },
      {
        id: 'multi-choice',
        type: 'question',
        inputType: 'Multi-Choice',
        label: 'Multi-Choice',
        icon: CheckSquare,
        description: 'Mehrere Antworten möglich',
        color: 'blue'
      },
      {
        id: 'slider',
        type: 'question',
        inputType: 'Range-Slider',
        label: 'Bewertung',
        icon: Sliders,
        description: 'Skala von 0-10',
        color: 'blue'
      },
      {
        id: 'text-input',
        type: 'question',
        inputType: 'Eingabe',
        label: 'Texteingabe',
        icon: Type,
        description: 'Offene Antwort',
        color: 'blue'
      },
      {
        id: 'dropdown',
        type: 'question',
        inputType: 'Dropdown',
        label: 'Dropdown',
        icon: ChevronDown,
        description: 'Auswahl aus Liste',
        color: 'blue'
      }
    ]
  },
  {
    id: 'content',
    label: 'Inhalte',
    elements: [
      {
        id: 'info-card',
        type: 'content',
        label: 'Info-Karte',
        icon: FileText,
        description: 'Erklärungs-Text',
        color: 'green'
      },
      {
        id: 'image',
        type: 'content',
        label: 'Bild',
        icon: Image,
        description: 'Produktbild/Grafik',
        color: 'green'
      },
      {
        id: 'video',
        type: 'content',
        label: 'Video',
        icon: Video,
        description: 'Erklärvideo',
        color: 'green'
      }
    ]
  },
  {
    id: 'forms',
    label: 'Formulare',
    elements: [
      {
        id: 'contact-form',
        type: 'form',
        label: 'Kontaktdaten',
        icon: User,
        description: 'Name, E-Mail, Telefon',
        color: 'amber'
      },
      {
        id: 'address-form',
        type: 'form',
        label: 'Adresse',
        icon: MapPin,
        description: 'PLZ, Ort, Straße',
        color: 'amber'
      },
      {
        id: 'appointment',
        type: 'form',
        label: 'Terminwahl',
        icon: Calendar,
        description: 'Datum & Uhrzeit',
        color: 'amber'
      }
    ]
  },
  {
    id: 'logic',
    label: 'Logik',
    elements: [
      {
        id: 'branch',
        type: 'logic',
        label: 'Verzweigung',
        icon: GitBranch,
        description: 'Bedingte Weiterleitung',
        color: 'purple'
      },
      {
        id: 'score-gate',
        type: 'logic',
        label: 'Score-Gate',
        icon: Target,
        description: 'Nach Punktzahl verzweigen',
        color: 'purple'
      }
    ]
  },
  {
    id: 'screens',
    label: 'Screens',
    elements: [
      {
        id: 'welcome',
        type: 'screen',
        label: 'Willkommen',
        icon: Hand,
        description: 'Intro-Bildschirm',
        color: 'slate'
      },
      {
        id: 'thank-you',
        type: 'screen',
        label: 'Danke',
        icon: CheckCircle,
        description: 'Abschluss-Bildschirm',
        color: 'slate'
      }
    ]
  }
];

// Flatten all elements for search
const ALL_ELEMENTS = ELEMENT_CATEGORIES.flatMap(cat =>
  cat.elements.map(el => ({ ...el, category: cat.label }))
);

const QuickAddMenu = ({ onSelect, onClose, position = 'center' }) => {
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Filter elements based on search
  const filteredElements = searchTerm
    ? ALL_ELEMENTS.filter(el =>
        el.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const maxIndex = filteredElements
          ? filteredElements.length - 1
          : ALL_ELEMENTS.length - 1;
        setFocusedIndex(prev => Math.min(prev + 1, maxIndex));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter' && focusedIndex >= 0) {
        const elements = filteredElements || ALL_ELEMENTS;
        if (elements[focusedIndex]) {
          handleSelect(elements[focusedIndex]);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, focusedIndex, filteredElements]);

  // Auto-focus search
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleSelect = (element) => {
    onSelect?.(element);
    onClose?.();
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
      amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
      purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
      slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      className="quick-add-menu"
      ref={menuRef}
      role="dialog"
      aria-label="Element hinzufügen"
    >
      {/* Header with Search */}
      <div className="quick-add-header">
        <div className="quick-add-search">
          <Search size={16} className="search-icon" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Element suchen..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFocusedIndex(-1);
            }}
            className="search-input"
          />
        </div>
        <button
          className="quick-add-close"
          onClick={onClose}
          aria-label="Schließen"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="quick-add-content">
        {filteredElements ? (
          // Search Results
          <div className="quick-add-search-results">
            {filteredElements.length === 0 ? (
              <div className="no-results">
                Keine Elemente gefunden für "{searchTerm}"
              </div>
            ) : (
              filteredElements.map((element, index) => {
                const Icon = element.icon;
                return (
                  <button
                    key={element.id}
                    className={`quick-add-item group ${focusedIndex === index ? 'focused' : ''}`}
                    onClick={() => handleSelect(element)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <div className={`item-icon ${getColorClasses(element.color)}`}>
                      <Icon size={18} />
                    </div>
                    <div className="item-content">
                      <span className="item-label">{element.label}</span>
                      <span className="item-description">{element.description}</span>
                    </div>
                    <span className="item-category">{element.category}</span>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          // Categories View
          <div className="quick-add-categories">
            {ELEMENT_CATEGORIES.map((category) => (
              <div key={category.id} className="quick-add-category">
                <h4 className="category-label">{category.label}</h4>
                <div className="category-items">
                  {category.elements.map((element) => {
                    const Icon = element.icon;
                    return (
                      <button
                        key={element.id}
                        className="quick-add-item group"
                        onClick={() => handleSelect(element)}
                        title={element.description}
                      >
                        <div className={`item-icon ${getColorClasses(element.color)}`}>
                          <Icon size={18} />
                        </div>
                        <div className="item-content">
                          <span className="item-label">{element.label}</span>
                          <span className="item-description">{element.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="quick-add-footer">
        <span className="hint">↑↓ Navigieren</span>
        <span className="hint">↵ Auswählen</span>
        <span className="hint">Esc Schließen</span>
      </div>
    </div>
  );
};

export { ELEMENT_CATEGORIES, ALL_ELEMENTS };
export default QuickAddMenu;
