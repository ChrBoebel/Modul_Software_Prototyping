import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useFlowHistory - Undo/Redo history management for the Flow Editor
 *
 * Tracks changes to both flowData and cardsById, allowing users to
 * undo/redo their actions with Ctrl+Z / Ctrl+Shift+Z.
 */
export const useFlowHistory = (initialFlowData, initialCards) => {
  // Current state
  const [flowData, setFlowData] = useState(initialFlowData);
  const [cardsById, setCardsById] = useState(initialCards);
  const [selectedNode, setSelectedNode] = useState(null);

  // History stacks
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Action name for toast feedback
  const [lastAction, setLastAction] = useState(null);

  // Flag to prevent recording during undo/redo
  const isUndoingRef = useRef(false);

  // Max history size to prevent memory issues
  const MAX_HISTORY_SIZE = 50;

  /**
   * Record current state to history before making changes
   */
  const recordHistory = useCallback((actionName) => {
    if (isUndoingRef.current) return;

    const snapshot = {
      flowData: JSON.parse(JSON.stringify(flowData)),
      cardsById: JSON.parse(JSON.stringify(cardsById)),
      actionName,
      timestamp: Date.now()
    };

    setPast(prev => {
      const newPast = [...prev, snapshot];
      // Limit history size
      if (newPast.length > MAX_HISTORY_SIZE) {
        return newPast.slice(-MAX_HISTORY_SIZE);
      }
      return newPast;
    });

    // Clear future when new action is taken
    setFuture([]);
    setLastAction(actionName);
  }, [flowData, cardsById]);

  /**
   * Undo - restore previous state
   */
  const undo = useCallback(() => {
    if (past.length === 0) return null;

    isUndoingRef.current = true;

    const previousSnapshot = past[past.length - 1];
    const currentSnapshot = {
      flowData: JSON.parse(JSON.stringify(flowData)),
      cardsById: JSON.parse(JSON.stringify(cardsById)),
      actionName: lastAction,
      timestamp: Date.now()
    };

    // Move current to future
    setFuture(prev => [...prev, currentSnapshot]);

    // Remove from past
    setPast(prev => prev.slice(0, -1));

    // Restore previous state
    setFlowData(previousSnapshot.flowData);
    setCardsById(previousSnapshot.cardsById);
    setSelectedNode(null);

    const actionName = previousSnapshot.actionName;
    setLastAction(null);

    // Reset flag after state updates
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);

    return actionName;
  }, [past, flowData, cardsById, lastAction]);

  /**
   * Redo - restore future state
   */
  const redo = useCallback(() => {
    if (future.length === 0) return null;

    isUndoingRef.current = true;

    const nextSnapshot = future[future.length - 1];
    const currentSnapshot = {
      flowData: JSON.parse(JSON.stringify(flowData)),
      cardsById: JSON.parse(JSON.stringify(cardsById)),
      actionName: lastAction,
      timestamp: Date.now()
    };

    // Move current to past
    setPast(prev => [...prev, currentSnapshot]);

    // Remove from future
    setFuture(prev => prev.slice(0, -1));

    // Restore next state
    setFlowData(nextSnapshot.flowData);
    setCardsById(nextSnapshot.cardsById);
    setSelectedNode(null);

    const actionName = nextSnapshot.actionName;
    setLastAction(actionName);

    // Reset flag after state updates
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);

    return actionName;
  }, [future, flowData, cardsById, lastAction]);

  /**
   * Check if undo/redo is possible
   */
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // ----- Flow State Operations (wrapped with history recording) -----

  const getNode = useCallback((nodeId) => {
    return flowData.nodes.find(n => n.id === nodeId);
  }, [flowData.nodes]);

  const getRootNode = useCallback(() => {
    return flowData.nodes.find(n => n.type === 'start');
  }, [flowData.nodes]);

  const insertNode = useCallback((afterNodeId, nodeType) => {
    const afterNode = getNode(afterNodeId);
    if (!afterNode) return;

    recordHistory('Node hinzugefügt');

    const newId = `${nodeType}-${Date.now()}`;
    const existingChildren = [...afterNode.children];

    const newNode = {
      id: newId,
      type: nodeType,
      label: nodeType === 'question' ? 'Neue Frage' : 'Neues Modul',
      cardId: nodeType === 'question' ? `Question_${flowData.nodes.filter(n => n.type === 'question').length + 1}` : undefined,
      children: existingChildren
    };

    setFlowData(prev => ({
      ...prev,
      nodes: [
        ...prev.nodes.map(node => {
          if (node.id === afterNodeId) {
            return { ...node, children: [newId] };
          }
          return node;
        }),
        newNode
      ]
    }));

    return newId;
  }, [flowData.nodes, getNode, recordHistory]);

  const createBranch = useCallback((nodeId) => {
    const node = getNode(nodeId);
    if (!node) return;

    recordHistory('Verzweigung erstellt');

    const newId = `module-${Date.now()}`;
    const newNode = {
      id: newId,
      type: 'module',
      label: `Modul_${flowData.nodes.filter(n => n.type === 'module').length + 1}`,
      children: []
    };

    setFlowData(prev => ({
      ...prev,
      nodes: [
        ...prev.nodes.map(n => {
          if (n.id === nodeId) {
            return { ...n, children: [...n.children, newId] };
          }
          return n;
        }),
        newNode
      ]
    }));

    return newId;
  }, [flowData.nodes, getNode, recordHistory]);

  const updateNode = useCallback((nodeId, updates, skipHistory = false) => {
    if (!skipHistory) {
      recordHistory('Node bearbeitet');
    }

    setFlowData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        return node;
      })
    }));
  }, [recordHistory]);

  const deleteNode = useCallback((nodeId) => {
    const node = getNode(nodeId);
    if (!node || node.type === 'start') return;

    const parent = flowData.nodes.find(n => n.children.includes(nodeId));
    if (!parent) return;

    recordHistory('Node gelöscht');

    setFlowData(prev => ({
      ...prev,
      nodes: prev.nodes
        .filter(n => n.id !== nodeId)
        .map(n => {
          if (n.id === parent.id) {
            const newChildren = n.children.filter(c => c !== nodeId);
            return { ...n, children: [...newChildren, ...node.children] };
          }
          return n;
        })
    }));

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [flowData.nodes, getNode, selectedNode, recordHistory]);

  const updateCampaign = useCallback((updates) => {
    recordHistory('Kampagne bearbeitet');
    setFlowData(prev => ({
      ...prev,
      ...updates
    }));
  }, [recordHistory]);

  const selectNode = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // ----- Cards Operations (wrapped with history recording) -----

  const updateCard = useCallback((cardId, updates, fallbackTitle, skipHistory = false) => {
    if (!skipHistory) {
      recordHistory('Karte bearbeitet');
    }

    setCardsById(prev => {
      const existing = prev[cardId] || {
        title: fallbackTitle,
        description: '',
        inputType: 'Single-Choice',
        answers: ['Antwort 1', 'Antwort 2']
      };
      return { ...prev, [cardId]: { ...existing, ...updates } };
    });
  }, [recordHistory]);

  const getCardForNode = useCallback((node) => {
    if (!node?.cardId) return null;
    return cardsById[node.cardId] || {
      title: node.label,
      description: '',
      inputType: 'Single-Choice',
      answers: ['Antwort 1', 'Antwort 2']
    };
  }, [cardsById]);

  return {
    // Flow state
    flowData,
    nodes: flowData.nodes,
    selectedNode,
    campaignName: flowData.campaignName,
    campaignDescription: flowData.campaignDescription,

    // Flow operations
    getNode,
    getRootNode,
    insertNode,
    createBranch,
    updateNode,
    deleteNode,
    updateCampaign,
    selectNode,
    clearSelection,

    // Cards state & operations
    cardsById,
    getCardForNode,
    updateCard,

    // History operations
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: past.length,
    futureLength: future.length
  };
};

/**
 * useFlowKeyboardShortcuts - Keyboard shortcuts for Flow Editor
 * Handles Ctrl+Z (Undo) and Ctrl+Shift+Z / Ctrl+Y (Redo)
 */
export const useFlowKeyboardShortcuts = ({ undo, redo, canUndo, canRedo, onUndo, onRedo }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl/Cmd + Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          const actionName = undo();
          onUndo?.(actionName);
        }
        return;
      }

      // Check for Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y (Redo)
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        if (canRedo) {
          const actionName = redo();
          onRedo?.(actionName);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, onUndo, onRedo]);
};

export default useFlowHistory;
