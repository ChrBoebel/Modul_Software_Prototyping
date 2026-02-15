import {
  HelpCircle,
  ListChecks,
  CheckSquare,
  Sliders,
  Type,
  ChevronDown,
  Package,
  FileText,
  Image,
  MessageSquare,
  FormInput,
  Layers
} from 'lucide-react';

export const INPUT_TYPES = ['Single-Choice', 'Multi-Choice', 'Range-Slider', 'Eingabe', 'Dropdown'];

// Component Library for the Editor
export const COMPONENT_CATEGORIES = [
  {
    id: 'questions',
    label: 'Fragen',
    icon: HelpCircle,
    components: [
      { id: 'single-choice', label: 'Single-Choice', icon: ListChecks, description: 'Eine Antwort auswählen' },
      { id: 'multi-choice', label: 'Multi-Choice', icon: CheckSquare, description: 'Mehrere Antworten möglich' },
      { id: 'range-slider', label: 'Range-Slider', icon: Sliders, description: 'Wert auf Skala wählen' },
      { id: 'text-input', label: 'Texteingabe', icon: Type, description: 'Freie Texteingabe' },
      { id: 'dropdown', label: 'Dropdown', icon: ChevronDown, description: 'Auswahl aus Liste' },
      { id: 'product-select', label: 'Produkt-Frage', icon: Package, description: 'Produkte aus Katalog' }
    ]
  },
  {
    id: 'content',
    label: 'Inhalte',
    icon: FileText,
    components: [
      { id: 'info-card', label: 'Info-Karte', icon: FileText, description: 'Informationstext anzeigen' },
      { id: 'image', label: 'Bild', icon: Image, description: 'Bild oder Grafik' },
      { id: 'video', label: 'Video', icon: MessageSquare, description: 'Video einbetten' }
    ]
  },
  {
    id: 'forms',
    label: 'Formulare',
    icon: FormInput,
    components: [
      { id: 'contact-form', label: 'Kontaktdaten', icon: FormInput, description: 'Name, E-Mail, Telefon' },
      { id: 'address-form', label: 'Adresseingabe', icon: FormInput, description: 'Straße, PLZ, Ort' }
    ]
  },
  {
    id: 'logic',
    label: 'Logik',
    icon: Layers,
    components: [
      { id: 'branch', label: 'Verzweigung', icon: Layers, description: 'Bedingte Weiterleitung' },
      { id: 'score-check', label: 'Score-Prüfung', icon: Layers, description: 'Nach Punktzahl verzweigen' }
    ]
  }
];

export const createDefaultCard = (title = 'Neue Frage') => ({
  title,
  description: '',
  inputType: 'Single-Choice',
  answers: ['Antwort 1', 'Antwort 2']
});
