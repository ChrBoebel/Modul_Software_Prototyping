export const EXAMPLE_FLOWS = {
  default: {
    flowData: {
      campaignName: 'Energie‑Beratung Einstieg',
      campaignDescription: 'Kurzer Qualifizierungs‑Flow für Solar, Wärmepumpe oder Stromtarif.',
      nodes: [
        {
          id: 'start',
          type: 'start',
          label: 'Energie‑Beratung Einstieg',
          children: ['q1']
        },
        {
          id: 'q1',
          type: 'question',
          label: 'Willkommen',
          cardId: 'Question_1',
          children: ['q2']
        },
        {
          id: 'q2',
          type: 'question',
          label: 'Wofür interessieren Sie sich?',
          cardId: 'Question_2',
          children: ['m-solar', 'm-waerme', 'm-strom']
        },
        {
          id: 'm-solar',
          type: 'module',
          label: 'Solar‑Pfad',
          children: ['q3']
        },
        {
          id: 'm-waerme',
          type: 'module',
          label: 'Wärmepumpen‑Pfad',
          children: ['q4']
        },
        {
          id: 'm-strom',
          type: 'module',
          label: 'Stromtarif‑Pfad',
          children: ['q5']
        },
        {
          id: 'q3',
          type: 'question',
          label: 'Dachfläche einschätzen',
          cardId: 'Question_3',
          children: ['q8']
        },
        {
          id: 'q8',
          type: 'question',
          label: 'Dachausrichtung',
          cardId: 'Question_8',
          children: ['q6']
        },
        {
          id: 'q4',
          type: 'question',
          label: 'Gebäudetyp',
          cardId: 'Question_4',
          children: ['q10']
        },
        {
          id: 'q10',
          type: 'question',
          label: 'Aktuelle Heizung',
          cardId: 'Question_9',
          children: ['q6']
        },
        {
          id: 'q5',
          type: 'question',
          label: 'Stromverbrauch',
          cardId: 'Question_5',
          children: ['q11']
        },
        {
          id: 'q11',
          type: 'question',
          label: 'Wechselzeitpunkt',
          cardId: 'Question_10',
          children: ['q6']
        },
        {
          id: 'q6',
          type: 'question',
          label: 'Kontaktaufnahme',
          cardId: 'Question_6',
          children: ['q7']
        },
        {
          id: 'q7',
          type: 'question',
          label: 'Kontakt‑Daten',
          cardId: 'Question_7',
          children: []
        }
      ]
    },
    cards: {
      Question_1: {
        title: 'Willkommen bei den Stadtwerken Konstanz',
        description: 'Damit wir Sie optimal beraten können, starten wir mit ein paar kurzen Fragen.',
        inputType: 'Single-Choice',
        answers: ['Los geht’s']
      },
      Question_2: {
        title: 'Wofür interessieren Sie sich?',
        description: 'Wählen Sie das Thema, zu dem Sie Informationen wünschen.',
        inputType: 'Single-Choice',
        answers: ['Photovoltaik / Solarstrom', 'Wärmepumpe / Heizung', 'Stromtarif wechseln']
      },
      Question_3: {
        title: 'Wie groß ist Ihre nutzbare Dachfläche?',
        description: 'Eine grobe Einschätzung reicht.',
        inputType: 'Single-Choice',
        answers: ['< 30 m²', '30–60 m²', '> 60 m²', 'Unsicher']
      },
      Question_8: {
        title: 'Wie ist Ihr Dach ausgerichtet?',
        description: 'Damit können wir die potenzielle Ausbeute besser einschätzen.',
        inputType: 'Single-Choice',
        answers: ['Süd', 'Ost/West', 'Nord', 'Unsicher']
      },
      Question_4: {
        title: 'Um welchen Gebäudetyp handelt es sich?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Einfamilienhaus', 'Mehrfamilienhaus', 'Gewerbe', 'Unsicher']
      },
      Question_9: {
        title: 'Welche Heizungsart nutzen Sie aktuell?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Gas', 'Öl', 'Fernwärme', 'Pellets', 'Elektro', 'Unsicher']
      },
      Question_5: {
        title: 'Wie hoch ist Ihr jährlicher Stromverbrauch?',
        description: '',
        inputType: 'Dropdown',
        answers: ['< 2.000 kWh', '2.000–3.500 kWh', '3.500–5.000 kWh', '> 5.000 kWh']
      },
      Question_10: {
        title: 'Wann möchten Sie wechseln?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Sofort', 'In 1–3 Monaten', 'Später / nur informieren']
      },
      Question_6: {
        title: 'Wie dürfen wir Sie kontaktieren?',
        description: 'So können wir Ihnen die passende Beratung anbieten.',
        inputType: 'Single-Choice',
        answers: ['Telefon', 'E‑Mail', 'Rückruftermin vereinbaren']
      },
      Question_7: {
        title: 'Kontakt‑Daten',
        description: 'Bitte geben Sie Ihre E‑Mail oder Telefonnummer an.',
        inputType: 'Eingabe',
        answers: []
      }
    }
  },

  'camp-001': {
    flowData: {
      campaignName: 'Stromtarif Wechsel',
      campaignDescription: 'Tarifwechsel‑Qualifizierung mit PLZ und Verbrauch.',
      nodes: [
        { id: 'start', type: 'start', label: 'Stromtarif Wechsel', children: ['q1'] },
        { id: 'q1', type: 'question', label: 'Start', cardId: 'Question_1', children: ['q2'] },
        { id: 'q2', type: 'question', label: 'Postleitzahl', cardId: 'Question_2', children: ['q3'] },
        { id: 'q3', type: 'question', label: 'Jahresverbrauch', cardId: 'Question_3', children: ['q3a'] },
        { id: 'q3a', type: 'question', label: 'Aktueller Anbieter', cardId: 'Question_7', children: ['q4'] },
        { id: 'q4', type: 'question', label: 'Kundenstatus', cardId: 'Question_4', children: ['m-bestand', 'm-neu'] },
        { id: 'm-bestand', type: 'module', label: 'Bestandskunde', children: ['q5'] },
        { id: 'm-neu', type: 'module', label: 'Neukunde', children: ['q5'] },
        { id: 'q5', type: 'question', label: 'Kontaktaufnahme', cardId: 'Question_5', children: ['q6'] },
        { id: 'q6', type: 'question', label: 'Kontakt‑Daten', cardId: 'Question_6', children: [] }
      ]
    },
    cards: {
      Question_1: {
        title: 'Stromtarif schnell prüfen',
        description: 'Mit drei Angaben finden wir den passenden Tarif.',
        inputType: 'Single-Choice',
        answers: ['Weiter']
      },
      Question_2: {
        title: 'Wie lautet Ihre Postleitzahl?',
        description: '',
        inputType: 'Eingabe',
        answers: []
      },
      Question_3: {
        title: 'Wie hoch ist Ihr Jahresverbrauch?',
        description: '1 = sehr niedrig, 10 = sehr hoch.',
        inputType: 'Range-Slider',
        answers: []
      },
      Question_7: {
        title: 'Wer ist Ihr aktueller Stromanbieter?',
        description: '',
        inputType: 'Dropdown',
        answers: ['EnBW', 'E.ON', 'Vattenfall', 'Stadtwerke', 'Sonstiger']
      },
      Question_4: {
        title: 'Sind Sie bereits Kunde bei uns?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Ja', 'Nein']
      },
      Question_5: {
        title: 'Wie möchten Sie beraten werden?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Telefon', 'E‑Mail']
      },
      Question_6: {
        title: 'Ihre Kontakt‑Daten',
        description: 'E‑Mail oder Telefonnummer',
        inputType: 'Eingabe',
        answers: []
      }
    }
  },

  'camp-002': {
    flowData: {
      campaignName: 'Solar‑Beratung',
      campaignDescription: 'Qualifizierungs‑Flow für Photovoltaik‑Interessenten.',
      nodes: [
        { id: 'start', type: 'start', label: 'Solar‑Beratung', children: ['q1'] },
        { id: 'q1', type: 'question', label: 'Willkommen', cardId: 'Question_1', children: ['q2'] },
        { id: 'q2', type: 'question', label: 'Eigenheim vorhanden?', cardId: 'Question_2', children: ['m-eigenheim', 'm-mietobjekt'] },
        { id: 'm-eigenheim', type: 'module', label: 'Eigenheim', children: ['q3'] },
        { id: 'm-mietobjekt', type: 'module', label: 'Mietobjekt', children: ['q4'] },
        { id: 'q3', type: 'question', label: 'Dachausrichtung', cardId: 'Question_3', children: ['q5'] },
        { id: 'q4', type: 'question', label: 'Mieterstrom Interesse', cardId: 'Question_4', children: ['q5'] },
        { id: 'q5', type: 'question', label: 'Verbrauch', cardId: 'Question_5', children: ['q5b'] },
        { id: 'q5b', type: 'question', label: 'Projektzeitraum', cardId: 'Question_7', children: ['q6'] },
        { id: 'q6', type: 'question', label: 'Kontakt‑Daten', cardId: 'Question_6', children: [] }
      ]
    },
    cards: {
      Question_1: {
        title: 'Solar‑Beratung starten',
        description: 'Wir klären kurz die Eckdaten für Ihr PV‑Projekt.',
        inputType: 'Single-Choice',
        answers: ['Start']
      },
      Question_2: {
        title: 'Besitzen Sie ein Eigenheim?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Ja', 'Nein']
      },
      Question_3: {
        title: 'Wie ist Ihr Dach ausgerichtet?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Süd', 'Ost/West', 'Nord', 'Unsicher']
      },
      Question_4: {
        title: 'Interessieren Sie sich für Mieterstrom?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Ja', 'Nein', 'Unsicher']
      },
      Question_5: {
        title: 'Wie hoch ist Ihr Stromverbrauch?',
        description: '',
        inputType: 'Dropdown',
        answers: ['< 2.000 kWh', '2.000–3.500 kWh', '3.500–5.000 kWh', '> 5.000 kWh']
      },
      Question_7: {
        title: 'Wann möchten Sie starten?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Sofort', 'In 3–6 Monaten', 'Nur informieren']
      },
      Question_6: {
        title: 'Ihre Kontakt‑Daten',
        description: 'E‑Mail oder Telefonnummer',
        inputType: 'Eingabe',
        answers: []
      }
    }
  },

  'camp-003': {
    flowData: {
      campaignName: 'Wärmepumpe‑Check',
      campaignDescription: 'Ersteinschätzung für Wärmepumpen‑Interessenten.',
      nodes: [
        { id: 'start', type: 'start', label: 'Wärmepumpe‑Check', children: ['q1'] },
        { id: 'q1', type: 'question', label: 'Einführung', cardId: 'Question_1', children: ['q2'] },
        { id: 'q2', type: 'question', label: 'Heizungsart', cardId: 'Question_2', children: ['q3'] },
        { id: 'q3', type: 'question', label: 'Baujahr', cardId: 'Question_3', children: ['q3a'] },
        { id: 'q3a', type: 'question', label: 'Wohnfläche', cardId: 'Question_6', children: ['q4'] },
        { id: 'q4', type: 'question', label: 'Fußbodenheizung', cardId: 'Question_4', children: ['q5'] },
        { id: 'q5', type: 'question', label: 'Kontakt‑Daten', cardId: 'Question_5', children: [] }
      ]
    },
    cards: {
      Question_1: {
        title: 'Wärmepumpe in 2 Minuten prüfen',
        description: 'Kurz ein paar Fragen zum Gebäude.',
        inputType: 'Single-Choice',
        answers: ['Weiter']
      },
      Question_2: {
        title: 'Welche Heizungsart nutzen Sie aktuell?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Gas', 'Öl', 'Fernwärme', 'Pellets', 'Sonstiges']
      },
      Question_3: {
        title: 'Wann wurde das Gebäude gebaut?',
        description: '',
        inputType: 'Dropdown',
        answers: ['vor 1980', '1980–2000', '2001–2015', 'ab 2016', 'Unsicher']
      },
      Question_6: {
        title: 'Wie groß ist Ihre beheizte Wohnfläche?',
        description: 'Eine ungefähre Angabe reicht.',
        inputType: 'Eingabe',
        answers: []
      },
      Question_4: {
        title: 'Ist eine Fußbodenheizung vorhanden?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Ja', 'Nein', 'Teilweise']
      },
      Question_5: {
        title: 'Ihre Kontakt‑Daten',
        description: 'E‑Mail oder Telefonnummer',
        inputType: 'Eingabe',
        answers: []
      }
    }
  },

  'camp-004': {
    flowData: {
      campaignName: 'E‑Mobilität Beratung',
      campaignDescription: 'Wallbox, Förderung oder Ladetarif – passend zum Bedarf.',
      nodes: [
        { id: 'start', type: 'start', label: 'E‑Mobilität Beratung', children: ['q1'] },
        { id: 'q1', type: 'question', label: 'Willkommen', cardId: 'Question_1', children: ['q2'] },
        { id: 'q2', type: 'question', label: 'Interesse', cardId: 'Question_2', children: ['m-wallbox', 'm-foerderung', 'm-tarif'] },
        { id: 'm-wallbox', type: 'module', label: 'Wallbox', children: ['q3'] },
        { id: 'm-foerderung', type: 'module', label: 'Förderung', children: ['q4'] },
        { id: 'm-tarif', type: 'module', label: 'Ladetarif', children: ['q5'] },
        { id: 'q3', type: 'question', label: 'Parkplatz‑Situation', cardId: 'Question_3', children: ['q6a'] },
        { id: 'q4', type: 'question', label: 'Fahrzeugtyp', cardId: 'Question_4', children: ['q6a'] },
        { id: 'q5', type: 'question', label: 'Ladehäufigkeit', cardId: 'Question_5', children: ['q6a'] },
        { id: 'q6a', type: 'question', label: 'Tagesstrecke', cardId: 'Question_6', children: ['q7'] },
        { id: 'q7', type: 'question', label: 'Kontakt‑Daten', cardId: 'Question_7', children: [] }
      ]
    },
    cards: {
      Question_1: {
        title: 'E‑Mobilität Beratung starten',
        description: 'Wir finden das passende Angebot für Sie.',
        inputType: 'Single-Choice',
        answers: ['Start']
      },
      Question_2: {
        title: 'Was interessiert Sie?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Wallbox installieren', 'Fördermöglichkeiten', 'Stromtarif fürs Laden']
      },
      Question_3: {
        title: 'Wo kann die Wallbox installiert werden?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['Garage', 'Carport', 'Außenstellplatz', 'Unsicher']
      },
      Question_4: {
        title: 'Welches Fahrzeug fahren Sie?',
        description: '',
        inputType: 'Dropdown',
        answers: ['E‑Auto', 'Plug‑in Hybrid', 'Geplant / noch kein Fahrzeug']
      },
      Question_5: {
        title: 'Wie häufig laden Sie pro Woche?',
        description: '1 = selten, 10 = täglich.',
        inputType: 'Range-Slider',
        answers: []
      },
      Question_6: {
        title: 'Wie weit fahren Sie typischerweise pro Tag?',
        description: '',
        inputType: 'Single-Choice',
        answers: ['unter 20 km', '20–50 km', '50–100 km', 'über 100 km']
      },
      Question_7: {
        title: 'Ihre Kontakt‑Daten',
        description: 'E‑Mail oder Telefonnummer',
        inputType: 'Eingabe',
        answers: []
      }
    }
  }
};

export const getExampleFlowForCampaign = (campaignId) => {
  return EXAMPLE_FLOWS[campaignId] || EXAMPLE_FLOWS.default;
};

export const DEFAULT_FLOW_DATA = EXAMPLE_FLOWS.default.flowData;
