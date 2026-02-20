import {
  GitBranch,
  Trash2,
  PlayCircle,
  ListChecks,
  CheckSquare,
  Sliders,
  Type,
  ChevronDown,
  FileText,
  Image,
  Video,
  User,
  MapPin,
  Calendar,
  Target,
  Hand,
  CheckCircle,
  Box,
  HelpCircle
} from 'lucide-react';

// Enhanced node configuration with input type awareness
const nodeConfig = {
  start: {
    icon: PlayCircle,
    color: 'var(--swk-red)',
    bgColor: 'bg-red-50',
    label: 'Start',
    badge: 'Start'
  },
  question: {
    icon: HelpCircle,
    color: 'var(--swk-blue)',
    bgColor: 'bg-blue-50',
    label: 'Frage',
    badge: 'Frage'
  },
  content: {
    icon: FileText,
    color: 'var(--success)',
    bgColor: 'bg-green-50',
    label: 'Inhalt',
    badge: 'Inhalt'
  },
  form: {
    icon: User,
    color: 'var(--warning)',
    bgColor: 'bg-amber-50',
    label: 'Formular',
    badge: 'Formular'
  },
  logic: {
    icon: GitBranch,
    color: 'var(--purple-600)',
    bgColor: 'bg-purple-50',
    label: 'Logik',
    badge: 'Logik'
  },
  screen: {
    icon: Hand,
    color: 'var(--slate-600)',
    bgColor: 'bg-slate-100',
    label: 'Screen',
    badge: 'Screen'
  },
  module: {
    icon: Box,
    color: 'var(--slate-500)',
    bgColor: 'bg-slate-100',
    label: 'Modul',
    badge: 'Modul'
  }
};

// Input type specific icons
const inputTypeIcons = {
  'Single-Choice': ListChecks,
  'Multi-Choice': CheckSquare,
  'Range-Slider': Sliders,
  'Eingabe': Type,
  'Dropdown': ChevronDown
};

// Content type specific icons
const contentTypeIcons = {
  'info-card': FileText,
  'image': Image,
  'video': Video
};

// Form type specific icons
const formTypeIcons = {
  'contact-form': User,
  'address-form': MapPin,
  'appointment': Calendar
};

// Screen type specific icons
const screenTypeIcons = {
  'welcome': Hand,
  'thank-you': CheckCircle
};

// Logic type specific icons
const logicTypeIcons = {
  'branch': GitBranch,
  'score-gate': Target
};

const FlowNode = ({
  node,
  isSelected = false,
  onClick,
  onBranch,
  onDelete,
  showBranchButton = true,
  showDeleteButton = true,
  cardData = null // Optional card data for showing preview
}) => {
  const config = nodeConfig[node.type] || nodeConfig.module;

  // Determine the correct icon based on node type and subtype
  const getNodeIcon = () => {
    if (node.type === 'question' && cardData?.inputType) {
      return inputTypeIcons[cardData.inputType] || config.icon;
    }
    if (node.type === 'content' && node.subType) {
      return contentTypeIcons[node.subType] || config.icon;
    }
    if (node.type === 'form' && node.subType) {
      return formTypeIcons[node.subType] || config.icon;
    }
    if (node.type === 'screen' && node.subType) {
      return screenTypeIcons[node.subType] || config.icon;
    }
    if (node.type === 'logic' && node.subType) {
      return logicTypeIcons[node.subType] || config.icon;
    }
    return config.icon;
  };

  const Icon = getNodeIcon();
  const canBranch = node.type === 'question' && node.children.length < 3;
  const canDelete = node.type !== 'start';

  // Generate meta info for the node
  const getMetaInfo = () => {
    if (node.type === 'start') return null;

    const parts = [];

    if (node.type === 'question' && cardData) {
      // Show input type
      parts.push(cardData.inputType);
      // Show answer count
      if (cardData.answers?.length > 0) {
        parts.push(`${cardData.answers.length} Antworten`);
      }
      // Show score info if applicable
      if (node.scoreWeight) {
        parts.push(`+${node.scoreWeight} Score`);
      }
    }

    if (node.type === 'form') {
      const formLabels = {
        'contact-form': 'Name, E-Mail, Tel',
        'address-form': 'PLZ, Ort, Straße',
        'appointment': 'Datum & Uhrzeit'
      };
      parts.push(formLabels[node.subType] || '');
    }

    return parts.filter(Boolean).join(' • ');
  };

  // Get badge text
  const getBadge = () => {
    if (node.type === 'question' && cardData?.inputType) {
      return cardData.inputType;
    }
    return config.badge;
  };

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

  const metaInfo = getMetaInfo();
  const nodeStyle = { '--node-color': config.color, '--node-color-soft': `${config.color}15` };

  return (
    <div
      className={`structured-node ${node.type}-node ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={nodeStyle}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(node);
        }
      }}
    >
      {/* Type Badge */}
      <div className="node-badge">
        {getBadge()}
      </div>

      {/* Main Content */}
      <div className="node-body">
        <div className="node-icon-wrapper">
          <Icon size={20} className="node-icon" />
        </div>

        <div className="node-content-wrapper">
          <div className="node-main-label">{node.label}</div>
          {metaInfo && (
            <div className="node-meta">{metaInfo}</div>
          )}
        </div>
      </div>

      {/* Action Buttons (visible on hover) */}
      <div className="node-actions-overlay">
        {showBranchButton && canBranch && (
          <button
            className="node-action-btn branch"
            onClick={handleBranch}
            title="Verzweigung hinzufügen"
            aria-label="Verzweigung hinzufügen"
          >
            <GitBranch size={14} />
          </button>
        )}
        {showDeleteButton && canDelete && (
          <button
            className="node-action-btn delete"
            onClick={handleDelete}
            title="Löschen"
            aria-label="Node löschen"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export { nodeConfig, inputTypeIcons };
export default FlowNode;
