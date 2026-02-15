import { Plus, Settings, Trash2, Download } from 'lucide-react';
import { Button } from '../Button';
import { ComponentSection, ComponentShowcase } from './shared';

const ButtonsSection = () => (
  <ComponentSection
    title="Buttons"
    description="Interaktive Schaltflächen in verschiedenen Varianten und Größen."
  >
    <ComponentShowcase
      title="Button Varianten"
      code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>`}
    >
      <div className="preview-row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Mit Icon"
      code={`<Button variant="primary" icon={Plus}>Hinzufügen</Button>
<Button variant="secondary" icon={Download}>Export</Button>
<Button variant="icon" icon={Settings} ariaLabel="Einstellungen" />`}
    >
      <div className="preview-row">
        <Button variant="primary" icon={Plus}>Hinzufügen</Button>
        <Button variant="secondary" icon={Download}>Export</Button>
        <Button variant="icon" icon={Settings} ariaLabel="Einstellungen" />
        <Button variant="icon" icon={Trash2} ariaLabel="Löschen" />
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Größen"
      code={`<Button variant="primary" size="sm">Klein</Button>
<Button variant="primary">Normal</Button>`}
    >
      <div className="preview-row">
        <Button variant="primary" size="sm">Klein</Button>
        <Button variant="primary">Normal</Button>
        <Button variant="secondary" size="sm">Klein</Button>
        <Button variant="secondary">Normal</Button>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Disabled"
      code={`<Button variant="primary" disabled>Disabled</Button>`}
    >
      <div className="preview-row">
        <Button variant="primary" disabled>Primary Disabled</Button>
        <Button variant="secondary" disabled>Secondary Disabled</Button>
      </div>
    </ComponentShowcase>
  </ComponentSection>
);

export default ButtonsSection;
