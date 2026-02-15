const ConsentsSection = () => (
  <div className="section-content consent-section">
    <div className="consent-item">
      <label className="checkbox-label">
        <input type="checkbox" defaultChecked disabled readOnly />
        <span>Marketing</span>
      </label>
    </div>
    <div className="consent-item">
      <label className="checkbox-label">
        <input type="checkbox" defaultChecked disabled readOnly />
        <span>Datenschutz</span>
      </label>
    </div>
  </div>
);

export default ConsentsSection;
