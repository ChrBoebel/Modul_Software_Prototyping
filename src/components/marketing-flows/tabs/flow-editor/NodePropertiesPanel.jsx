import { X, Plus, Trash2, Play } from 'lucide-react';
import { INPUT_TYPES } from './constants';

const NodePropertiesPanel = ({
  selectedNode,
  selectedCard,
  showCampaignInspector,
  showAnswerOptions,
  campaignDescription,
  onUpdateCampaign,
  onClearSelection,
  onUpdateNodeLabel,
  onUpdateCard,
  onAddAnswer,
  onUpdateAnswer,
  onRemoveAnswer,
  onPreview,
  onPreviewFromNode
}) => {
  return (
    <aside className="editor-inspector-panel">
      {showCampaignInspector ? (
        <CampaignInspector
          selectedNode={selectedNode}
          campaignDescription={campaignDescription}
          onUpdateCampaign={onUpdateCampaign}
          onClearSelection={onClearSelection}
          onPreview={onPreview}
        />
      ) : (
        <NodeInspector
          selectedNode={selectedNode}
          selectedCard={selectedCard}
          showAnswerOptions={showAnswerOptions}
          onClearSelection={onClearSelection}
          onUpdateNodeLabel={onUpdateNodeLabel}
          onUpdateCard={onUpdateCard}
          onAddAnswer={onAddAnswer}
          onUpdateAnswer={onUpdateAnswer}
          onRemoveAnswer={onRemoveAnswer}
          onPreviewFromNode={onPreviewFromNode}
        />
      )}
    </aside>
  );
};

const CampaignInspector = ({
  selectedNode,
  campaignDescription,
  onUpdateCampaign,
  onClearSelection,
  onPreview
}) => {
  return (
    <>
      <div className="inspector-header">
        <div className="inspector-title-row">
          <h4>Kampagne</h4>
          {selectedNode && (
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={onClearSelection}
            >
              Auswahl aufheben
            </button>
          )}
        </div>
        <span className="inspector-meta">Globale Einstellungen für den Flow</span>
      </div>

      <div className="inspector-content">
        <div className="config-section">
          <label>Beschreibung</label>
          <textarea
            value={campaignDescription}
            onChange={(e) => onUpdateCampaign({ campaignDescription: e.target.value })}
            className="form-input"
            rows={3}
            placeholder="Worum geht es in dieser Kampagne?"
          />
        </div>

        <div className="config-section">
          <h5>Leadscore-Zuordnung</h5>
          <table className="leadscore-table">
            <tbody>
              <tr>
                <td>Sehr wichtig</td>
                <td className="score positive">+3</td>
              </tr>
              <tr>
                <td>wichtig</td>
                <td className="score positive">+2</td>
              </tr>
              <tr>
                <td>neutral</td>
                <td className="score neutral">0</td>
              </tr>
              <tr>
                <td>unwichtig</td>
                <td className="score negative">-1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onPreview}
        >
          <Play size={14} />
          Flow testen
        </button>
      </div>
    </>
  );
};

const NodeInspector = ({
  selectedNode,
  selectedCard,
  showAnswerOptions,
  onClearSelection,
  onUpdateNodeLabel,
  onUpdateCard,
  onAddAnswer,
  onUpdateAnswer,
  onRemoveAnswer,
  onPreviewFromNode
}) => {
  return (
    <>
      <div className="inspector-header">
        <div className="inspector-title-row">
          <h4>{selectedNode.type === 'question' ? 'Frage' : 'Modul'}</h4>
          <button
            type="button"
            className="btn-icon"
            onClick={onClearSelection}
            aria-label="Auswahl aufheben"
          >
            <X size={14} />
          </button>
        </div>
        {selectedNode.cardId && (
          <span className="inspector-meta">Card-ID: {selectedNode.cardId}</span>
        )}
      </div>

      <div className="inspector-content">
        <div className="config-section">
          <label>Titel</label>
          <input
            type="text"
            value={selectedNode.label}
            onChange={(e) => onUpdateNodeLabel(e.target.value)}
            className="form-input"
          />
        </div>

        {selectedNode.type === 'question' && selectedCard && (
          <>
            <div className="config-section">
              <label>Beschreibung</label>
              <textarea
                value={selectedCard.description}
                onChange={(e) => onUpdateCard(
                  selectedNode.cardId,
                  { description: e.target.value },
                  selectedNode.label
                )}
                className="form-input"
                rows={3}
                placeholder="Optional: kurze Erklärung für den Lead"
              />
            </div>

            <div className="config-section">
              <label>Antwort-Format</label>
              <select
                value={selectedCard.inputType}
                onChange={(e) => onUpdateCard(
                  selectedNode.cardId,
                  { inputType: e.target.value },
                  selectedNode.label
                )}
                className="form-input"
              >
                {INPUT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {showAnswerOptions ? (
              <AnswerOptionsEditor
                selectedNode={selectedNode}
                selectedCard={selectedCard}
                onAddAnswer={onAddAnswer}
                onUpdateAnswer={onUpdateAnswer}
                onRemoveAnswer={onRemoveAnswer}
                onUpdateCard={onUpdateCard}
              />
            ) : (
              <p className="inspector-hint">
                {selectedCard.inputType === 'Eingabe'
                  ? 'Diese Frage erwartet eine freie Eingabe.'
                  : 'Diese Frage nutzt eine Skala von 0\u201310.'}
              </p>
            )}
          </>
        )}

        {selectedNode.type !== 'question' && (
          <p className="inspector-hint">
            Module dienen als Verzweigung oder Logikpunkt im Flow.
          </p>
        )}

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onPreviewFromNode}
        >
          <Play size={14} />
          Ab hier testen
        </button>
      </div>
    </>
  );
};

const AnswerOptionsEditor = ({
  selectedNode,
  selectedCard,
  onAddAnswer,
  onUpdateAnswer,
  onRemoveAnswer,
  onUpdateCard
}) => {
  return (
    <div className="config-section">
      <div className="inspector-section-row">
        <h5>Antwortoptionen</h5>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={onAddAnswer}
        >
          <Plus size={14} />
          Hinzufügen
        </button>
      </div>

      <div className="answer-options-enhanced">
        {selectedCard.answers.map((answer, index) => {
          const answerObj = typeof answer === 'object' ? answer : { text: answer, score: 0 };
          return (
            <div key={index} className="answer-option-row">
              <div className="answer-drag-handle">
                <span className="drag-dots">{'\u22EE\u22EE'}</span>
              </div>
              <input
                type="text"
                value={answerObj.text || answer}
                onChange={(e) => onUpdateAnswer(index, e.target.value)}
                className="form-input answer-text-input"
                placeholder={`Antwort ${index + 1}`}
              />
              <div className="answer-score-input">
                <select
                  className="form-input score-select"
                  value={answerObj.score || 0}
                  onChange={(e) => {
                    const newScore = parseInt(e.target.value, 10);
                    const answers = selectedCard.answers.map((a, idx) => {
                      if (idx === index) {
                        return typeof a === 'object'
                          ? { ...a, score: newScore }
                          : { text: a, score: newScore };
                      }
                      return a;
                    });
                    onUpdateCard(selectedNode.cardId, { answers }, selectedNode.label);
                  }}
                  title="Lead-Score für diese Antwort"
                >
                  <option value="3">+3</option>
                  <option value="2">+2</option>
                  <option value="1">+1</option>
                  <option value="0">0</option>
                  <option value="-1">-1</option>
                  <option value="-2">-2</option>
                </select>
              </div>
              <button
                type="button"
                className="answer-delete-btn"
                onClick={() => onRemoveAnswer(index)}
                aria-label="Antwort löschen"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <p className="inspector-hint-small">
        Score-Werte beeinflussen die Lead-Qualifizierung
      </p>
    </div>
  );
};

export default NodePropertiesPanel;
