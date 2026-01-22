import { useEffect, useRef } from 'react';
import { HelpCircle, Box, X } from 'lucide-react';

const nodeTypes = [
  {
    type: 'question',
    label: 'Frage',
    description: 'Stellt dem Nutzer eine Frage',
    icon: HelpCircle,
    color: 'var(--swk-blue)'
  },
  {
    type: 'module',
    label: 'Modul',
    description: 'Führt eine Aktion aus',
    icon: Box,
    color: 'var(--slate-500)'
  }
];

const NodeTypeSelector = ({ onSelect, onClose }) => {
  const selectorRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="node-type-selector" ref={selectorRef}>
      <div className="selector-header">
        <span>Node hinzufügen</span>
        <button className="close-btn" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
      <div className="selector-options">
        {nodeTypes.map(({ type, label, description, icon: Icon, color }) => (
          <button
            key={type}
            className="selector-option"
            onClick={() => onSelect(type)}
          >
            <div className="option-icon" style={{ background: color }}>
              <Icon size={16} />
            </div>
            <div className="option-content">
              <div className="option-label">{label}</div>
              <div className="option-description">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodeTypeSelector;
