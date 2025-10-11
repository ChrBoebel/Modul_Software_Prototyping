import { Button } from '../ui/Button';
import { Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

export const FacilitiesTable = ({ facilities, onFacilityClick, onAddFacility }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'maintenance':
        return 'Wartung';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'maintenance':
        return Clock;
      case 'offline':
        return XCircle;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'maintenance':
        return '#FD951F'; // orange
      case 'offline':
        return '#ef4444'; // red
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Anlagen</span>
        <Button variant="primary" icon={Plus} onClick={onAddFacility}>
          Neue Anlage
        </Button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Typ</th>
              <th>Kapazität</th>
              <th>Output</th>
              <th>Effizienz</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility) => {
              const StatusIcon = getStatusIcon(facility.status);
              const statusColor = getStatusColor(facility.status);
              return (
                <tr
                  key={facility.id}
                  onClick={() => onFacilityClick(facility.name)}
                >
                  <td data-label="Name">{facility.name}</td>
                  <td data-label="Typ">{facility.type}</td>
                  <td data-label="Kapazität">{facility.capacity}</td>
                  <td data-label="Output">{facility.output}</td>
                  <td data-label="Effizienz">{facility.efficiency}</td>
                  <td data-label="Status">
                    <span className={`status ${facility.status}`} style={{ color: statusColor }}>
                      {StatusIcon && <StatusIcon size={14} />}
                      {getStatusText(facility.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
