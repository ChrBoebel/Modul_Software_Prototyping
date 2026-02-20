import { AlertCircle, CheckCircle } from 'lucide-react';

const IntegrationStatusBanner = ({ integrationStatus, integrations, onNavigate, showToast }) => {
  if (!integrations.length) {
    return null;
  }

  return (
    <div
      className={`card flex items-center justify-between px-3 py-2 rounded-md mb-3 border ${integrationStatus.hasError ? 'bg-[var(--danger-light)] border-[var(--danger)] text-[var(--danger)]' : 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]'}`}
    >
      <div className="flex items-center gap-2">
        {integrationStatus.hasError ? (
          <AlertCircle size={16} className="shrink-0" />
        ) : (
          <CheckCircle size={16} className="shrink-0" />
        )}
        <span className="font-semibold text-xs">
          {integrationStatus.hasError
            ? `${integrationStatus.errorCount} Fehler`
            : `${integrationStatus.connectedCount}/${integrationStatus.total} verbunden`
          }
        </span>
      </div>
      <button
        type="button"
        className="bg-transparent border-none text-inherit cursor-pointer text-[0.6875rem] font-medium underline"
        onClick={() => {
          if (onNavigate) {
            onNavigate('einstellung');
          } else {
            showToast('Einstellungen öffnen');
          }
        }}
      >
        {integrationStatus.hasError ? 'Beheben' : 'Details'}
      </button>
    </div>
  );
};

export default IntegrationStatusBanner;
