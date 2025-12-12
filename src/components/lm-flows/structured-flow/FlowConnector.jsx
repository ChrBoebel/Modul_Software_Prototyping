import { useState } from 'react';
import { Plus } from 'lucide-react';
import NodeTypeSelector from './NodeTypeSelector';

const FlowConnector = ({ onAdd, showAddButton = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowSelector(true);
  };

  const handleSelectType = (type) => {
    onAdd?.(type);
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
        setIsHovered(false);
        if (!showSelector) setShowSelector(false);
      }}
    >
      <div className="connector-line top" />

      {showAddButton && (
        <div className={`connector-button-wrapper ${isHovered || showSelector ? 'active' : ''}`}>
          <button
            className="add-node-btn"
            onClick={handleAddClick}
            title="Node hinzufügen"
          >
            <Plus size={16} />
          </button>

          {showSelector && (
            <NodeTypeSelector
              onSelect={handleSelectType}
              onClose={handleCloseSelector}
            />
          )}
        </div>
      )}

      <div className="connector-line bottom" />
    </div>
  );
};

export default FlowConnector;
