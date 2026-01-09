import { useState } from 'react';
import {
  Download,
  RefreshCw
} from 'lucide-react';
import { Button, Badge, Select, StatusIndicator } from '../../ui';

const SyncProtokollTab = ({ showToast }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock sync logs data
  const syncLogs = [
    {
      id: 1,
      timestamp: '2025-01-16 14:30:22',
      dateId: '2025-01-16',
      event: 'LEAD_SYNC',
      method: 'POST',
      status: 'success',
      issue: '-',
      abstract: '15 Leads synchronisiert'
    },
    {
      id: 2,
      timestamp: '2025-01-16 12:15:08',
      dateId: '2025-01-16',
      event: 'CRM_UPDATE',
      method: 'PUT',
      status: 'success',
      issue: '-',
      abstract: 'Kontaktdaten aktualisiert'
    },
    {
      id: 3,
      timestamp: '2025-01-16 10:00:00',
      dateId: '2025-01-16',
      event: 'EMAIL_CAMPAIGN',
      method: 'POST',
      status: 'error',
      issue: 'API_TIMEOUT',
      abstract: 'Mailchimp Verbindung fehlgeschlagen'
    },
    {
      id: 4,
      timestamp: '2025-01-15 18:45:33',
      dateId: '2025-01-15',
      event: 'LEAD_EXPORT',
      method: 'GET',
      status: 'warning',
      issue: 'PARTIAL',
      abstract: '45/50 Leads exportiert'
    },
    {
      id: 5,
      timestamp: '2025-01-15 16:20:11',
      dateId: '2025-01-15',
      event: 'LEAD_SYNC',
      method: 'POST',
      status: 'success',
      issue: '-',
      abstract: '8 Leads synchronisiert'
    },
    {
      id: 6,
      timestamp: '2025-01-15 14:00:00',
      dateId: '2025-01-15',
      event: 'SYSTEM_BACKUP',
      method: 'POST',
      status: 'success',
      issue: '-',
      abstract: 'Tägliches Backup erstellt'
    },
    {
      id: 7,
      timestamp: '2025-01-15 08:30:45',
      dateId: '2025-01-15',
      event: 'CRM_SYNC',
      method: 'PUT',
      status: 'error',
      issue: 'AUTH_FAILED',
      abstract: 'Authentifizierung fehlgeschlagen'
    }
  ];

  const getStatusVariant = (status) => {
    const statusMap = {
      'success': 'success',
      'error': 'danger',
      'warning': 'warning'
    };
    return statusMap[status] || 'neutral';
  };

  const statusOptions = [
    { value: 'all', label: 'Alle Status' },
    { value: 'success', label: 'Erfolg' },
    { value: 'error', label: 'Fehler' },
    { value: 'warning', label: 'Warnung' }
  ];

  const filteredLogs = syncLogs.filter(log =>
    filterStatus === 'all' || log.status === filterStatus
  );

  return (
    <div className="sync-protokoll-tab">
      <h2 className="sr-only">Synchronisations Protokolle</h2>
      <div className="section">
        <div className="section-header">
          <h3>Sync-Protokoll</h3>
          <div className="header-actions">
            <Select
              id="log-status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusOptions}
              placeholder=""
            />
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={() => showToast('Logs exportiert')}
            >
              Export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => showToast('Logs aktualisiert')}
            >
              Aktualisieren
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table sync-table">
            <caption className="sr-only">Liste der Synchronisations-Ereignisse</caption>
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Date-ID</th>
                <th scope="col">Event</th>
                <th scope="col">Method</th>
                <th scope="col">Issue</th>
                <th scope="col">Abstract</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className={`status-${log.status}`}>
                  <td className="timestamp-cell">{log.timestamp}</td>
                  <td>{log.dateId}</td>
                  <td>
                    <div className="event-cell">
                      <StatusIndicator
                        status={getStatusVariant(log.status)}
                        type="icon"
                        size="sm"
                      />
                      <span>{log.event}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`method-badge ${log.method.toLowerCase()}`}>
                      {log.method}
                    </span>
                  </td>
                  <td>
                    <Badge variant={log.issue === '-' ? 'neutral' : 'warning'}>
                      {log.issue}
                    </Badge>
                  </td>
                  <td className="abstract-cell">{log.abstract}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SyncProtokollTab;
