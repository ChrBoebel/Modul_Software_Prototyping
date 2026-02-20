import { X } from 'lucide-react';

const PreviewHeader = ({
  campaignName,
  isComplete,
  visitedQuestionCount,
  questionCount,
  progressRatio,
  onClose
}) => {
  const progressStyle = { '--flow-preview-progress': `${progressRatio * 100}%` };

  return (
    <div className="flow-preview-header">
      <div className="flow-preview-title">
        <h3>{campaignName || 'Flow Preview'}</h3>
        {!isComplete && (
          <>
            <span className="flow-preview-progress">
              {visitedQuestionCount}/{questionCount} Schritte
            </span>
            <div className="flow-preview-progress-bar" aria-hidden="true">
              <div
                className="flow-preview-progress-bar-fill"
                style={progressStyle}
              />
            </div>
          </>
        )}
      </div>

      <button type="button" className="btn-icon" onClick={onClose} aria-label="Preview schließen">
        <X size={16} />
      </button>
    </div>
  );
};

export default PreviewHeader;
