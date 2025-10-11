import { CustomersTable } from '../dashboard/CustomersTable';
import { CustomerSegmentsDonut } from '../dashboard/CustomerSegmentsDonut';
import { mockData } from '../../data/mockData';
import { Users, FileCheck, UserPlus, Heart } from 'lucide-react';

export const CustomersView = ({ onCustomerClick, onAddCustomer }) => {
  return (
    <>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Kunden-Verwaltung</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Übersicht aller Kunden und Verträge
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <Users size={18} />
            </div>
            <div className="kpi-label">Gesamt Kunden</div>
          </div>
          <div className="kpi-value">1,247</div>
        </div>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <FileCheck size={18} />
            </div>
            <div className="kpi-label">Aktive Verträge</div>
          </div>
          <div className="kpi-value">1,189</div>
        </div>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <UserPlus size={18} />
            </div>
            <div className="kpi-label">Neue (30 Tage)</div>
          </div>
          <div className="kpi-value">43</div>
        </div>
        <div className="kpi">
          <div className="kpi-header">
            <div className="kpi-icon">
              <Heart size={18} />
            </div>
            <div className="kpi-label">Zufriedenheit</div>
          </div>
          <div className="kpi-value">94<span className="kpi-unit">%</span></div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <CustomerSegmentsDonut data={mockData.customerSegments} />
      </div>

      <CustomersTable
        customers={mockData.customers}
        onCustomerClick={onCustomerClick}
        onAddCustomer={onAddCustomer}
      />
    </>
  );
};
