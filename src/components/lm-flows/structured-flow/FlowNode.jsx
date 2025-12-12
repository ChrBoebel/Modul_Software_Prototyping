import { GitBranch, Trash2, PlayCircle, HelpCircle, Box, GitCommit } from 'lucide-react';

const nodeConfig = {
  start: {
    icon: PlayCircle,
    color: 'var(--swk-red)',
    label: 'Start'
  },
  question: {
    icon: HelpCircle,
    color: 'var(--swk-blue)',
    label: 'Frage'
  },
  module: {
    icon: Box,
    color: 'var(--slate-500)',
    label: 'Modul'
  },
  option: {
    icon: GitCommit,
    color: '#f59e0b',
    label: 'Option'
  }
};

const FlowNode = ({
  node,
  isSelected = false,
  onClick,
  onBranch,
  onDelete,
  showBranchButton = true,
  showDeleteButton = true
}) => {
  const config = nodeConfig[node.type] || nodeConfig.module;
  const Icon = config.icon;

  const canBranch = node.type === 'question' && node.children.length < 3;
  const canDelete = node.type !== 'start';

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(node);
  };

  const handleBranch = (e) => {
    e.stopPropagation();
    onBranch?.(node.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(node.id);
  };

  return (
    <div
      className={`structured-node ${node.type}-node ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{ '--node-color': config.color }}
    >
      <div className="node-icon-wrapper">
        <Icon size={18} />
      </div>

      <div className="node-content-wrapper">
        <div className="node-type-label">{config.label}</div>
        <div className="node-main-label">{node.label}</div>
        {node.cardId && (
          <div className="node-meta">{node.cardId}</div>
        )}
      </div>

      <div className="node-actions-overlay">
        {showBranchButton && canBranch && (
          <button
            className="node-action-icon branch"
            onClick={handleBranch}
            title="Verzweigung hinzufügen"
          >
            <GitBranch size={14} />
          </button>
        )}
        {showDeleteButton && canDelete && (
          <button
            className="node-action-icon delete"
            onClick={handleDelete}
            title="Löschen"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FlowNode;
