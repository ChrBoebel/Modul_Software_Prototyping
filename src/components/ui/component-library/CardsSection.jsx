import { Plus } from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ComponentSection, ComponentShowcase } from './shared';

const CardsSection = () => (
  <ComponentSection
    title="Cards"
    description="Container-Komponenten für gruppierte Inhalte."
  >
    <ComponentShowcase
      title="Einfache Card"
      code={`<Card>
  <p>Card Inhalt hier...</p>
</Card>`}
    >
      <Card>
        <p>Dies ist eine einfache Card ohne Header.</p>
      </Card>
    </ComponentShowcase>

    <ComponentShowcase
      title="Card mit Header"
      code={`<Card headerTitle="Überschrift" headerActions={<Button size="sm">Action</Button>}>
  <p>Card Inhalt...</p>
</Card>`}
    >
      <Card
        headerTitle="Card Titel"
        headerActions={<Button variant="primary" size="sm" icon={Plus}>Hinzufügen</Button>}
      >
        <p>Dies ist eine Card mit Titel und Action-Button im Header.</p>
      </Card>
    </ComponentShowcase>
  </ComponentSection>
);

export default CardsSection;
