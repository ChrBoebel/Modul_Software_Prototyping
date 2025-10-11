import { Button } from '../ui/Button';
import { Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const InvoicesTable = ({ invoices, onInvoiceClick, onAddInvoice }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Bezahlt';
      case 'pending':
        return 'Offen';
      case 'overdue':
        return 'Überfällig';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
        return AlertTriangle;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#10b981'; // green
      case 'pending':
        return '#3b82f6'; // blue
      case 'overdue':
        return '#ef4444'; // red
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Rechnungen</span>
        <Button variant="primary" icon={Plus} onClick={onAddInvoice}>
          Neue Rechnung
        </Button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Rechnungsnr.</th>
              <th>Kunde</th>
              <th>Betrag</th>
              <th>Ausstellungsdatum</th>
              <th>Fälligkeitsdatum</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              const statusColor = getStatusColor(invoice.status);
              return (
                <tr
                  key={invoice.id}
                  onClick={() => onInvoiceClick(`Rechnung ${invoice.id}`)}
                >
                  <td data-label="Rechnungsnr.">#{invoice.id}</td>
                  <td data-label="Kunde">{invoice.customer}</td>
                  <td data-label="Betrag">{invoice.amount} €</td>
                  <td data-label="Ausstellungsdatum">{new Date(invoice.issueDate).toLocaleDateString('de-DE')}</td>
                  <td data-label="Fälligkeitsdatum">{new Date(invoice.dueDate).toLocaleDateString('de-DE')}</td>
                  <td data-label="Status">
                    <span className={`status ${invoice.status}`} style={{ color: statusColor }}>
                      {StatusIcon && <StatusIcon size={14} />}
                      {getStatusText(invoice.status)}
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
