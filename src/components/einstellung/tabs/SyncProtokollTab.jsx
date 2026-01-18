import { useState, useMemo } from 'react';
import {
  Download,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button, Badge, Select, StatusIndicator } from '../../ui';
import { theme } from '../../../theme/colors';

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

  // Calculate status summary for Pie Chart
  // Uses SWK brand colors: Blue (success), Slate (warning), Red (error)
  const statusSummary = useMemo(() => {
    const counts = syncLogs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: 'Erfolg', value: counts.success || 0, color: theme.colors.secondary },
      { name: 'Fehler', value: counts.error || 0, color: theme.colors.primary },
      { name: 'Warnung', value: counts.warning || 0, color: theme.colors.slate400 }
    ].filter(item => item.value > 0);
  }, [syncLogs]);

  // Calculate timeline data for Area Chart (by date)
  const timelineData = useMemo(() => {
    const byDate = syncLogs.reduce((acc, log) => {
      const date = log.dateId;
      if (!acc[date]) acc[date] = { date, success: 0, error: 0, warning: 0 };
      acc[date][log.status]++;
      return acc;
    }, {});
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [syncLogs]);

  const totalLogs = syncLogs.length;
  const successRate = totalLogs > 0
    ? Math.round((syncLogs.filter(l => l.status === 'success').length / totalLogs) * 100)
    : 0;

  return (
    <div className="sync-protokoll-tab">
      <h2 className="sr-only">Synchronisations Protokolle</h2>

      {/* Visualization Section */}
      <div className="section" style={{ marginBottom: '1.5rem' }}>
        <div className="section-header">
          <h3>Sync-Übersicht</h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px',
          gap: '1.5rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          border: '1px solid var(--slate-200)'
        }}>
          {/* Timeline Area Chart */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Sync-Aktivität nach Tag
            </h4>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-100)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                  tickFormatter={(d) => d.split('-').slice(1).join('.')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '0.75rem'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  stackId="1"
                  stroke={theme.colors.secondary}
                  fill={theme.colors.secondary}
                  fillOpacity={0.6}
                  name="Erfolg"
                />
                <Area
                  type="monotone"
                  dataKey="warning"
                  stackId="1"
                  stroke={theme.colors.slate400}
                  fill={theme.colors.slate400}
                  fillOpacity={0.6}
                  name="Warnung"
                />
                <Area
                  type="monotone"
                  dataKey="error"
                  stackId="1"
                  stroke={theme.colors.primary}
                  fill={theme.colors.primary}
                  fillOpacity={0.6}
                  name="Fehler"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Status-Verteilung
            </h4>
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusSummary}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={2}
                  >
                    {statusSummary.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <span style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: successRate >= 70 ? theme.colors.secondary : theme.colors.slate500
                }}>
                  {successRate}%
                </span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.5rem' }}>
              {statusSummary.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: item.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
