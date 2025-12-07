import { useState } from 'react';
import {
  Eye,
  Download,
  Heart,
  CheckCircle,
  UserCheck,
  RefreshCw,
  UserCog,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';

const LEAD_MACHINE_PHASES = [
  {
    id: 'awareness',
    icon: Eye,
    label: 'Awareness',
    description: 'Traffic & Kampagnen',
    color: '#2358A1' // SWK Blue
  },
  {
    id: 'capture',
    icon: Download,
    label: 'Capture',
    description: 'Lead-Erfassung',
    color: '#3b82f6' // Blue 500
  },
  {
    id: 'nurturing',
    icon: Heart,
    label: 'Nurturing',
    description: 'E-Mail & Automation',
    color: '#E2001A' // SWK Red
  },
  {
    id: 'qualification',
    icon: CheckCircle,
    label: 'Qualification',
    description: 'Scoring & Pipeline',
    color: '#f59e0b' // Amber 500
  },
  {
    id: 'closing',
    icon: UserCheck,
    label: 'Closing',
    description: 'Vertrieb & CRM',
    color: '#10b981' // Emerald 500
  },
  {
    id: 'retention',
    icon: RefreshCw,
    label: 'Retention',
    description: 'Kundenbindung',
    color: '#64748b' // Slate 500
  }
];

export const Sidebar = ({ isOpen, onClose, activeView, onViewChange }) => {
  const [expandedSection, setExpandedSection] = useState('leadmachine');

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isPhaseActive = (phaseId) => activeView === phaseId;

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-area">
          <div className="logo-text">
            <img src="/stadtwerke-logo.svg" alt="Stadtwerke Konstanz" style={{ height: '32px', width: 'auto' }} />
          </div>
        </div>

        <nav className="nav-container">
          {/* Lead Machine Section */}
          <div className="nav-section">
            <div className="nav-label">
              Lead Machine
            </div>

            <div className="nav-section-items">
              {LEAD_MACHINE_PHASES.map((phase, index) => {
                const Icon = phase.icon;
                const isActive = isPhaseActive(phase.id);
                return (
                  <div
                    key={phase.id}
                    className={`phase-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(phase.id)}
                    style={{ '--phase-color': phase.color }}
                  >
                    <span className="phase-number">{index + 1}</span>
                    <div className="phase-content">
                      <span className="phase-title">{phase.label}</span>
                      <span className="phase-desc">{phase.description}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-muted" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Administration Section */}
          <div className="nav-section">
            <div className="nav-label">
              Administration
            </div>

            <div className="nav-section-items">
              <a
                className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
                onClick={() => handleNavClick('users')}
              >
                <UserCog size={18} />
                <span>Benutzer</span>
              </a>
              <a
                className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
                onClick={() => handleNavClick('settings')}
              >
                <Settings size={18} />
                <span>Einstellungen</span>
              </a>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div className="user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-avatar" style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600'
            }}>MM</div>
            <div className="user-info">
              <div className="user-name" style={{ fontSize: '14px', fontWeight: '600' }}>Max Müller</div>
              <div className="user-role" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
    </>
  );
};
