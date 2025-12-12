import { useState } from 'react';
import {
  Copy,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

const UTMGeneratorTab = ({ showToast }) => {
  const [formData, setFormData] = useState({
    baseUrl: '',
    source: '',
    kampagne: '',
  });

  const [utmLinks, setUtmLinks] = useState([
    { id: 1, status: 'aktiv', kanal: 'Google Ads', bezeichnung: 'Solar Kampagne Q1', kampagne: 'solar-spring-2025' },
    { id: 2, status: 'aktiv', kanal: 'Facebook', bezeichnung: 'Wärmepumpe Retargeting', kampagne: 'waerme-retarget' },
    { id: 3, status: 'pausiert', kanal: 'Email', bezeichnung: 'Newsletter März', kampagne: 'newsletter-march' },
    { id: 4, status: 'aktiv', kanal: 'LinkedIn', bezeichnung: 'B2B Solar', kampagne: 'b2b-solar' }
  ]);

  // Available sources
  const sources = ['Google', 'Facebook', 'Instagram', 'LinkedIn', 'Email', 'Direct', 'QR-Code', 'Referral'];

  // Generate UTM URL
  const generateUrl = () => {
    if (!formData.baseUrl) return '';

    const params = new URLSearchParams();
    if (formData.source) params.append('utm_source', formData.source.toLowerCase());
    if (formData.kampagne) params.append('utm_campaign', formData.kampagne);

    const queryString = params.toString();
    return queryString ? `${formData.baseUrl}?${queryString}` : formData.baseUrl;
  };

  const generatedUrl = generateUrl();

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      showToast('URL in Zwischenablage kopiert');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'aktiv' ? 'success' : 'warning';
  };

  return (
    <div className="utm-generator-tab">
      <h2 className="sr-only">UTM Link Generator</h2>
      <div className="utm-generator-grid">
        {/* UTM Generator Form */}
        <div className="card">
          <div className="card-header">
            <h3>UTM-Link-Generator</h3>
          </div>
          <div className="utm-form">
            <div className="form-group">
              <label htmlFor="utm-base-url">Basis-URL</label>
              <input
                id="utm-base-url"
                type="url"
                placeholder="https://www.stadtwerke-konstanz.de/..."
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="utm-source">Source</label>
              <select
                id="utm-source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="">Quelle auswählen...</option>
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="utm-campaign">Kampagne</label>
              <input
                id="utm-campaign"
                type="text"
                placeholder="z.B. solar-spring-2025"
                value={formData.kampagne}
                onChange={(e) => setFormData({ ...formData, kampagne: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="generated-url">Generierte URL</label>
              <div className="url-preview">
                <input
                  id="generated-url"
                  type="text"
                  value={generatedUrl}
                  readOnly
                  placeholder="URL wird hier angezeigt..."
                />
                <button
                  className="btn btn-secondary"
                  onClick={handleCopy}
                  disabled={!generatedUrl}
                  aria-label="Generierte URL kopieren"
                >
                  <Copy size={16} aria-hidden="true" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* UTM Links Table */}
        <div className="card">
          <div className="card-header">
            <h3>UTM-Links</h3>
            <button className="btn btn-primary btn-sm" aria-label="Neuen UTM-Link erstellen">
              <Plus size={16} aria-hidden="true" />
              Neuer Link
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Kanal</th>
                  <th>Bezeichnung</th>
                  <th>Kampagne</th>
                  <th>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {utmLinks.map((link) => (
                  <tr key={link.id}>
                    <td>{link.id}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(link.status)}`}>
                        {link.status}
                      </span>
                    </td>
                    <td>{link.kanal}</td>
                    <td>{link.bezeichnung}</td>
                    <td><code>{link.kampagne}</code></td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() => showToast(`Link ${link.id} kopiert`)}
                          aria-label={`Link ${link.id} kopieren`}
                        >
                          <Copy size={14} aria-hidden="true" />
                        </button>
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() => showToast(`Link ${link.id} öffnen`)}
                          aria-label={`Link ${link.id} öffnen`}
                        >
                          <ExternalLink size={14} aria-hidden="true" />
                        </button>
                        <button
                          className="btn btn-sm btn-link danger"
                          onClick={() => showToast(`Link ${link.id} löschen`)}
                          aria-label={`Link ${link.id} löschen`}
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
        </div>
      </div>
    </div>
  );
};

export default UTMGeneratorTab;
