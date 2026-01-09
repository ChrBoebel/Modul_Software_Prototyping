import { Tooltip } from './Tooltip';

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  ariaLabel = 'Tabs',
  className = ''
}) => {
  return (
    <div className={`section-tabs ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        const button = (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`section-tab ${isActive ? 'active' : ''}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {tab.label}
          </button>
        );

        // Wrap with Tooltip if description exists
        if (tab.description) {
          return (
            <Tooltip key={tab.id} content={tab.description} position="bottom">
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </div>
  );
};

export const TabPanel = ({
  id,
  activeTab,
  children,
  className = ''
}) => {
  if (activeTab !== id) return null;

  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={id}
      className={className}
    >
      {children}
    </div>
  );
};
