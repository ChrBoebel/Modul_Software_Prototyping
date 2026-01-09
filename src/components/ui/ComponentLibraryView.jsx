import { useState } from 'react';
import {
  Plus,
  Settings,
  Trash2,
  Download,
  Mail,
  Users,
  TrendingUp,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';

import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';
import { Tabs } from './Tabs';
import { DataTable } from './DataTable';
import { KPICard, KPIBar } from './KPICard';
import { Avatar } from './Avatar';
import { StatusIndicator } from './StatusIndicator';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
import { Toggle } from './Toggle';
import { Checkbox } from './Checkbox';
import { SearchBox } from './SearchBox';
import { ToggleGroup } from './ToggleGroup';
import { Modal } from './Modal';
import { Panel } from './Panel';

const SECTIONS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'cards', label: 'Cards' },
  { id: 'tables', label: 'Tables' },
  { id: 'kpis', label: 'KPI Cards' },
  { id: 'forms', label: 'Formulare' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'layout', label: 'Layout' }
];

const ComponentSection = ({ title, description, children }) => (
  <section className="component-section">
    <h2>{title}</h2>
    <p className="section-description">{description}</p>
    {children}
  </section>
);

const ComponentShowcase = ({ title, children, code }) => (
  <div className="component-showcase">
    <h3>{title}</h3>
    <div className="showcase-preview">
      {children}
    </div>
    <div className="showcase-code">
      <pre><code>{code}</code></pre>
    </div>
  </div>
);

// Section Components
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

const TablesSection = () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'E-Mail' },
    { key: 'status', header: 'Status', render: (val) => <Badge variant={val === 'Aktiv' ? 'success' : 'neutral'}>{val}</Badge> },
    { key: 'score', header: 'Score', align: 'right' }
  ];

  const data = [
    { id: 1, name: 'Max Mustermann', email: 'max@example.com', status: 'Aktiv', score: 85 },
    { id: 2, name: 'Erika Musterfrau', email: 'erika@example.com', status: 'Aktiv', score: 72 },
    { id: 3, name: 'Hans Schmidt', email: 'hans@example.com', status: 'Inaktiv', score: 45 }
  ];

  return (
    <ComponentSection
      title="Tables"
      description="Datentabellen mit anpassbaren Spalten und Renderern."
    >
      <ComponentShowcase
        title="DataTable"
        code={`<DataTable
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', render: (val) => <Badge>{val}</Badge> }
  ]}
  data={[{ name: 'Max', status: 'Aktiv' }]}
  onRowClick={(row) => console.log(row)}
/>`}
      >
        <DataTable columns={columns} data={data} />
      </ComponentShowcase>
    </ComponentSection>
  );
};

const KPIsSection = () => (
  <ComponentSection
    title="KPI Cards"
    description="Metriken und Kennzahlen übersichtlich darstellen."
  >
    <ComponentShowcase
      title="KPI Bar"
      code={`<KPIBar>
  <KPICard icon={Users} value="1.234" label="Besucher" variant="primary" />
  <KPICard icon={TrendingUp} value="89" label="Leads" variant="success" trend={{ direction: 'up', value: '+12%' }} />
</KPIBar>`}
    >
      <KPIBar>
        <KPICard icon={Users} value="1.234" label="Besucher" variant="primary" />
        <KPICard icon={TrendingUp} value="89" label="Leads" variant="success" trend={{ direction: 'up', value: '+12%' }} />
        <KPICard icon={Activity} value="45" label="Quali-Leads" variant="secondary" />
        <KPICard icon={BarChart3} value="3,2" label="Conversion" unit="%" variant="warning" />
      </KPIBar>
    </ComponentShowcase>

    <ComponentShowcase
      title="Einzelne KPI Card"
      code={`<KPICard
  icon={Zap}
  value="156"
  label="Aktive Kampagnen"
  variant="primary"
  trend={{ direction: 'up', value: '+5' }}
/>`}
    >
      <div className="preview-row">
        <KPICard icon={Zap} value="156" label="Aktive Kampagnen" variant="primary" trend={{ direction: 'up', value: '+5' }} />
      </div>
    </ComponentShowcase>
  </ComponentSection>
);

const FormsSection = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);
  const [checkValue, setCheckValue] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <ComponentSection
      title="Formulare"
      description="Eingabefelder und Formular-Komponenten."
    >
      <ComponentShowcase
        title="Input"
        code={`<Input label="Name" placeholder="Ihr Name..." />
<Input label="E-Mail" type="email" icon={Mail} />
<Input label="Mit Fehler" error="Pflichtfeld" />`}
      >
        <div className="preview-stack">
          <Input label="Name" placeholder="Ihr Name..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <Input label="E-Mail" type="email" icon={Mail} placeholder="email@example.com" />
          <Input label="Mit Fehler" error="Dies ist ein Pflichtfeld" value="" />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="Select"
        code={`<Select
  label="Kategorie"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
/>`}
      >
        <Select
          label="Kategorie"
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          options={[
            { value: 'strom', label: 'Strom' },
            { value: 'gas', label: 'Gas' },
            { value: 'wasser', label: 'Wasser' }
          ]}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="TextArea"
        code={`<TextArea label="Beschreibung" rows={3} />`}
      >
        <TextArea
          label="Beschreibung"
          placeholder="Ihre Nachricht..."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Toggle & Checkbox"
        code={`<Toggle label="Benachrichtigungen" checked={true} />
<Checkbox label="AGB akzeptieren" />`}
      >
        <div className="preview-stack">
          <Toggle label="Benachrichtigungen aktivieren" checked={toggleValue} onChange={setToggleValue} />
          <Checkbox label="Ich akzeptiere die AGB" checked={checkValue} onChange={setCheckValue} />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="SearchBox"
        code={`<SearchBox placeholder="Suchen..." />`}
      >
        <SearchBox
          placeholder="Leads suchen..."
          value={searchValue}
          onChange={setSearchValue}
        />
      </ComponentShowcase>
    </ComponentSection>
  );
};

const NavigationSection = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [toggleValue, setToggleValue] = useState('all');

  return (
    <ComponentSection
      title="Navigation"
      description="Tabs und Toggle-Gruppen für die Navigation."
    >
      <ComponentShowcase
        title="Tabs"
        code={`<Tabs
  tabs={[
    { id: 'tab1', label: 'Übersicht' },
    { id: 'tab2', label: 'Details' }
  ]}
  activeTab="tab1"
  onChange={(id) => setActiveTab(id)}
/>`}
      >
        <Tabs
          tabs={[
            { id: 'tab1', label: 'Übersicht' },
            { id: 'tab2', label: 'Details' },
            { id: 'tab3', label: 'Einstellungen' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="ToggleGroup"
        code={`<ToggleGroup
  options={[
    { value: 'all', label: 'Alle', count: 156 },
    { value: 'mine', label: 'Meine', count: 23 }
  ]}
  value="all"
  onChange={setValue}
/>`}
      >
        <ToggleGroup
          options={[
            { value: 'all', label: 'Alle Leads', count: 156 },
            { value: 'mine', label: 'Meine Leads', count: 23 }
          ]}
          value={toggleValue}
          onChange={setToggleValue}
        />
      </ComponentShowcase>
    </ComponentSection>
  );
};

const FeedbackSection = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <ComponentSection
      title="Feedback"
      description="Modals und Dialoge für Benutzer-Feedback."
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
    </ComponentSection>
  );
};

const LayoutSection = () => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <ComponentSection
      title="Layout"
      description="Panels, Avatare und Status-Indikatoren."
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
    </ComponentSection>
  );
};

// Main Component
const ComponentLibraryView = () => {
  const [activeSection, setActiveSection] = useState('buttons');

  const renderSection = () => {
    switch (activeSection) {
      case 'buttons':
        return <ButtonsSection />;
      case 'badges':
        return <BadgesSection />;
      case 'cards':
        return <CardsSection />;
      case 'tables':
        return <TablesSection />;
      case 'kpis':
        return <KPIsSection />;
      case 'forms':
        return <FormsSection />;
      case 'navigation':
        return <NavigationSection />;
      case 'feedback':
        return <FeedbackSection />;
      case 'layout':
        return <LayoutSection />;
      default:
        return <ButtonsSection />;
    }
  };

  return (
    <div className="component-library-view">
      <header className="library-header">
        <h1>Component Library</h1>
        <p className="library-subtitle">UI Komponenten für das Aalen Design System</p>
      </header>

      <Tabs
        tabs={SECTIONS}
        activeTab={activeSection}
        onChange={setActiveSection}
        ariaLabel="Komponenten-Kategorien"
      />

      <div className="library-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default ComponentLibraryView;
