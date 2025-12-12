import { useState } from 'react';
import {
  X,
  Save,
  Play,
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
  Trash2,
  Plus
} from 'lucide-react';
import { mockData } from '../../../data/mockData';

// --- Icons & Colors ---
const getNodeIcon = (type, config) => {
    if (type === 'trigger') {
      switch (config?.event) {
        case 'form_submitted': return <FileText size={20} />;
        case 'score_threshold': return <TrendingUp size={20} />;
        case 'status_changed': return <RefreshCw size={20} />;
        default: return <Play size={20} />;
      }
    }
    if (type === 'action') {
      switch (config?.action) {
        case 'wait': return <Clock size={20} />;
        case 'send_email': return <Mail size={20} />;
        case 'update_status': return <CheckCircle size={20} />;
        case 'add_note': return <MessageSquare size={20} />;
        case 'add_tag': return <Tag size={20} />;
        case 'assign_rep': return <User size={20} />;
        default: return <Play size={20} />;
      }
    }
    if (type === 'condition') {
      return <GitBranch size={20} />;
    }
    return <Play size={20} />;
};

// --- Helper: Human Readable Labels ---
const getLabel = (type, value) => {
    const labels = {
        // Triggers
        'form_submitted': 'Formular abgesendet',
        'score_threshold': 'Score erreicht',
        'status_changed': 'Status geändert',
        // Actions
        'wait': 'Warten',
        'send_email': 'E-Mail senden',
        'update_status': 'Status setzen',
        'add_note': 'Notiz erstellen',
        'add_tag': 'Tag vergeben',
        'assign_rep': 'Vertrieb zuweisen',
        // Conditions
        'score': 'Score',
        'field': 'Feld'
    };
    return labels[value] || value;
};

const JourneyBuilder = ({ journey, showToast, onClose }) => {
  const emailTemplates = mockData.emailTemplates || [];
  const triggers = mockData.triggers || [];
  const actions = mockData.actions || [];

  const [steps, setSteps] = useState(() => {
    if (journey?.nodes && journey.nodes.length > 0) {
        return [...journey.nodes].sort((a, b) => a.position.y - b.position.y);
    }
    return [
        { 
            id: 'start', 
            type: 'trigger', 
            label: 'Start: Formular Eingang', 
            config: { event: 'form_submitted' } 
        }
    ];
  });
  
  const [selectedStep, setSelectedStep] = useState(null);
  const [addMenuIndex, setAddMenuIndex] = useState(null);

  const handleAddStep = (index, type) => {
    const newStep = {
        id: `step-${Date.now()}`,
        type: type,
        label: type === 'action' ? 'Neue Aktion' : 'Neue Verzweigung',
        config: type === 'action' ? { action: 'wait', days: 1 } : {}
    };

    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    setSteps(newSteps);
    setAddMenuIndex(null);
    setSelectedStep(newStep);
  };

  const handleRemoveStep = (e, index) => {
    e.stopPropagation();
    if (index === 0) {
        showToast('Start-Knoten kann nicht gelöscht werden', 'error');
        return;
    }
    const newSteps = [...steps];
    const removedStep = newSteps.splice(index, 1)[0];
    setSteps(newSteps);
    
    if (selectedStep?.id === removedStep.id) {
        setSelectedStep(null);
    }
  };

  const handleUpdateStep = (field, value) => {
    if (!selectedStep) return;
    
    const updatedStep = { ...selectedStep, [field]: value };
    setSelectedStep(updatedStep);
    
    setSteps(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
  };

  const handleUpdateConfig = (key, value) => {
      if (!selectedStep) return;

      const newConfig = { ...selectedStep.config, [key]: value };
      // Special handling for action change to reset defaults
      if (key === 'action') {
          if (value === 'wait' && !newConfig.days) newConfig.days = 1;
      }

      const updatedStep = { ...selectedStep, config: newConfig };
      setSelectedStep(updatedStep);
      setSteps(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
  };

  return (
    <div className="journey-builder" style={{ flexDirection: 'row', backgroundColor: 'var(--bg-app)' }} role="application" aria-label="Journey Builder Editor">
        
        {/* Main Content Area (Timeline) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
             {/* Header */}
            <div className="builder-header">
                <div className="builder-title">
                <h3>{journey?.name || 'Neue Kampagne'}</h3>
                <span className="builder-subtitle">Ablaufplan</span>
                </div>
                <div className="builder-actions">
                <button className="btn btn-secondary" onClick={onClose} aria-label="Editor schließen">
                    <X size={16} aria-hidden="true" />
                    Schließen
                </button>
                <button className="btn btn-primary" onClick={() => showToast('Gespeichert', 'success')} aria-label="Änderungen speichern">
                    <Save size={16} aria-hidden="true" />
                    Speichern
                </button>
                </div>
            </div>

            {/* Scrollable Timeline */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
                <div className="timeline-builder">
                    {steps.map((step, index) => (
                        <div key={step.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            
                            {/* The Node Card */}
                            <div 
                                className={`timeline-node ${step.type} ${selectedStep?.id === step.id ? 'selected' : ''}`}
                                onClick={() => setSelectedStep(step)}
                                role="button"
                                tabIndex="0"
                                aria-label={`${step.label} auswählen`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedStep(step);
                                    }
                                }}
                            >
                                <div className="node-icon-wrapper" aria-hidden="true">
                                    {getNodeIcon(step.type, step.config)}
                                </div>
                                <div className="node-text">
                                    <span className="node-title">{step.label}</span>
                                    <span className="node-subtitle">
                                        {step.type === 'trigger' ? 'Startet den Ablauf' : ''}
                                        {step.type === 'action' && step.config?.action && getLabel('action', step.config.action)}
                                        {step.config?.action === 'wait' && `: ${step.config.days} Tage`}
                                        {step.config?.action === 'send_email' && ` ("${emailTemplates.find(t => t.id === step.config.templateId)?.name || 'Vorlage wählen'}")`}
                                    </span>
                                </div>
                                {index !== 0 && (
                                    <button 
                                        className="node-remove" 
                                        onClick={(e) => handleRemoveStep(e, index)}
                                        aria-label={`Schritt ${step.label} entfernen`}
                                    >
                                        <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                )}
                            </div>

                            {/* Add Button (Between nodes) */}
                            <div className="add-step-wrapper">
                                <button 
                                    className="add-step-btn" 
                                    onClick={() => setAddMenuIndex(addMenuIndex === index ? null : index)}
                                    title="Schritt einfügen"
                                    aria-label="Neuen Schritt an dieser Position einfügen"
                                    aria-expanded={addMenuIndex === index}
                                >
                                    <Plus size={16} aria-hidden="true" />
                                </button>
                                
                                {addMenuIndex === index && (
                                    <div className="add-menu" role="menu">
                                        <div className="add-menu-item" onClick={() => handleAddStep(index, 'action')} role="menuitem" tabIndex="0">
                                            <Mail size={16} aria-hidden="true" />
                                            <span>Aktion hinzufügen</span>
                                        </div>
                                        <div className="add-menu-item" onClick={() => handleAddStep(index, 'condition')} role="menuitem" tabIndex="0">
                                            <GitBranch size={16} aria-hidden="true" />
                                            <span>Verzweigung einfügen</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                    
                    <div className="end-point" title="Ende der Journey" aria-hidden="true" />
                </div>
            </div>
        </div>

      {/* Config Panel (Right Sidebar) */}
      {selectedStep && (
            <div className="node-config-panel" style={{ position: 'relative', borderLeft: '1px solid var(--border-color)', height: '100%', boxShadow: 'none' }} role="complementary" aria-label="Schritt Konfiguration">
                <div className="flex justify-between items-center mb-4">
                    <h4>{selectedStep.type === 'trigger' ? 'Start-Ereignis' : 'Schritt bearbeiten'}</h4>
                    <button className="btn-link" onClick={() => setSelectedStep(null)} aria-label="Konfiguration schließen"><X size={16} aria-hidden="true" /></button>
                </div>
                
                <div className="form-group mb-4">
                    <label htmlFor="step-name-input" className="block text-sm font-medium mb-1">Name des Schritts</label>
                    <input 
                        id="step-name-input"
                        type="text" 
                        value={selectedStep.label}
                        onChange={(e) => handleUpdateStep('label', e.target.value)}
                        placeholder="z.B. Willkommens-Mail senden"
                    />
                </div>

                {/* Trigger Config */}
                {selectedStep.type === 'trigger' && (
                     <div className="form-group mb-4">
                        <label htmlFor="trigger-event-select" className="block text-sm font-medium mb-1">Start-Ereignis</label>
                        <select 
                            id="trigger-event-select"
                            value={selectedStep.config?.event || ''}
                            onChange={(e) => handleUpdateConfig('event', e.target.value)}
                        >
                            {triggers.map(t => <option key={t.id} value={t.type}>{t.label}</option>)}
                        </select>
                    </div>
                )}

                {/* Action Config */}
                {selectedStep.type === 'action' && (
                    <>
                    <div className="form-group mb-4">
                        <label htmlFor="action-type-select" className="block text-sm font-medium mb-1">Was soll passieren?</label>
                        <select 
                            id="action-type-select"
                            value={selectedStep.config?.action}
                            onChange={(e) => handleUpdateConfig('action', e.target.value)}
                        >
                            {actions.map(a => <option key={a.type} value={a.type}>{a.label}</option>)}
                        </select>
                    </div>
                    
                    {selectedStep.config?.action === 'wait' && (
                        <div className="form-group mb-4">
                            <label htmlFor="wait-days-input" className="block text-sm font-medium mb-1">Warten für (Tage)</label>
                            <input 
                                id="wait-days-input"
                                type="number" 
                                min="1"
                                value={selectedStep.config?.days || 1}
                                onChange={(e) => handleUpdateConfig('days', parseInt(e.target.value))}
                            />
                        </div>
                    )}

                    {selectedStep.config?.action === 'send_email' && (
                        <div className="form-group mb-4">
                            <label htmlFor="email-template-select" className="block text-sm font-medium mb-1">Welche E-Mail?</label>
                                <select 
                                id="email-template-select"
                                value={selectedStep.config?.templateId || ''}
                                onChange={(e) => handleUpdateConfig('templateId', e.target.value)}
                            >
                                <option value="">Bitte wählen...</option>
                                {emailTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    )}
                    </>
                )}
            </div>
        )}
    </div>
  );
};

export default JourneyBuilder;
