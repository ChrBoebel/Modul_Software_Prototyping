import { FacilitiesTable } from '../dashboard/FacilitiesTable';
import { mockData } from '../../data/mockData';
import { Factory, CheckCircle, Wrench, Zap } from 'lucide-react';

export const FacilitiesView = ({ onFacilityClick, onAddFacility }) => {
  return (
    <>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Anlagen-Verwaltung</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Übersicht und Verwaltung aller Energieanlagen
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="kpi">
          <div className="kpi-icon">
            <Factory size={20} />
          </div>
          <div className="kpi-label">Gesamt Anlagen</div>
          <div className="kpi-value">{mockData.facilities.length}</div>
        </div>
        <div className="kpi">
          <div className="kpi-icon">
            <CheckCircle size={20} />
          </div>
          <div className="kpi-label">Aktive Anlagen</div>
          <div className="kpi-value">
            {mockData.facilities.filter(f => f.status === 'active').length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon">
            <Wrench size={20} />
          </div>
          <div className="kpi-label">Wartung</div>
          <div className="kpi-value">
            {mockData.facilities.filter(f => f.status === 'maintenance').length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon">
            <Zap size={20} />
          </div>
          <div className="kpi-label">Gesamtkapazität</div>
          <div className="kpi-value" style={{ fontSize: '20px' }}>
            {mockData.facilities.reduce((sum, f) => sum + parseInt(f.capacity), 0)}
            <span className="kpi-unit">MW</span>
          </div>
        </div>
      </div>

      <FacilitiesTable
        facilities={mockData.facilities}
        onFacilityClick={onFacilityClick}
        onAddFacility={onAddFacility}
      />
    </>
  );
};
