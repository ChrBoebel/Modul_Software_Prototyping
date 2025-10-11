import { AlertsList } from '../dashboard/AlertsList';
import { mockData } from '../../data/mockData';
import { AlertCircle, Activity, Clock } from 'lucide-react';

export const AlertsView = ({ onAlertClick }) => {
  return (
    <>
      <div className="alerts-header-card">
        <div className="alerts-header-content">
          <div className="alerts-header-icon">
            <AlertCircle size={28} />
          </div>
          <div>
            <h1 className="alerts-header-title">Alarm-Verwaltung</h1>
            <p className="alerts-header-subtitle">
              Alle aktiven Alarme und Benachrichtigungen im Überblick
            </p>
          </div>
        </div>
        <div className="alerts-header-stats">
          <div className="stat-inline">
            <Activity size={16} />
            <span>{mockData.alerts.length} Aktive</span>
          </div>
          <div className="stat-inline">
            <Clock size={16} />
            <span>Letzte 24h</span>
          </div>
        </div>
      </div>

      <AlertsList alerts={mockData.alerts} onAlertClick={onAlertClick} />
    </>
  );
};
