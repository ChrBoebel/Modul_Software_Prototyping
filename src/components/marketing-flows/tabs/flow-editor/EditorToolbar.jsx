import { Save, Play, X, Undo2, Redo2 } from 'lucide-react';

const EditorToolbar = ({
  campaignName,
  campaignDescription,
  onCampaignNameChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClose,
  onPreview,
  onSave
}) => {
  return (
    <div className="editor-header">
      <div className="editor-title">
        <input
          type="text"
          value={campaignName}
          onChange={(e) => onCampaignNameChange(e.target.value)}
          className="campaign-name-input"
          aria-label="Kampagnenname"
        />
        <span className="campaign-description">{campaignDescription || 'Beschreibung hinzufügen'}</span>
      </div>
      <div className="editor-actions">
        <button
          type="button"
          className="btn btn-icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Rückgängig (Ctrl+Z)"
          aria-label="Rückgängig"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          className="btn btn-icon"
          onClick={onRedo}
          disabled={!canRedo}
          title="Wiederholen (Ctrl+Shift+Z)"
          aria-label="Wiederholen"
        >
          <Redo2 size={16} />
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          <X size={16} />
          Schließen
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPreview}
        >
          <Play size={16} />
          Flow testen
        </button>
        <button type="button" className="btn btn-primary" onClick={onSave}>
          <Save size={16} />
          Speichern
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
