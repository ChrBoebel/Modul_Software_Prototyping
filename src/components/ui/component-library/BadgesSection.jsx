import { Badge } from '../Badge';
import { ComponentSection, ComponentShowcase } from './shared';

const BadgesSection = () => (
  <ComponentSection
    title="Badges"
    description="Status-Anzeigen und Labels für verschiedene Zustände."
  >
    <ComponentShowcase
      title="Status Badges"
      code={`<Badge variant="success">Aktiv</Badge>
<Badge variant="warning">Pausiert</Badge>
<Badge variant="danger">Fehler</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral">Neutral</Badge>`}
    >
      <div className="preview-row">
        <Badge variant="success">Aktiv</Badge>
        <Badge variant="warning">Pausiert</Badge>
        <Badge variant="danger">Fehler</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Score Badges"
      code={`<Badge type="score" scoreVariant="high">85</Badge>
<Badge type="score" scoreVariant="medium">65</Badge>
<Badge type="score" scoreVariant="low">35</Badge>`}
    >
      <div className="preview-row">
        <Badge type="score" scoreVariant="high">85</Badge>
        <Badge type="score" scoreVariant="medium">65</Badge>
        <Badge type="score" scoreVariant="low">35</Badge>
        <Badge type="score" scoreVariant="hot">HOT</Badge>
        <Badge type="score" scoreVariant="sql">SQL</Badge>
        <Badge type="score" scoreVariant="mql">MQL</Badge>
      </div>
    </ComponentShowcase>
  </ComponentSection>
);

export default BadgesSection;
