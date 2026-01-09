import { useCallback, useMemo, useState } from 'react';
import { Save, Play, X, Plus, Trash2, HelpCircle, ListChecks, CheckSquare, Sliders, Type, ChevronDown, Image, FileText, FormInput, MessageSquare, Layers, Undo2, Redo2 } from 'lucide-react';
import { StructuredFlowCanvas, useFlowHistory, useFlowKeyboardShortcuts } from '../structured-flow';
import FlowPreviewModal from '../preview/FlowPreviewModal';
import { getExampleFlowForCampaign } from '../exampleFlows';
import { Button } from '../../ui';

const INPUT_TYPES = ['Single-Choice', 'Multi-Choice', 'Range-Slider', 'Eingabe', 'Dropdown'];

// Component Library für den Editor
const COMPONENT_CATEGORIES = [
  {
    id: 'questions',
    label: 'Fragen',
    icon: HelpCircle,
    components: [
      { id: 'single-choice', label: 'Single-Choice', icon: ListChecks, description: 'Eine Antwort auswählen' },
      { id: 'multi-choice', label: 'Multi-Choice', icon: CheckSquare, description: 'Mehrere Antworten möglich' },
      { id: 'range-slider', label: 'Range-Slider', icon: Sliders, description: 'Wert auf Skala wählen' },
      { id: 'text-input', label: 'Texteingabe', icon: Type, description: 'Freie Texteingabe' },
      { id: 'dropdown', label: 'Dropdown', icon: ChevronDown, description: 'Auswahl aus Liste' }
    ]
  },
  {
    id: 'content',
    label: 'Inhalte',
    icon: FileText,
    components: [
      { id: 'info-card', label: 'Info-Karte', icon: FileText, description: 'Informationstext anzeigen' },
      { id: 'image', label: 'Bild', icon: Image, description: 'Bild oder Grafik' },
      { id: 'video', label: 'Video', icon: MessageSquare, description: 'Video einbetten' }
    ]
  },
  {
    id: 'forms',
    label: 'Formulare',
    icon: FormInput,
    components: [
      { id: 'contact-form', label: 'Kontaktdaten', icon: FormInput, description: 'Name, E-Mail, Telefon' },
      { id: 'address-form', label: 'Adresseingabe', icon: FormInput, description: 'Straße, PLZ, Ort' }
    ]
  },
  {
    id: 'logic',
    label: 'Logik',
    icon: Layers,
    components: [
      { id: 'branch', label: 'Verzweigung', icon: Layers, description: 'Bedingte Weiterleitung' },
      { id: 'score-check', label: 'Score-Prüfung', icon: Layers, description: 'Nach Punktzahl verzweigen' }
    ]
  }
];

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
    cardsById,
    getNode,
    getCardForNode,
    insertNode,
    createBranch,
    updateNode,
    deleteNode,
    updateCampaign,
    updateCard,
    selectNode,
    clearSelection,
    undo,
    redo,
    canUndo,
    canRedo
  } = useFlowHistory(example.flowData, example.cards);

  // Keyboard shortcuts for Undo/Redo
  useFlowKeyboardShortcuts({
    undo,
    redo,
    canUndo,
    canRedo,
    onUndo: (actionName) => showToast(`Rückgängig: ${actionName || 'Aktion'}`),
    onRedo: (actionName) => showToast(`Wiederholt: ${actionName || 'Aktion'}`)
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewStartNodeId, setPreviewStartNodeId] = useState(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(['questions']);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddComponentToFlow = (component) => {
    // Map component type to node type
    const nodeType = component.id.includes('choice') || component.id.includes('slider') || component.id.includes('input') || component.id.includes('dropdown')
      ? 'question'
      : 'module';

    // Find the last node to add after
    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      handleAddNode(lastNode.id, nodeType);
      showToast(`${component.label} hinzugefügt`);
    }
  };

  const handleCampaignNameChange = useCallback((value) => {
    updateCampaign({ campaignName: value });
    updateNode('start', { label: value }, true); // skipHistory - already recorded by updateCampaign
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
        updateCard(nextCardId, createDefaultCard('Neue Frage'), 'Neue Frage', true); // skipHistory - already recorded by insertNode
      }
      showToast(`${nodeType === 'question' ? 'Frage' : 'Modul'} hinzugefügt`);
    }
  }, [insertNode, nodes, showToast, updateCard]);

  // Handle adding an element from QuickAddMenu (with full element info)
  const handleAddElement = useCallback((afterNodeId, element) => {
    // Determine node type based on element
    const nodeType = element.type;
    const isQuestion = nodeType === 'question';

    const nextNumber = isQuestion
      ? nodes.filter(n => n.type === 'question').length + 1
      : nodes.filter(n => n.type === nodeType).length + 1;

    const nextCardId = isQuestion ? `Question_${nextNumber}` : null;

    const newId = insertNode(afterNodeId, isQuestion ? 'question' : 'module');
    if (newId) {
      // Update the node with element-specific info (skipHistory - already recorded by insertNode)
      updateNode(newId, {
        label: element.label,
        subType: element.id
      }, true);

      if (nextCardId && isQuestion) {
        // Create card with the specific input type (skipHistory - already recorded by insertNode)
        updateCard(nextCardId, {
          ...createDefaultCard(element.label),
          inputType: element.inputType || 'Single-Choice'
        }, element.label, true);
      }

      showToast(`${element.label} hinzugefügt`);
    }
  }, [insertNode, nodes, showToast, updateCard, updateNode]);

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
        updateCard(selectedNode.cardId, { title: newLabel }, newLabel, true); // skipHistory - already recorded by updateNode
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
            className="btn btn-icon"
            onClick={() => {
              const actionName = undo();
              if (actionName) showToast(`Rückgängig: ${actionName}`);
            }}
            disabled={!canUndo}
            title="Rückgängig (Ctrl+Z)"
            aria-label="Rückgängig"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => {
              const actionName = redo();
              if (actionName) showToast(`Wiederholt: ${actionName}`);
            }}
            disabled={!canRedo}
            title="Wiederholen (Ctrl+Shift+Z)"
            aria-label="Wiederholen"
          >
            <Redo2 size={16} />
          </button>
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
        {/* Component Library Sidebar */}
        <aside className={`component-library-sidebar ${showComponentLibrary ? 'open' : ''}`}>
          <div className="library-sidebar-header">
            <h4>Komponenten</h4>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setShowComponentLibrary(false)}
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
                    onClick={() => toggleCategory(category.id)}
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
                            onClick={() => handleAddComponentToFlow(component)}
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

        {/* Structured Flow Canvas */}
        <div className="structured-flow-wrapper">
          {!showComponentLibrary && (
            <button
              type="button"
              className="btn btn-secondary library-toggle-btn"
              onClick={() => setShowComponentLibrary(true)}
            >
              <Layers size={16} />
              Komponenten
            </button>
          )}
          <StructuredFlowCanvas
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            onAddNode={handleAddNode}
            onAddElement={handleAddElement}
            onBranchNode={handleBranchNode}
            onDeleteNode={handleDeleteNode}
            getNode={getNode}
            getCardForNode={getCardForNode}
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
                            Hinzufügen
                          </button>
                        </div>

                        <div className="answer-options-enhanced">
                          {selectedCard.answers.map((answer, index) => {
                            const answerObj = typeof answer === 'object' ? answer : { text: answer, score: 0 };
                            return (
                              <div key={index} className="answer-option-row">
                                <div className="answer-drag-handle">
                                  <span className="drag-dots">⋮⋮</span>
                                </div>
                                <input
                                  type="text"
                                  value={answerObj.text || answer}
                                  onChange={(e) => handleUpdateAnswer(index, e.target.value)}
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
                                      updateCard(selectedNode.cardId, { answers }, selectedNode.label);
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
                                  onClick={() => handleRemoveAnswer(index)}
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
