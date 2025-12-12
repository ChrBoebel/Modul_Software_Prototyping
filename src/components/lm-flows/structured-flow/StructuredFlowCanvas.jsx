import { useCallback, useState, useRef, useEffect } from 'react';
import { Minus, Plus, Maximize } from 'lucide-react';
import FlowNode from './FlowNode';
import FlowConnector from './FlowConnector';

const StructuredFlowCanvas = ({
  nodes,
  selectedNode,
  onSelectNode,
  onAddNode,
  onBranchNode,
  onDeleteNode,
  getNode
}) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.85 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const treeRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Fit to view - calculate scale to fit the flow in the viewport
  const handleFitToView = useCallback(() => {
    if (!canvasRef.current || !treeRef.current) return;

    const canvas = canvasRef.current.getBoundingClientRect();
    const tree = treeRef.current.getBoundingClientRect();

    // Calculate scale to fit with some padding
    const scaleX = (canvas.width - 40) / tree.width;
    const scaleY = (canvas.height - 40) / tree.height;
    const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1

    setTransform({ x: 0, y: 0, scale: Math.max(newScale, 0.5) });
  }, []);

  // Zoom handlers
  const handleZoomIn = () => setTransform(p => ({ ...p, scale: Math.min(p.scale + 0.1, 2) }));
  const handleZoomOut = () => setTransform(p => ({ ...p, scale: Math.max(p.scale - 0.1, 0.4) }));
  const handleReset = () => handleFitToView();

  // Panning handlers
  const handleMouseDown = (e) => {
    // Only drag if clicking the canvas background
    if (e.target.closest('.structured-node') || e.target.closest('button')) return;
    
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setTransform(p => ({
      ...p,
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setTransform(p => ({
        ...p,
        scale: Math.min(Math.max(p.scale + delta, 0.5), 2)
      }));
    } else {
       // Optional: Pan with wheel if not zooming
       // setTransform(p => ({ ...p, y: p.y - e.deltaY, x: p.x - e.deltaX }));
    }
  };
  
  // Attach/detach global mouse up to catch drag release outside canvas
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  // Render a single node and its children recursively
  const renderNode = useCallback((nodeId, depth = 0, isLastInBranch = true) => {
    const node = getNode(nodeId);
    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isBranch = node.children && node.children.length > 1;
    const isSelected = selectedNode?.id === nodeId;

    return (
      <div className="flow-level" key={nodeId}>
        {/* The Node itself */}
        <FlowNode
          node={node}
          isSelected={isSelected}
          onClick={onSelectNode}
          onBranch={onBranchNode}
          onDelete={onDeleteNode}
          showBranchButton={node.type === 'question'}
          showDeleteButton={node.type !== 'start'}
        />

        {/* Connector and children */}
        {hasChildren && (
          <>
            {/* Connector with plus button */}
            <FlowConnector
              onAdd={(type) => onAddNode(nodeId, type)}
              showAddButton={true}
            />

            {/* Render children */}
            {isBranch ? (
              // Multiple children = branch layout
              <div className="flow-branch">
                {node.children.map((childId, index) => (
                  <div className="branch-path" key={childId}>
                    {renderNode(childId, depth + 1, index === node.children.length - 1)}
                  </div>
                ))}
              </div>
            ) : (
              // Single child = linear flow
              renderNode(node.children[0], depth + 1, true)
            )}
          </>
        )}

        {/* End connector for leaf nodes */}
        {!hasChildren && (
          <FlowConnector
            onAdd={(type) => onAddNode(nodeId, type)}
            showAddButton={true}
          />
        )}
      </div>
    );
  }, [nodes, selectedNode, onSelectNode, onAddNode, onBranchNode, onDeleteNode, getNode]);

  // Find the root node (start)
  const rootNode = nodes.find(n => n.type === 'start');

  if (!rootNode) {
    return (
      <div className="structured-flow-canvas empty">
        <p>Kein Flow vorhanden</p>
      </div>
    );
  }

  return (
    <div 
      className="structured-flow-canvas" 
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div 
        className="flow-transform-layer"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
        }}
      >
        <div className="flow-tree" ref={treeRef}>
          {renderNode(rootNode.id)}
        </div>
      </div>

      <div className="canvas-controls">
        <button className="control-btn" onClick={handleZoomIn}><Plus size={20} /></button>
        <button className="control-btn" onClick={handleZoomOut}><Minus size={20} /></button>
        <button className="control-btn" onClick={handleReset}><Maximize size={20} /></button>
      </div>
    </div>
  );
};

export default StructuredFlowCanvas;
