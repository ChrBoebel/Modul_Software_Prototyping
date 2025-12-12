import { useCallback, useMemo, useState } from 'react';
import { Save, Play, X, Plus, Trash2 } from 'lucide-react';
import { StructuredFlowCanvas, useFlowState } from '../structured-flow';
import FlowPreviewModal from '../preview/FlowPreviewModal';
import { getExampleFlowForCampaign } from '../exampleFlows';

const INPUT_TYPES = ['Single-Choice', 'Multi-Choice', 'Range-Slider', 'Eingabe', 'Dropdown'];

const createDefaultCard = (title = 'Neue Frage') => ({
  title,
  description: '',
  inputType: 'Single-Choice',
  answers: ['Antwort 1', 'Antwort 2']
});

const FlowEditorTab = ({ showToast, campaign, onClose }) => {
  const example = useMemo(() => getExampleFlowForCampaign(campaign?.id), [campaign?.id]);

  const {
    nodes,
    selectedNode,
    campaignName,
    campaignDescription,
    getNode,
    insertNode,
    createBranch,
    updateNode,
    deleteNode,
    updateCampaign,
    selectNode,
    clearSelection
  } = useFlowState(example.flowData);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewStartNodeId, setPreviewStartNodeId] = useState(null);

  const [cardsById, setCardsById] = useState(() => example.cards);

  const getCardForNode = useCallback((node) => {
    if (!node?.cardId) return null;
    return cardsById[node.cardId] || createDefaultCard(node.label);
  }, [cardsById]);

  const updateCard = useCallback((cardId, updates, fallbackTitle) => {
    setCardsById(prev => {
      const existing = prev[cardId] || createDefaultCard(fallbackTitle);
      return { ...prev, [cardId]: { ...existing, ...updates } };
    });
  }, []);

  const handleCampaignNameChange = useCallback((value) => {
    updateCampaign({ campaignName: value });
    updateNode('start', { label: value });
  }, [updateCampaign, updateNode]);

  // Handle adding a node after another node
  const handleAddNode = useCallback((afterNodeId, nodeType) => {
    const nextQuestionNumber = nodeType === 'question'
      ? nodes.filter(n => n.type === 'question').length + 1
      : null;
    const nextCardId = nextQuestionNumber ? `Question_${nextQuestionNumber}` : null;

    const newId = insertNode(afterNodeId, nodeType);
    if (newId) {
      if (nextCardId) {
        updateCard(nextCardId, createDefaultCard('Neue Frage'), 'Neue Frage');
      }
      showToast(`${nodeType === 'question' ? 'Frage' : 'Modul'} hinzugefügt`);
    }
  }, [insertNode, nodes, showToast, updateCard]);

  // Handle creating a branch
  const handleBranchNode = useCallback((nodeId) => {
    const newId = createBranch(nodeId);
    if (newId) {
      showToast('Verzweigung erstellt');
    }
  }, [createBranch, showToast]);

  // Handle deleting a node
  const handleDeleteNode = useCallback((nodeId) => {
    deleteNode(nodeId);
    showToast('Node gelöscht');
  }, [deleteNode, showToast]);

  // Handle node selection
  const handleSelectNode = useCallback((node) => {
    selectNode(node);
  }, [selectNode]);

  // Handle updating selected node label
  const handleUpdateNodeLabel = useCallback((newLabel) => {
    if (selectedNode) {
      updateNode(selectedNode.id, { label: newLabel });
      selectNode({ ...selectedNode, label: newLabel });

      if (selectedNode.cardId) {
        updateCard(selectedNode.cardId, { title: newLabel }, newLabel);
      }
    }
  }, [selectedNode, updateNode, selectNode, updateCard]);

  const selectedCard = useMemo(() => getCardForNode(selectedNode), [getCardForNode, selectedNode]);
  const showAnswerOptions = selectedCard && !['Eingabe', 'Range-Slider'].includes(selectedCard.inputType);

  const handleAddAnswer = useCallback(() => {
    if (!selectedNode?.cardId) return;
    const card = selectedCard || createDefaultCard(selectedNode.label);
    updateCard(
      selectedNode.cardId,
      { answers: [...card.answers, `Antwort ${card.answers.length + 1}`] },
      selectedNode.label
    );
  }, [selectedNode, selectedCard, updateCard]);

  const handleUpdateAnswer = useCallback((index, value) => {
    if (!selectedNode?.cardId) return;
    const card = selectedCard || createDefaultCard(selectedNode.label);
    const answers = card.answers.map((answer, idx) => (idx === index ? value : answer));
    updateCard(selectedNode.cardId, { answers }, selectedNode.label);
  }, [selectedNode, selectedCard, updateCard]);

  const handleRemoveAnswer = useCallback((index) => {
    if (!selectedNode?.cardId) return;
    const card = selectedCard || createDefaultCard(selectedNode.label);
    updateCard(
      selectedNode.cardId,
      { answers: card.answers.filter((_, idx) => idx !== index) },
      selectedNode.label
    );
  }, [selectedNode, selectedCard, updateCard]);

  const showCampaignInspector = !selectedNode || selectedNode.type === 'start';

  return (
    <div className="flow-editor-tab">
      {/* Editor Header */}
      <div className="editor-header">
        <div className="editor-title">
          <input
            type="text"
            value={campaignName}
            onChange={(e) => handleCampaignNameChange(e.target.value)}
            className="campaign-name-input"
            aria-label="Kampagnenname"
          />
          <span className="campaign-description">{campaignDescription || 'Beschreibung hinzufügen'}</span>
        </div>
        <div className="editor-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                showToast('Schließen');
              }
            }}
          >
            <X size={16} />
            Schließen
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setPreviewStartNodeId(null);
              setIsPreviewOpen(true);
            }}
          >
            <Play size={16} />
            Flow testen
          </button>
          <button type="button" className="btn btn-primary" onClick={() => showToast('Gespeichert')}>
            <Save size={16} />
            Speichern
          </button>
        </div>
      </div>

      <div className="editor-container">
        {/* Structured Flow Canvas */}
        <div className="structured-flow-wrapper">
          <StructuredFlowCanvas
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            onAddNode={handleAddNode}
            onBranchNode={handleBranchNode}
            onDeleteNode={handleDeleteNode}
            getNode={getNode}
          />
        </div>

        {/* Unified Inspector Panel */}
        <aside className="editor-inspector-panel">
          {showCampaignInspector ? (
            <>
              <div className="inspector-header">
                <div className="inspector-title-row">
                  <h4>Kampagne</h4>
                  {selectedNode && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link"
                      onClick={clearSelection}
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
                    onChange={(e) => updateCampaign({ campaignDescription: e.target.value })}
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
                  onClick={() => {
                    setPreviewStartNodeId(null);
                    setIsPreviewOpen(true);
                  }}
                >
                  <Play size={14} />
                  Flow testen
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="inspector-header">
                <div className="inspector-title-row">
                  <h4>{selectedNode.type === 'question' ? 'Frage' : 'Modul'}</h4>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={clearSelection}
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
                    onChange={(e) => handleUpdateNodeLabel(e.target.value)}
                    className="form-input"
                  />
                </div>

                {selectedNode.type === 'question' && selectedCard && (
                  <>
                    <div className="config-section">
                      <label>Beschreibung</label>
                      <textarea
                        value={selectedCard.description}
                        onChange={(e) => updateCard(
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
                        onChange={(e) => updateCard(
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
                      <div className="config-section">
                        <div className="inspector-section-row">
                          <h5>Antwortoptionen</h5>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={handleAddAnswer}
                          >
                            <Plus size={14} />
                            Antwort hinzufügen
                          </button>
                        </div>

                        <div className="answer-options">
                          {selectedCard.answers.map((answer, index) => (
                            <div key={index} className="answer-option">
                              <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleUpdateAnswer(index, e.target.value)}
                                className="form-input"
                                placeholder={`Antwort ${index + 1}`}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-link danger"
                                onClick={() => handleRemoveAnswer(index)}
                                aria-label="Antwort löschen"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="inspector-hint">
                        {selectedCard.inputType === 'Eingabe'
                          ? 'Diese Frage erwartet eine freie Eingabe.'
                          : 'Diese Frage nutzt eine Skala von 0–10.'}
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
                  onClick={() => {
                    setPreviewStartNodeId(selectedNode?.id || null);
                    setIsPreviewOpen(true);
                  }}
                >
                  <Play size={14} />
                  Ab hier testen
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      <FlowPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        nodes={nodes}
        cardsById={cardsById}
        campaignName={campaignName}
        startNodeId={previewStartNodeId}
      />
    </div>
  );
};

export default FlowEditorTab;
