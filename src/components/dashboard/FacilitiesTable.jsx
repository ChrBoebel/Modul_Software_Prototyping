import { Button } from '../ui/Button';

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

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Anlagen</span>
        <Button variant="primary" onClick={onAddFacility}>
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
            {facilities.map((facility) => (
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
                  <span className={`status ${facility.status}`}>
                    <span className="status-dot"></span>
                    {getStatusText(facility.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
