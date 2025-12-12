import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw, X } from 'lucide-react';

const FlowPreviewModal = ({
  isOpen,
  onClose,
  nodes,
  cardsById,
  campaignName,
  startNodeId
}) => {
  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const getNode = useCallback((id) => nodeMap.get(id), [nodeMap]);
  const rootNode = useMemo(() => nodes.find(n => n.type === 'start'), [nodes]);

  const effectiveStartId = startNodeId || rootNode?.id || null;
  const [currentNodeId, setCurrentNodeId] = useState(effectiveStartId);
  const [history, setHistory] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const questionCount = useMemo(
    () => nodes.filter(n => n.type === 'question').length,
    [nodes]
  );

  const currentNode = currentNodeId ? getNode(currentNodeId) : null;
  const currentCard = currentNode?.cardId ? cardsById[currentNode.cardId] : null;
  const inputType = currentCard?.inputType || 'Single-Choice';
  const answers = currentCard?.answers || [];

  // Reset preview when opened or when root changes.
  useEffect(() => {
    if (!isOpen) return;
    setCurrentNodeId(effectiveStartId);
    setHistory([]);
    setSelectedAnswers([]);
    setInputValue('');
    setIsComplete(false);
  }, [isOpen, effectiveStartId]);

  const visitedQuestionCount = useMemo(() => {
    const historyQuestions = history.filter(id => getNode(id)?.type === 'question').length;
    return historyQuestions + (currentNode?.type === 'question' ? 1 : 0);
  }, [history, currentNode, getNode]);

  const progressRatio = questionCount > 0
    ? Math.min(visitedQuestionCount / questionCount, 1)
    : 0;

  const goToNode = useCallback((nextId, options = {}) => {
    const { recordHistory = true } = options;
    if (recordHistory && currentNodeId) {
      setHistory(prev => [...prev, currentNodeId]);
    }
    setCurrentNodeId(nextId);
    setSelectedAnswers([]);
    setInputValue('');
  }, [currentNodeId]);

  const handleRestart = () => {
    setCurrentNodeId(effectiveStartId);
    setHistory([]);
    setSelectedAnswers([]);
    setInputValue('');
    setIsComplete(false);
  };

  const handleBack = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop();
      setCurrentNodeId(last);
      setSelectedAnswers([]);
      setInputValue('');
      setIsComplete(false);
      return newHistory;
    });
  };

  const toggleAnswer = (index) => {
    if (inputType === 'Multi-Choice') {
      setSelectedAnswers(prev => (
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      ));
      return;
    }
    setSelectedAnswers([index]);
  };

  const canContinue = useMemo(() => {
    if (!currentNode || currentNode.type !== 'question') return false;
    if (inputType === 'Eingabe' || inputType === 'Range-Slider') {
      return inputValue.toString().trim().length > 0;
    }
    if (answers.length === 0) return true;
    if (inputType === 'Multi-Choice') return selectedAnswers.length > 0;
    return selectedAnswers.length === 1;
  }, [currentNode, inputType, inputValue, selectedAnswers, answers.length]);

  const handleNext = () => {
    if (!currentNode) return;
    const children = currentNode.children || [];
    if (children.length === 0) {
      setIsComplete(true);
      return;
    }

    let nextId = children[0];
    if (children.length > 1) {
      const answerIndex = selectedAnswers[0] ?? 0;
      nextId = children[answerIndex] || children[0];
    }

    goToNode(nextId);
  };

  // Auto-skip internal nodes (start/module) that have a single child.
  useEffect(() => {
    if (!isOpen || !currentNodeId) return;
    let node = getNode(currentNodeId);
    let nextId = currentNodeId;
    let safety = 0;

    while (
      node &&
      (node.type === 'module' || node.type === 'start') &&
      (node.children?.length || 0) === 1 &&
      safety < 10
    ) {
      nextId = node.children[0];
      node = getNode(nextId);
      safety += 1;
    }

    if (nextId !== currentNodeId) {
      goToNode(nextId, { recordHistory: false });
    }
  }, [currentNodeId, getNode, goToNode, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="flow-preview-overlay" role="dialog" aria-modal="true" aria-label="Flow Preview">
      <div className="flow-preview-modal">
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
                    style={{ width: `${progressRatio * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>

          <button type="button" className="btn-icon" onClick={onClose} aria-label="Preview schließen">
            <X size={16} />
          </button>
        </div>

        <div className="flow-preview-body">
          <div
            key={isComplete ? 'complete' : (currentNodeId || 'empty')}
            className="flow-preview-step"
          >
            {isComplete && (
            <div className="flow-preview-end">
              <h4>Flow beendet</h4>
              <p>Alle Schritte wurden durchlaufen.</p>
            </div>
          )}

            {!isComplete && !currentNode && (
            <div className="flow-preview-empty">
              <p>Kein Flow vorhanden.</p>
            </div>
          )}

            {!isComplete && currentNode && (currentNode.type === 'module' || currentNode.type === 'start') && (currentNode.children?.length || 0) > 1 && (
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
          )}

            {!isComplete && currentNode && currentNode.type === 'question' && (
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
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}

              {(inputType === 'Range-Slider') && (
                <div className="flow-preview-range">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={inputValue || 5}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="flow-preview-range-value">{inputValue || 5}</div>
                </div>
              )}

              {inputType !== 'Eingabe' && inputType !== 'Range-Slider' && (
                <>
                  {answers.length === 0 && (
                    <p className="flow-preview-hint">
                      Keine Antwortoptionen definiert – der Preview springt mit „Weiter“ fort.
                    </p>
                  )}

                  {answers.length > 0 && inputType === 'Dropdown' && (
                    <select
                      className="flow-preview-select"
                      value={selectedAnswers[0] ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setSelectedAnswers([]);
                          return;
                        }
                        setSelectedAnswers([Number(value)]);
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
                            onClick={() => toggleAnswer(index)}
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
          )}
          </div>
        </div>

        <div className="flow-preview-footer">
          {!isComplete && history.length > 0 && (
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ArrowLeft size={14} />
              Zurück
            </button>
          )}

          {!isComplete && currentNode?.type === 'question' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canContinue}
            >
              Weiter
            </button>
          )}

          {isComplete && (
            <button type="button" className="btn btn-primary" onClick={handleRestart}>
              <RotateCcw size={14} />
              Neu starten
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowPreviewModal;
