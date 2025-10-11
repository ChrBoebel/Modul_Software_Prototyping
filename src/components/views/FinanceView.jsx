import { InvoicesTable } from '../dashboard/InvoicesTable';
import { mockData } from '../../data/mockData';
import { Euro, FileText, AlertTriangle, Calendar } from 'lucide-react';

export const FinanceView = ({ onInvoiceClick, onAddInvoice }) => {
  const totalRevenue = mockData.invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/,/g, '')), 0);

  const openInvoices = mockData.invoices.filter(inv => inv.status === 'pending').length;
  const overdueInvoices = mockData.invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Finanz-Übersicht</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Rechnungen, Zahlungen und Buchhaltung im Überblick
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <Euro size={18} />
            </div>
            <div className="kpi-label">Gesamtumsatz</div>
          </div>
          <div className="kpi-value">{(totalRevenue / 1000).toFixed(1)}<span className="kpi-unit">k €</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <FileText size={18} />
            </div>
            <div className="kpi-label">Offene Rechnungen</div>
          </div>
          <div className="kpi-value">{openInvoices}</div>
        </div>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <AlertTriangle size={18} />
            </div>
            <div className="kpi-label">Überfällige Rechnungen</div>
          </div>
          <div className="kpi-value">{overdueInvoices}</div>
        </div>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <Calendar size={18} />
            </div>
            <div className="kpi-label">Durchschn. Zahlungsziel</div>
          </div>
          <div className="kpi-value">28<span className="kpi-unit">Tage</span></div>
        </div>
      </div>

      <InvoicesTable
        invoices={mockData.invoices}
        onInvoiceClick={onInvoiceClick}
        onAddInvoice={onAddInvoice}
      />
    </>
  );
};
