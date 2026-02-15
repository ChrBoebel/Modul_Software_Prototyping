import { useState } from 'react';
import { Info, Settings } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Avatar } from '../Avatar';
import { StatusIndicator } from '../StatusIndicator';
import { Panel } from '../Panel';
import { CollapsibleSection, CollapsibleCard } from '../CollapsibleSection';
import { ComponentSection, ComponentShowcase } from './shared';

const LayoutSection = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ section1: true, section2: false });

  return (
    <ComponentSection
      title="Layout"
      description="Panels, Avatare, Status-Indikatoren und aufklappbare Bereiche."
    >
      <ComponentShowcase
        title="Avatar"
        code={`<Avatar name="Max Mustermann" size="md" />
<Avatar name="Erika M." size="lg" variant="primary" />
<Avatar src="/image.jpg" size="sm" />`}
      >
        <div className="preview-row">
          <Avatar name="Max Mustermann" size="sm" />
          <Avatar name="Max Mustermann" size="md" />
          <Avatar name="Max Mustermann" size="lg" />
          <Avatar name="Erika Musterfrau" size="md" variant="primary" />
          <Avatar initials="AB" size="md" />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="StatusIndicator"
        code={`<StatusIndicator status="success" />
<StatusIndicator status="warning" type="icon" showLabel />
<StatusIndicator status="danger" showLabel label="Offline" />`}
      >
        <div className="preview-row">
          <StatusIndicator status="success" showLabel />
          <StatusIndicator status="warning" showLabel />
          <StatusIndicator status="danger" showLabel />
          <StatusIndicator status="info" type="icon" showLabel />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="Panel"
        code={`<Panel
  isOpen={show}
  onClose={() => setShow(false)}
  title="Details"
  position="right"
>
  <p>Panel Inhalt...</p>
</Panel>`}
      >
        <Button variant="secondary" onClick={() => setShowPanel(true)}>Panel öffnen</Button>
        <Panel
          isOpen={showPanel}
          onClose={() => setShowPanel(false)}
          title="Detail-Ansicht"
          width="350px"
        >
          <div className="preview-stack">
            <p>Dies ist ein Slide-in Panel von rechts.</p>
            <Input label="Name" placeholder="Eingabe..." />
            <Button variant="primary">Speichern</Button>
          </div>
        </Panel>
      </ComponentShowcase>

      <ComponentShowcase
        title="CollapsibleSection"
        code={`<CollapsibleSection
  id="details"
  icon={Info}
  title="Details"
  defaultExpanded={true}
>
  <p>Inhalt der Section...</p>
</CollapsibleSection>`}
      >
        <div className="preview-stack" style={{ maxWidth: '400px' }}>
          <CollapsibleSection
            id="section1"
            icon={Info}
            title="Persönliche Daten"
            defaultExpanded={expandedSections.section1}
          >
            <p>Max Mustermann<br />max@example.com<br />+49 123 456789</p>
          </CollapsibleSection>
          <CollapsibleSection
            id="section2"
            icon={Settings}
            title="Einstellungen"
            defaultExpanded={expandedSections.section2}
          >
            <p>Benachrichtigungen: Aktiv<br />Newsletter: Inaktiv</p>
          </CollapsibleSection>
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="CollapsibleCard"
        code={`<CollapsibleCard
  title="Karteninhalt"
  defaultExpanded={false}
>
  <p>Inhalt der Card...</p>
</CollapsibleCard>`}
      >
        <div style={{ maxWidth: '400px' }}>
          <CollapsibleCard title="Zusätzliche Informationen">
            <p>Dies ist eine aufklappbare Card mit weiteren Details zum Element.</p>
          </CollapsibleCard>
        </div>
      </ComponentShowcase>
    </ComponentSection>
  );
};

export default LayoutSection;
