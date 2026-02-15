import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Toast } from '../Toast';
import { UndoToast } from '../UndoToast';
import { Tooltip, TooltipButton } from '../Tooltip';
import { ComponentSection, ComponentShowcase } from './shared';

const FeedbackSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showUndoToast, setShowUndoToast] = useState(false);

  return (
    <ComponentSection
      title="Feedback"
      description="Modals, Toasts und Tooltips für Benutzer-Feedback."
    >
      <ComponentShowcase
        title="Modal"
        code={`<Modal
  isOpen={show}
  onClose={() => setShow(false)}
  title="Bestätigung"
  footer={<Button variant="primary">Speichern</Button>}
>
  <p>Modal Inhalt...</p>
</Modal>`}
      >
        <Button variant="primary" onClick={() => setShowModal(true)}>Modal öffnen</Button>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Beispiel Modal"
          subtitle="Dies ist ein Beispiel-Dialog"
          footer={
            <div className="preview-row">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
              <Button variant="primary" onClick={() => setShowModal(false)}>Speichern</Button>
            </div>
          }
        >
          <p>Dies ist der Inhalt des Modals. Hier können beliebige Komponenten platziert werden.</p>
        </Modal>
      </ComponentShowcase>

      <ComponentShowcase
        title="Toast"
        code={`<Toast show={true} message="Aktion erfolgreich!" />
<Toast show={true} message="Fehler aufgetreten" variant="error" />`}
      >
        <div className="preview-row">
          <Button variant="secondary" onClick={() => setShowToast(true)}>Toast anzeigen</Button>
        </div>
        <Toast show={showToast} message="Aktion erfolgreich ausgeführt!" onClose={() => setShowToast(false)} />
      </ComponentShowcase>

      <ComponentShowcase
        title="UndoToast"
        code={`<UndoToast
  show={true}
  message="Element gelöscht"
  onUndo={() => restoreItem()}
  onClose={() => setShow(false)}
  duration={8000}
/>`}
      >
        <div className="preview-row">
          <Button variant="danger" onClick={() => setShowUndoToast(true)}>Löschen (mit Undo)</Button>
        </div>
        <UndoToast
          show={showUndoToast}
          message="Element wurde gelöscht"
          onUndo={() => { setShowUndoToast(false); }}
          onClose={() => setShowUndoToast(false)}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Tooltip"
        code={`<Tooltip content="Hilfetext">
  <Button>Hover mich</Button>
</Tooltip>
<TooltipButton icon={Info} tooltip="Info Text" />`}
      >
        <div className="preview-row">
          <Tooltip content="Dies ist ein Hilfetext">
            <Button variant="secondary">Hover für Tooltip</Button>
          </Tooltip>
          <TooltipButton icon={Info} tooltip="Zusätzliche Informationen zum Element" />
        </div>
      </ComponentShowcase>
    </ComponentSection>
  );
};

export default FeedbackSection;
