import { useState } from 'react';
import { Plus } from 'lucide-react';
import QuickAddMenu from './QuickAddMenu';

const FlowConnector = ({ onAdd, onAddElement, showAddButton = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowSelector(true);
  };

  // Handle element selection from QuickAddMenu
  const handleSelectElement = (element) => {
    // If onAddElement is provided, use it (new behavior)
    if (onAddElement) {
      onAddElement(element);
    } else if (onAdd) {
      // Fallback to old behavior (just node type)
      onAdd(element.type === 'question' ? 'question' : 'module');
    }
    setShowSelector(false);
    setIsHovered(false);
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
  };

  return (
    <div
      className="flow-connector"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!showSelector) {
          setIsHovered(false);
        }
      }}
    >
      <div className="connector-line top" />

      {showAddButton && (
        <div className={`connector-button-wrapper ${isHovered || showSelector ? 'active' : ''}`}>
          <button
            className="add-node-btn"
            onClick={handleAddClick}
            title="Element hinzufügen"
            aria-label="Element hinzufügen"
            aria-expanded={showSelector}
          >
            <Plus size={16} />
          </button>

          {showSelector && (
            <div className="quick-add-menu-container">
              <QuickAddMenu
                onSelect={handleSelectElement}
                onClose={handleCloseSelector}
              />
            </div>
          )}
        </div>
      )}

      <div className="connector-line bottom" />
    </div>
  );
};

export default FlowConnector;
