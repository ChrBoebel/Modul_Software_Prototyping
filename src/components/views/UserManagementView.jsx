import { Users, UserPlus, Shield, Mail } from 'lucide-react';

export const UserManagementView = ({ showToast }) => {
  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-content">
          <h1>Benutzerverwaltung</h1>
          <p className="view-subtitle">Verwalten Sie Benutzer und Zugriffsrechte</p>
        </div>
      </div>

      <div className="placeholder-content">
        <Users size={48} strokeWidth={1.5} />
        <h2>Benutzerverwaltung</h2>
        <p>Diese Funktion ist in Entwicklung.</p>
      </div>
    </div>
  );
};

export default UserManagementView;
