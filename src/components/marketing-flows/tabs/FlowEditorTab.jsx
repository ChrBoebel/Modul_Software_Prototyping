import { useCallback, useMemo, useState } from 'react';
import { Layers } from 'lucide-react';
import { StructuredFlowCanvas, useFlowHistory, useFlowKeyboardShortcuts } from '../structured-flow';
import FlowPreviewModal from '../preview/FlowPreviewModal';
import { getExampleFlowForCampaign } from '../exampleFlows';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import defaultProducts from '../../../data/productCatalog.json';
import { createDefaultCard } from './flow-editor/constants';
import EditorToolbar from './flow-editor/EditorToolbar';
import EditorComponentLibrary from './flow-editor/EditorComponentLibrary';
import NodePropertiesPanel from './flow-editor/NodePropertiesPanel';

const FlowEditorTab = ({ showToast, campaign, onClose, onLeadCreated, onNavigateToLead }) => {
  const example = useMemo(() => getExampleFlowForCampaign(campaign?.id), [campaign?.id]);

  // Load products from localStorage for product-select questions
  const [products] = useLocalStorage('swk:productCatalog', defaultProducts);
  const activeProducts = useMemo(() => products.filter(p => p.config?.active !== false), [products]);

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

  const handleCampaignNameChange = useCallback((value) => {
    updateCampaign({ campaignName: value });
    updateNode('start', { label: value }, true);
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
        updateCard(nextCardId, createDefaultCard('Neue Frage'), 'Neue Frage', true);
      }
      showToast(`${nodeType === 'question' ? 'Frage' : 'Modul'} hinzugefügt`);
    }
  }, [insertNode, nodes, showToast, updateCard]);

  // Handle adding an element from QuickAddMenu (with full element info)
  const handleAddElement = useCallback((afterNodeId, element) => {
    const nodeType = element.type;
    const isQuestion = nodeType === 'question';
    const isProductSelect = element.id === 'product-select';

    const nextNumber = isQuestion
      ? nodes.filter(n => n.type === 'question').length + 1
      : nodes.filter(n => n.type === nodeType).length + 1;

    const nextCardId = isQuestion ? `Question_${nextNumber}` : null;

    const newId = insertNode(afterNodeId, isQuestion ? 'question' : 'module');
    if (newId) {
      updateNode(newId, {
        label: element.label,
        subType: element.id
      }, true);

      if (nextCardId && isQuestion) {
        const answers = isProductSelect
          ? activeProducts.map(p => p.name)
          : ['Antwort 1', 'Antwort 2'];

        updateCard(nextCardId, {
          ...createDefaultCard(element.label),
          inputType: element.inputType || 'Single-Choice',
          answers,
          isProductQuestion: isProductSelect
        }, element.label, true);
      }

      showToast(`${element.label} hinzugefügt`);
    }
  }, [insertNode, nodes, showToast, updateCard, updateNode, activeProducts]);

  const handleAddComponentToFlow = (component) => {
    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      handleAddNode(lastNode.id, component.id.includes('choice') || component.id.includes('slider') || component.id.includes('input') || component.id.includes('dropdown')
        ? 'question'
        : 'module');
      showToast(`${component.label} hinzugefügt`);
    }
  };

  const handleBranchNode = useCallback((nodeId) => {
    const newId = createBranch(nodeId);
    if (newId) {
      showToast('Verzweigung erstellt');
    }
  }, [createBranch, showToast]);

  const handleDeleteNode = useCallback((nodeId) => {
    deleteNode(nodeId);
    showToast('Node gelöscht');
  }, [deleteNode, showToast]);

  const handleSelectNode = useCallback((node) => {
    selectNode(node);
  }, [selectNode]);

  const handleUpdateNodeLabel = useCallback((newLabel) => {
    if (selectedNode) {
      updateNode(selectedNode.id, { label: newLabel });
      selectNode({ ...selectedNode, label: newLabel });

      if (selectedNode.cardId) {
        updateCard(selectedNode.cardId, { title: newLabel }, newLabel, true);
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

  // Toolbar handlers
  const handleUndo = () => {
    const actionName = undo();
    if (actionName) showToast(`Rückgängig: ${actionName}`);
  };

  const handleRedo = () => {
    const actionName = redo();
    if (actionName) showToast(`Wiederholt: ${actionName}`);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      showToast('Schließen');
    }
  };

  const handlePreview = () => {
    setPreviewStartNodeId(null);
    setIsPreviewOpen(true);
  };

  const handlePreviewFromNode = () => {
    setPreviewStartNodeId(selectedNode?.id || null);
    setIsPreviewOpen(true);
  };

  return (
    <div className="flow-editor-tab">
      <EditorToolbar
        campaignName={campaignName}
        campaignDescription={campaignDescription}
        onCampaignNameChange={handleCampaignNameChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onClose={handleClose}
        onPreview={handlePreview}
        onSave={() => showToast('Gespeichert')}
      />

      <div className="editor-container">
        <EditorComponentLibrary
          isOpen={showComponentLibrary}
          onClose={() => setShowComponentLibrary(false)}
          expandedCategories={expandedCategories}
          onToggleCategory={toggleCategory}
          onAddComponent={handleAddComponentToFlow}
        />

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

        <NodePropertiesPanel
          selectedNode={selectedNode}
          selectedCard={selectedCard}
          showCampaignInspector={showCampaignInspector}
          showAnswerOptions={showAnswerOptions}
          campaignDescription={campaignDescription}
          onUpdateCampaign={updateCampaign}
          onClearSelection={clearSelection}
          onUpdateNodeLabel={handleUpdateNodeLabel}
          onUpdateCard={updateCard}
          onAddAnswer={handleAddAnswer}
          onUpdateAnswer={handleUpdateAnswer}
          onRemoveAnswer={handleRemoveAnswer}
          onPreview={handlePreview}
          onPreviewFromNode={handlePreviewFromNode}
        />
      </div>

      <FlowPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        nodes={nodes}
        cardsById={cardsById}
        campaignName={campaignName}
        campaignId={campaign?.id || 'default'}
        startNodeId={previewStartNodeId}
        onLeadCreated={onLeadCreated}
        onNavigateToLead={onNavigateToLead}
      />
    </div>
  );
};

export default FlowEditorTab;
