const PreviewStepRenderer = ({
  currentNode,
  currentCard,
  inputType,
  answers,
  inputValue,
  onInputChange,
  selectedAnswers,
  onToggleAnswer,
  onSelectAnswers,
  getNode,
  goToNode
}) => {
  // Empty state – no node available
  if (!currentNode) {
    return (
      <div className="flow-preview-empty">
        <p>Kein Flow vorhanden.</p>
      </div>
    );
  }

  // Branch state – module/start node with multiple children
  if (
    (currentNode.type === 'module' || currentNode.type === 'start') &&
    (currentNode.children?.length || 0) > 1
  ) {
    return (
      <div className="flow-preview-branch">
        <h4>{currentNode.label}</h4>
        <p>Wähle den nächsten Pfad:</p>
        <div className="flow-preview-answers">
          {currentNode.children.map((childId) => {
            const child = getNode(childId);
            return (
              <button
                key={childId}
                type="button"
                className="flow-preview-answer single"
                onClick={() => goToNode(childId)}
              >
                {child?.label || childId}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Question card state
  if (currentNode.type !== 'question') return null;

  return (
    <div className="flow-preview-question-card">
      <h4 className="flow-preview-question">
        {currentCard?.title || currentNode.label}
      </h4>

      {currentCard?.description && (
        <p className="flow-preview-description">{currentCard.description}</p>
      )}

      {(inputType === 'Eingabe') && (
        <input
          type="text"
          className="flow-preview-input"
          placeholder="Deine Antwort..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
      )}

      {(inputType === 'Range-Slider') && (
        <div className="flow-preview-range">
          <input
            type="range"
            min="0"
            max="10"
            value={inputValue || 5}
            onChange={(e) => onInputChange(e.target.value)}
          />
          <div className="flow-preview-range-value">{inputValue || 5}</div>
        </div>
      )}

      {inputType !== 'Eingabe' && inputType !== 'Range-Slider' && (
        <>
          {answers.length === 0 && (
            <p className="flow-preview-hint">
              Keine Antwortoptionen definiert – der Preview springt mit „Weiter" fort.
            </p>
          )}

          {answers.length > 0 && inputType === 'Dropdown' && (
            <select
              className="flow-preview-select"
              value={selectedAnswers[0] ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  onSelectAnswers([]);
                  return;
                }
                onSelectAnswers([Number(value)]);
              }}
              aria-label="Auswahl"
            >
              <option value="">Bitte auswählen…</option>
              {answers.map((answer, index) => (
                <option key={index} value={index}>{answer}</option>
              ))}
            </select>
          )}

          {answers.length > 0 && inputType !== 'Dropdown' && (
            <div
              className="flow-preview-answers"
              role={inputType === 'Multi-Choice' ? 'group' : 'radiogroup'}
              aria-label="Antwortoptionen"
            >
              {answers.map((answer, index) => {
                const isSelected = selectedAnswers.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    className={`flow-preview-answer ${inputType === 'Multi-Choice' ? 'multi' : 'single'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => onToggleAnswer(index)}
                    aria-pressed={isSelected}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PreviewStepRenderer;
