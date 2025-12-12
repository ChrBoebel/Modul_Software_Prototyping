import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

const GlobaleWerteTab = ({ showToast }) => {
  // Mock Lead-Score-Rules
  const scoreRules = [
    { id: 'rule-001', name: 'LEAD_XYZ1', description: 'Beschreibung der Regel für hohe Punktzahl', score: '+20' },
    { id: 'rule-002', name: 'LEAD_XYZ2', description: 'Beschreibung für mittlere Bewertung', score: '+10' },
    { id: 'rule-003', name: 'LEAD_XYZ3', description: 'Beschreibung für niedrige Bewertung', score: '+5' }
  ];

  // Mock Global Variables grouped by campaign
  const globalVariables = {
    'Kampagne Solar': [
      { id: 'var-001', variableId: 'solar_bonus', description: 'Bonus für Neukunden', wert: '500', einheit: 'EUR', zuletztAktualisiert: '2025-01-15' },
      { id: 'var-002', variableId: 'solar_kwp_min', description: 'Minimum kWp', wert: '5', einheit: 'kWp', zuletztAktualisiert: '2025-01-10' }
    ],
    'Kampagne Strom': [
      { id: 'var-003', variableId: 'strom_preis', description: 'Grundpreis pro kWh', wert: '0.32', einheit: 'EUR/kWh', zuletztAktualisiert: '2025-01-14' },
      { id: 'var-004', variableId: 'strom_bonus', description: 'Wechselbonus', wert: '100', einheit: 'EUR', zuletztAktualisiert: '2025-01-12' }
    ],
    'Kampagne Wärme': [
      { id: 'var-005', variableId: 'waerme_foerderung', description: 'Maximale Förderung', wert: '30', einheit: '%', zuletztAktualisiert: '2025-01-11' }
    ]
  };

  return (
    <div className="globale-werte-tab">
      <h2 className="sr-only">Globale Werte und Regeln</h2>
      {/* Lead-Score-Rules Section */}
      <div className="section">
        <div className="section-header">
          <h3>Lead-Score-Rule</h3>
          <button className="btn btn-primary btn-sm" aria-label="Neue Regel hinzufügen">
            <Plus size={14} aria-hidden="true" />
            Bearbeiten
          </button>
        </div>

        <div className="score-rules-grid">
          {scoreRules.map((rule) => (
            <div key={rule.id} className="score-rule-card">
              <div className="rule-header">
                <h4>{rule.name}</h4>
                <span className="score-value">{rule.score}</span>
              </div>
              <p className="rule-description">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Variables Section */}
      <div className="section">
        <div className="section-header">
          <h3>Globale Variable</h3>
        </div>

        {Object.entries(globalVariables).map(([kampagne, variables]) => (
          <div key={kampagne} className="variables-section">
            <h4 className="kampagne-header">{kampagne}</h4>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Variable ID</th>
                    <th>Beschreibung</th>
                    <th>Wert</th>
                    <th>Einheit</th>
                    <th>Zuletzt Aktualisiert</th>
                    <th>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable) => (
                    <tr key={variable.id}>
                      <td><code>{variable.variableId}</code></td>
                      <td>{variable.description}</td>
                      <td className="value-cell">{variable.wert}</td>
                      <td>{variable.einheit}</td>
                      <td>{variable.zuletztAktualisiert}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-link"
                            onClick={() => showToast(`Variable ${variable.variableId} bearbeiten`)}
                            aria-label={`Variable ${variable.variableId} bearbeiten`}
                          >
                            <Edit size={14} aria-hidden="true" />
                          </button>
                          <button
                            className="btn btn-sm btn-link danger"
                            onClick={() => showToast(`Variable ${variable.variableId} löschen`)}
                            aria-label={`Variable ${variable.variableId} löschen`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-secondary btn-sm add-variable">
              <Plus size={14} aria-hidden="true" />
              Variable hinzufügen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobaleWerteTab;
