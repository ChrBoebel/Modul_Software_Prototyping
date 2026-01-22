import { useState, useCallback } from 'react';
import { DEFAULT_FLOW_DATA } from '../exampleFlows';

const initialFlowData = DEFAULT_FLOW_DATA;

export const useFlowState = (initialData = initialFlowData) => {
  const [flowData, setFlowData] = useState(initialData);
  const [selectedNode, setSelectedNode] = useState(null);

  // Get a node by ID
  const getNode = useCallback((nodeId) => {
    return flowData.nodes.find(n => n.id === nodeId);
  }, [flowData.nodes]);

  // Get the root node (start)
  const getRootNode = useCallback(() => {
    return flowData.nodes.find(n => n.type === 'start');
  }, [flowData.nodes]);

  // Add a new node after a parent node
  const addNode = useCallback((parentId, nodeType, position = 0) => {
    const newId = `${nodeType}-${Date.now()}`;
    const parentNode = getNode(parentId);

    if (!parentNode) return;

    const newNode = {
      id: newId,
      type: nodeType,
      label: nodeType === 'question' ? 'Neue Frage' : 'Neues Modul',
      cardId: nodeType === 'question' ? `Question_${flowData.nodes.filter(n => n.type === 'question').length + 1}` : undefined,
      children: []
    };

    // If parent has existing children, insert the new node and move children to it
    const existingChildren = [...parentNode.children];

    setFlowData(prev => ({
      ...prev,
      nodes: [
        ...prev.nodes.map(node => {
          if (node.id === parentId) {
            // Insert new node as child at the specified position
            const newChildren = [...node.children];
            if (existingChildren.length === 0) {
              // No children, just add new node
              newChildren.push(newId);
            } else {
              // Insert at position, moving existing children to new node
              newChildren.splice(position, 0, newId);
            }
            return { ...node, children: [newId] };
          }
          return node;
        }),
        { ...newNode, children: existingChildren }
      ]
    }));

    return newId;
  }, [flowData.nodes, getNode]);

  // Add a node between two nodes (insert in chain)
  const insertNode = useCallback((afterNodeId, nodeType) => {
    const afterNode = getNode(afterNodeId);
    if (!afterNode) return;

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
  }, [flowData.nodes, getNode]);

  // Create a branch (add a second child to a node)
  const createBranch = useCallback((nodeId) => {
    const node = getNode(nodeId);
    if (!node) return;

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
  }, [flowData.nodes, getNode]);

  // Update a node's properties
  const updateNode = useCallback((nodeId, updates) => {
    setFlowData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        return node;
      })
    }));
  }, []);

  // Delete a node (and reconnect parent to children)
  const deleteNode = useCallback((nodeId) => {
    const node = getNode(nodeId);
    if (!node || node.type === 'start') return; // Can't delete start node

    // Find parent
    const parent = flowData.nodes.find(n => n.children.includes(nodeId));
    if (!parent) return;

    setFlowData(prev => ({
      ...prev,
      nodes: prev.nodes
        .filter(n => n.id !== nodeId)
        .map(n => {
          if (n.id === parent.id) {
            // Replace deleted node with its children in parent
            const newChildren = n.children.filter(c => c !== nodeId);
            return { ...n, children: [...newChildren, ...node.children] };
          }
          return n;
        })
    }));

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [flowData.nodes, getNode, selectedNode]);

  // Update campaign info
  const updateCampaign = useCallback((updates) => {
    setFlowData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Select a node
  const selectNode = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return {
    flowData,
    nodes: flowData.nodes,
    selectedNode,
    campaignName: flowData.campaignName,
    campaignDescription: flowData.campaignDescription,
    getNode,
    getRootNode,
    addNode,
    insertNode,
    createBranch,
    updateNode,
    deleteNode,
    updateCampaign,
    selectNode,
    clearSelection
  };
};

export default useFlowState;
