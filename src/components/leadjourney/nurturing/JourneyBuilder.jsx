import { useState, useRef, useCallback } from 'react';
import {
  X,
  Save,
  Play,
  Pause,
  Plus,
  Trash2,
  Clock,
  Mail,
  CheckCircle,
  MessageSquare,
  Tag,
  User,
  FileText,
  TrendingUp,
  RefreshCw,
  GitBranch,
  ArrowRight
} from 'lucide-react';
import { mockData } from '../../../data/mockData';

const JourneyBuilder = ({ journey, showToast, onClose }) => {
  const [nodes, setNodes] = useState(journey?.nodes || []);
  const [connections, setConnections] = useState(journey?.connections || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const triggers = mockData.triggers || [];
  const actions = mockData.actions || [];
  const emailTemplates = mockData.emailTemplates || [];

  const getNodeIcon = (type, config) => {
    if (type === 'trigger') {
      switch (config?.event) {
        case 'form_submitted': return <FileText size={16} />;
        case 'score_threshold': return <TrendingUp size={16} />;
        case 'status_changed': return <RefreshCw size={16} />;
        default: return <Play size={16} />;
      }
    }
    if (type === 'action') {
      switch (config?.action) {
        case 'wait': return <Clock size={16} />;
        case 'send_email': return <Mail size={16} />;
        case 'update_status': return <CheckCircle size={16} />;
        case 'add_note': return <MessageSquare size={16} />;
        case 'add_tag': return <Tag size={16} />;
        case 'assign_rep': return <User size={16} />;
        default: return <Play size={16} />;
      }
    }
    if (type === 'condition') {
      return <GitBranch size={16} />;
    }
    return <Play size={16} />;
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'trigger': return '#3b82f6';
      case 'action': return '#e2001a';
      case 'condition': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleMouseDown = (e, node) => {
    if (e.target.closest('.node-delete')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingNode(node.id);
    setSelectedNode(node);
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggingNode || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    setNodes(prev => prev.map(n =>
      n.id === draggingNode
        ? { ...n, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
        : n
    ));
  }, [draggingNode, dragOffset]);

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const addNode = (type) => {
    const newId = `n${nodes.length + 1}`;
    const newNode = {
      id: newId,
      type,
      label: type === 'trigger' ? 'Neuer Trigger' : type === 'action' ? 'Neue Aktion' : 'Neue Bedingung',
      config: type === 'action' ? { action: 'wait', days: 1 } : type === 'trigger' ? { event: 'form_submitted' } : { field: 'score', operator: '>', value: 50 },
      position: { x: 200, y: nodes.length * 120 + 50 }
    };
    setNodes(prev => [...prev, newNode]);
    showToast(`${type === 'trigger' ? 'Trigger' : type === 'action' ? 'Aktion' : 'Bedingung'} hinzugefügt`, 'success');
  };

  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
    showToast('Knoten gelöscht', 'info');
  };

  const saveJourney = () => {
    showToast('Journey gespeichert', 'success');
  };

  // Calculate connection paths
  const getConnectionPath = (fromNode, toNode) => {
    if (!fromNode || !toNode) return '';
    const fromX = fromNode.position.x + 100;
    const fromY = fromNode.position.y + 40;
    const toX = toNode.position.x + 100;
    const toY = toNode.position.y;
    const midY = (fromY + toY) / 2;
    return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  };

  return (
    <div className="journey-builder">
      <div className="builder-header">
        <div className="builder-title">
          <h3>{journey?.name || 'Neue Journey'}</h3>
          <span className="builder-subtitle">{journey?.description}</span>
        </div>
        <div className="builder-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            <X size={16} />
            Schließen
          </button>
          <button className="btn btn-primary" onClick={saveJourney}>
            <Save size={16} />
            Speichern
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Node Palette */}
        <div className="node-palette">
          <h4>Elemente</h4>
          <div className="palette-section">
            <span className="palette-label">Trigger</span>
            <button className="palette-item trigger" onClick={() => addNode('trigger')}>
              <Play size={14} />
              <span>Trigger hinzufügen</span>
            </button>
          </div>
          <div className="palette-section">
            <span className="palette-label">Aktionen</span>
            <button className="palette-item action" onClick={() => addNode('action')}>
              <Mail size={14} />
              <span>Aktion hinzufügen</span>
            </button>
          </div>
          <div className="palette-section">
            <span className="palette-label">Bedingungen</span>
            <button className="palette-item condition" onClick={() => addNode('condition')}>
              <GitBranch size={14} />
              <span>Bedingung hinzufügen</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="journey-canvas"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Connection Lines */}
          <svg className="connections-layer" width="100%" height="100%">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
              </marker>
            </defs>
            {connections.map((conn, index) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              return (
                <g key={index}>
                  <path
                    d={getConnectionPath(fromNode, toNode)}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  {conn.label && fromNode && toNode && (
                    <text
                      x={(fromNode.position.x + toNode.position.x) / 2 + 100}
                      y={(fromNode.position.y + toNode.position.y) / 2 + 20}
                      fill="var(--text-secondary)"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`journey-node ${node.type} ${selectedNode?.id === node.id ? 'selected' : ''}`}
              style={{
                left: node.position.x,
                top: node.position.y,
                '--node-color': getNodeColor(node.type)
              }}
              onMouseDown={(e) => handleMouseDown(e, node)}
            >
              <div className="node-header">
                <div className="node-icon">
                  {getNodeIcon(node.type, node.config)}
                </div>
                <span className="node-type">
                  {node.type === 'trigger' ? 'Trigger' : node.type === 'action' ? 'Aktion' : 'Bedingung'}
                </span>
                <button
                  className="node-delete"
                  onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="node-content">
                <span className="node-label">{node.label}</span>
                {node.type === 'action' && node.config?.action === 'wait' && (
                  <span className="node-detail">{node.config.days} Tage warten</span>
                )}
                {node.type === 'action' && node.config?.action === 'send_email' && (
                  <span className="node-detail">
                    {emailTemplates.find(t => t.id === node.config.templateId)?.name || 'E-Mail'}
                  </span>
                )}
                {node.type === 'condition' && (
                  <span className="node-detail">
                    {node.config?.field} {node.config?.operator} {node.config?.value}
                  </span>
                )}
              </div>
            </div>
          ))}

          {nodes.length === 0 && (
            <div className="canvas-empty">
              <GitBranch size={48} />
              <p>Ziehen Sie Elemente aus der Palette hierher</p>
            </div>
          )}
        </div>

        {/* Node Config Panel */}
        {selectedNode && (
          <div className="node-config-panel">
            <h4>Konfiguration</h4>
            <div className="config-form">
              <div className="form-group">
                <label>Label</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => setNodes(prev => prev.map(n =>
                    n.id === selectedNode.id ? { ...n, label: e.target.value } : n
                  ))}
                />
              </div>

              {selectedNode.type === 'trigger' && (
                <div className="form-group">
                  <label>Auslöser</label>
                  <select
                    value={selectedNode.config?.event || ''}
                    onChange={(e) => setNodes(prev => prev.map(n =>
                      n.id === selectedNode.id ? { ...n, config: { ...n.config, event: e.target.value } } : n
                    ))}
                  >
                    {triggers.map(t => (
                      <option key={t.id} value={t.type}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedNode.type === 'action' && (
                <>
                  <div className="form-group">
                    <label>Aktion</label>
                    <select
                      value={selectedNode.config?.action || ''}
                      onChange={(e) => setNodes(prev => prev.map(n =>
                        n.id === selectedNode.id ? { ...n, config: { ...n.config, action: e.target.value } } : n
                      ))}
                    >
                      {actions.map(a => (
                        <option key={a.id} value={a.type}>{a.label}</option>
                      ))}
                    </select>
                  </div>

                  {selectedNode.config?.action === 'wait' && (
                    <div className="form-group">
                      <label>Wartezeit (Tage)</label>
                      <input
                        type="number"
                        min="1"
                        value={selectedNode.config?.days || 1}
                        onChange={(e) => setNodes(prev => prev.map(n =>
                          n.id === selectedNode.id ? { ...n, config: { ...n.config, days: parseInt(e.target.value) } } : n
                        ))}
                      />
                    </div>
                  )}

                  {selectedNode.config?.action === 'send_email' && (
                    <div className="form-group">
                      <label>E-Mail-Template</label>
                      <select
                        value={selectedNode.config?.templateId || ''}
                        onChange={(e) => setNodes(prev => prev.map(n =>
                          n.id === selectedNode.id ? { ...n, config: { ...n.config, templateId: e.target.value } } : n
                        ))}
                      >
                        <option value="">Template wählen...</option>
                        {emailTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {selectedNode.type === 'condition' && (
                <>
                  <div className="form-group">
                    <label>Feld</label>
                    <select
                      value={selectedNode.config?.field || 'score'}
                      onChange={(e) => setNodes(prev => prev.map(n =>
                        n.id === selectedNode.id ? { ...n, config: { ...n.config, field: e.target.value } } : n
                      ))}
                    >
                      <option value="score">Lead-Score</option>
                      <option value="product">Produkt</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Operator</label>
                    <select
                      value={selectedNode.config?.operator || '>'}
                      onChange={(e) => setNodes(prev => prev.map(n =>
                        n.id === selectedNode.id ? { ...n, config: { ...n.config, operator: e.target.value } } : n
                      ))}
                    >
                      <option value=">">größer als</option>
                      <option value="<">kleiner als</option>
                      <option value="=">gleich</option>
                      <option value="!=">ungleich</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Wert</label>
                    <input
                      type="text"
                      value={selectedNode.config?.value || ''}
                      onChange={(e) => setNodes(prev => prev.map(n =>
                        n.id === selectedNode.id ? { ...n, config: { ...n.config, value: e.target.value } } : n
                      ))}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyBuilder;
