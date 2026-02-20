import { ExternalLink } from 'lucide-react';

const LeadSourceSection = ({ lead, flowAnswers, onNavigateToCampaign }) => (
  <div className="section-content">
    <div className="data-grid">
      <div className="data-row">
        <span className="label">Kampagne:</span>
        <span className="value">{lead?.originalData?.source || 'Unbekannt'}</span>
      </div>
      <div className="data-row">
        <span className="label">Flow-ID:</span>
        <span className="value">{lead?.originalData?.flowId}</span>
      </div>
      <div className="data-row">
        <span className="label">Erstellt am:</span>
        <span className="value">{lead?.timestamp}</span>
      </div>
      {flowAnswers.length > 0 && (
        <div className="data-row">
          <span className="label">Beantwortete Fragen:</span>
          <span className="value">{flowAnswers.length}</span>
        </div>
      )}
    </div>
    {onNavigateToCampaign && lead?.originalData?.flowId && (
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigateToCampaign(lead.originalData.flowId)}
        >
          <ExternalLink size={14} />
          Kampagne bearbeiten
        </button>
      </div>
    )}
  </div>
);

export default LeadSourceSection;
