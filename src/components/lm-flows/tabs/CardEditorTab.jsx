import { useState } from 'react';
import {
  Plus,
  Save,
  Trash2,
  Copy,
  Edit,
  Eye,
  GripVertical,
  Image,
  Type,
  FileText,
  Video,
  MapPin,
  CheckSquare,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

const CardEditorTab = ({ showToast }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [activePanel, setActivePanel] = useState('list'); // 'list' or 'editor'

  // Mock cards data
  const cards = [
    {
      id: 'card-001',
      name: 'Question_1',
      type: 'Frage',
      usedInFlows: ['Solar Flow', 'Strom Flow'],
      lastUpdated: '2025-01-15'
    },
    {
      id: 'card-002',
      name: 'Willkommen',
      type: 'Info',
      usedInFlows: ['Solar Flow'],
      lastUpdated: '2025-01-14'
    },
    {
      id: 'card-003',
      name: 'Produkt-Auswahl',
      type: 'Frage',
      usedInFlows: ['Wärme Flow', 'Strom Flow'],
      lastUpdated: '2025-01-12'
    },
    {
      id: 'card-004',
      name: 'Kontakt-Daten',
      type: 'Formular',
      usedInFlows: ['Solar Flow', 'Wärme Flow', 'Strom Flow'],
      lastUpdated: '2025-01-10'
    }
  ];

  // Component library
  const componentLibrary = [
    { id: 'bild', label: 'Bild', icon: Image, category: 'media' },
    { id: 'image-komp', label: 'Image_Komp', icon: Image, category: 'media' },
    { id: 'titel-komp', label: 'Titel_Komp', icon: Type, category: 'text' },
    { id: 'beschreibung-komp', label: 'Beschreibung_Komp', icon: FileText, category: 'text' },
    { id: 'rich-text-komp', label: 'Rich-Text_Komp', icon: FileText, category: 'text' },
    { id: 'video-embed-komp', label: 'Video-Embed_Komp', icon: Video, category: 'media' },
    { id: 'api-location', label: 'API_LocationCheck', icon: MapPin, category: 'logic' },
    { id: 'checkbox', label: 'Check-Box', icon: CheckSquare, category: 'input' },
    { id: 'dropdown', label: 'Dropdown', icon: ChevronDown, category: 'input' },
    { id: 'antwort', label: 'Antwort', icon: MessageSquare, category: 'answer' },
    { id: 'sc-antwort-bild', label: 'SC_Antwort mit Bild', icon: Image, category: 'answer' },
    { id: 'sc-antwort-icon', label: 'SC_Antwort mit Icon', icon: MessageSquare, category: 'answer' }
  ];

  // Input types
  const inputTypes = ['Single-Choice', 'Multi-Choice', 'Range-Slider', 'Eingabe', 'Dropdown'];

  const getTypeBadge = (type) => {
    const typeMap = {
      'Frage': 'info',
      'Info': 'success',
      'Formular': 'warning'
    };
    return typeMap[type] || 'neutral';
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setActivePanel('editor');
  };

  return (
    <div className="card-editor-tab">
      {activePanel === 'list' ? (
        <>
          {/* Cards List */}
          <div className="tab-header">
            <button className="btn btn-primary" onClick={() => {
              setSelectedCard(null);
              setActivePanel('editor');
            }}>
              <Plus size={16} />
              Neue Card
            </button>
          </div>

          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                <div className="card-item-header">
                  <h4>{card.name}</h4>
                  <span className={`badge ${getTypeBadge(card.type)}`}>{card.type}</span>
                </div>
                <div className="card-item-meta">
                  <span>Verwendet in: {card.usedInFlows.length} Flows</span>
                </div>
                <div className="card-item-flows">
                  {card.usedInFlows.map((flow, idx) => (
                    <span key={idx} className="flow-tag">{flow}</span>
                  ))}
                </div>
                <div className="card-item-footer">
                  <span className="last-updated">aktualisiert: {card.lastUpdated}</span>
                  <div className="card-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEditCard(card)}>
                      <Edit size={14} />
                      Bearbeiten
                    </button>
                    <button className="btn btn-sm btn-link" onClick={() => showToast(`Preview ${card.name}`)}>
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-sm btn-link" onClick={() => showToast(`Duplizieren ${card.name}`)}>
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Card Editor */
        <div className="card-editor-container">
          {/* Editor Header */}
          <div className="editor-header">
            <div className="editor-title">
              <button className="btn btn-link" onClick={() => setActivePanel('list')}>
                &larr; Zurück
              </button>
              <input
                type="text"
                placeholder="Card Name"
                defaultValue={selectedCard?.name || ''}
                className="card-name-input"
              />
            </div>
            <div className="editor-actions">
              <button className="btn btn-secondary">
                <Eye size={16} />
                Preview
              </button>
              <button className="btn btn-primary" onClick={() => showToast('Card gespeichert')}>
                <Save size={16} />
                Speichern
              </button>
            </div>
          </div>

          <div className="editor-main">
            {/* Card Canvas */}
            <div className="card-canvas">
              <div className="canvas-header">
                <div className="form-row">
                  <div className="form-group">
                    <label>ID/ID</label>
                    <input type="text" placeholder="Card ID" />
                  </div>
                  <div className="form-group">
                    <label>Card Name</label>
                    <input type="text" placeholder="Card Name" />
                  </div>
                  <div className="form-group">
                    <label>Card Beschreibung</label>
                    <input type="text" placeholder="Beschreibung" />
                  </div>
                </div>
              </div>

              <div className="canvas-content">
                <div className="component-placeholder">
                  <h5>Step-Titel (DS)</h5>
                  <input type="text" placeholder="Step Titel eingeben..." />
                </div>

                <div className="component-placeholder">
                  <h5>Step-Beschreibung (DS)</h5>
                  <textarea placeholder="Step Beschreibung eingeben..."></textarea>
                </div>

                <div className="component-placeholder answer-section">
                  <h5>Antwort-Optionen</h5>
                  <div className="answer-options">
                    <div className="answer-option">
                      <GripVertical size={14} />
                      <input type="text" placeholder="Step-#1_Antwort_1 (DS)" />
                      <button className="btn btn-sm btn-link danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="answer-option">
                      <GripVertical size={14} />
                      <input type="text" placeholder="Step-#1_Antwort_2 (DS)" />
                      <button className="btn btn-sm btn-link danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-secondary add-answer">
                    <Plus size={14} />
                    Antwort hinzufügen
                  </button>
                </div>
              </div>
            </div>

            {/* Component Library */}
            <div className="component-library">
              <h4>Komponenten-Library</h4>

              <div className="library-section">
                <h5>Bild</h5>
                {componentLibrary.filter(c => c.category === 'media').map((comp) => (
                  <div key={comp.id} className="library-item" draggable>
                    <comp.icon size={14} />
                    {comp.label}
                  </div>
                ))}
              </div>

              <div className="library-section">
                <h5>Komponente</h5>
                {componentLibrary.filter(c => c.category === 'text').map((comp) => (
                  <div key={comp.id} className="library-item" draggable>
                    <comp.icon size={14} />
                    {comp.label}
                  </div>
                ))}
              </div>

              <div className="library-section">
                <h5>Input</h5>
                {componentLibrary.filter(c => c.category === 'input' || c.category === 'logic').map((comp) => (
                  <div key={comp.id} className="library-item" draggable>
                    <comp.icon size={14} />
                    {comp.label}
                  </div>
                ))}
              </div>

              <div className="library-section">
                <h5>Antwort</h5>
                {componentLibrary.filter(c => c.category === 'answer').map((comp) => (
                  <div key={comp.id} className="library-item" draggable>
                    <comp.icon size={14} />
                    {comp.label}
                  </div>
                ))}
              </div>

              <div className="library-section">
                <h5>Frage-Format</h5>
                <select className="input-type-select">
                  {inputTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardEditorTab;
