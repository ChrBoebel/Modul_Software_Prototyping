import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from '../Input';
import { Select } from '../Select';
import { TextArea } from '../TextArea';
import { Toggle } from '../Toggle';
import { Checkbox } from '../Checkbox';
import { SearchBox } from '../SearchBox';
import { ComponentSection, ComponentShowcase } from './shared';

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

export default FormsSection;
