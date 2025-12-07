import { Settings, Bell, Palette, Lock } from 'lucide-react';

export const SettingsView = ({ showToast }) => {
  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-content">
          <h1>Einstellungen</h1>
          <p className="view-subtitle">Konfigurieren Sie Ihre Systemeinstellungen</p>
        </div>
      </div>

      <div className="placeholder-content">
        <Settings size={48} strokeWidth={1.5} />
        <h2>Einstellungen</h2>
        <p>Diese Funktion ist in Entwicklung.</p>
      </div>
    </div>
  );
};

export default SettingsView;
