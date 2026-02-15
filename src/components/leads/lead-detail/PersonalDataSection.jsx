const PersonalDataSection = ({ personalData }) => (
  <div className="section-content">
    <div className="data-grid">
      <div className="data-row">
        <span className="label">Name:</span>
        <span className="value">{personalData.name}</span>
      </div>
      <div className="data-row">
        <span className="label">Telefon:</span>
        <span className="value">{personalData.phone}</span>
      </div>
      <div className="data-row">
        <span className="label">E-Mail:</span>
        <span className="value">{personalData.email}</span>
      </div>
      <div className="data-row">
        <span className="label">Geburtsdatum:</span>
        <span className="value">{personalData.birthdate}</span>
      </div>
      <div className="data-row full-width">
        <span className="label">Adresse:</span>
        <span className="value">{personalData.address}</span>
      </div>
    </div>
  </div>
);

export default PersonalDataSection;
