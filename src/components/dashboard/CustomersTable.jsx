import { Button } from '../ui/Button';

export const CustomersTable = ({ customers, onCustomerClick, onAddCustomer }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'pending':
        return 'Ausstehend';
      case 'cancelled':
        return 'Gekündigt';
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Kunden-Übersicht</span>
        <Button variant="primary" onClick={onAddCustomer}>
          Neuer Kunde
        </Button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Typ</th>
              <th>Verbrauch</th>
              <th>Tarif</th>
              <th>Vertragsbeginn</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onCustomerClick(customer.name)}
              >
                <td data-label="Name">{customer.name}</td>
                <td data-label="Typ">{customer.type}</td>
                <td data-label="Verbrauch">{customer.consumption} {customer.unit}</td>
                <td data-label="Tarif">{customer.tariff}</td>
                <td data-label="Vertragsbeginn">{new Date(customer.contractStart).toLocaleDateString('de-DE')}</td>
                <td data-label="Status">
                  <span className={`status ${customer.status}`}>
                    <span className="status-dot"></span>
                    {getStatusText(customer.status)}
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
