import { X, Plus, ChevronDown } from 'lucide-react';
import { COMPONENT_CATEGORIES } from './constants';

const EditorComponentLibrary = ({
  isOpen,
  onClose,
  expandedCategories,
  onToggleCategory,
  onAddComponent
}) => {
  return (
    <aside className={`component-library-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="library-sidebar-header">
        <h4>Komponenten</h4>
        <button
          type="button"
          className="btn-icon"
          onClick={onClose}
          aria-label="Komponenten-Bibliothek schließen"
        >
          <X size={16} />
        </button>
      </div>
      <div className="library-sidebar-content">
        {COMPONENT_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          return (
            <div key={category.id} className="component-category">
              <button
                type="button"
                className="category-header"
                onClick={() => onToggleCategory(category.id)}
                aria-expanded={isExpanded}
              >
                <CategoryIcon size={16} />
                <span>{category.label}</span>
                <ChevronDown size={14} className={`category-chevron ${isExpanded ? 'expanded' : ''}`} />
              </button>
              {isExpanded && (
                <div className="category-components">
                  {category.components.map((component) => {
                    const ComponentIcon = component.icon;
                    return (
                      <button
                        key={component.id}
                        type="button"
                        className="component-item"
                        onClick={() => onAddComponent(component)}
                        title={component.description}
                      >
                        <ComponentIcon size={16} />
                        <div className="component-item-info">
                          <span className="component-item-label">{component.label}</span>
                          <span className="component-item-desc">{component.description}</span>
                        </div>
                        <Plus size={14} className="component-add-icon" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default EditorComponentLibrary;
