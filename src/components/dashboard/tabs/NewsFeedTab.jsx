import { useState } from 'react';
import { 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Megaphone,
  ArrowRight,
  User,
  Settings,
  Database,
  Calendar,
  Filter
} from 'lucide-react';
import { theme } from '../../../theme/colors';

const NewsFeedTab = ({ showToast }) => {
  const [filterType, setFilterType] = useState('all');

  // Extended Mock Data with dates for grouping
  const newsFeedItems = [
    { 
      id: 1, 
      date: 'Heute',
      timestamp: '10:23', 
      eventType: 'LEAD_NEW', 
      title: 'Neuer Lead eingegangen',
      message: 'Max Muster hat das Solar-Check Formular ausgefüllt.',
      details: 'Produkt: Solar PV • PLZ: 78462',
      action: 'Lead öffnen',
      meta: { user: 'System' }
    },
    { 
      id: 2, 
      date: 'Heute',
      timestamp: '09:45', 
      eventType: 'LEAD_QUALIFIED', 
      title: 'Lead qualifiziert',
      message: 'Anna Schmidt wurde erfolgreich als SQL (Sales Qualified Lead) markiert.',
      details: 'Score: 92 • Potenzial: Hoch',
      meta: { user: 'Lisa Weber' }
    },
    { 
      id: 3, 
      date: 'Heute',
      timestamp: '09:30', 
      eventType: 'SYSTEM_ALERT', 
      title: 'API Verbindung unterbrochen',
      message: 'Die Verbindung zum CRM System (SAP) konnte kurzzeitig nicht hergestellt werden.',
      details: 'Fehlercode: 503 • Dauer: 2 Min',
      meta: { user: 'System' }
    },
    { 
      id: 4, 
      date: 'Gestern',
      timestamp: '16:00', 
      eventType: 'CAMPAIGN_UPDATE', 
      title: 'Kampagne gestartet',
      message: 'Die Kampagne "Solar Frühling 2025" ist jetzt aktiv.',
      details: 'Zielgruppe: Eigenheimbesitzer • Budget: 5.000€',
      meta: { user: 'Max Mustermann' }
    },
    { 
      id: 5, 
      date: 'Gestern',
      timestamp: '14:45', 
      eventType: 'LEAD_REJECTED', 
      title: 'Lead abgelehnt',
      message: 'Peter Weber wurde abgelehnt. Grund: Außerhalb Versorgungsgebiet.',
      meta: { user: 'Thomas Klein' }
    },
    { 
      id: 6, 
      date: 'Gestern',
      timestamp: '11:30', 
      eventType: 'SYSTEM_SUCCESS', 
      title: 'Daten-Synchronisation',
      message: 'Der tägliche Sync mit dem Data-Warehouse wurde erfolgreich abgeschlossen.',
      details: '234 Datensätze aktualisiert',
      meta: { user: 'System' }
    },
    { 
      id: 7, 
      date: 'Diese Woche',
      timestamp: 'Mo, 14:00', 
      eventType: 'CAMPAIGN_UPDATE', 
      title: 'A/B Test gestartet',
      message: 'Neuer Test für Landingpage "Wärmepumpe" läuft.',
      details: 'Variante B: Neue Headline "Zukunftssicher heizen"',
      meta: { user: 'Marketing Team' }
    }
  ];

  const getIconConfig = (type) => {
    switch (type) {
      case 'LEAD_NEW': return { icon: Zap, bg: theme.colors.info, color: 'white' };
      case 'LEAD_QUALIFIED': return { icon: CheckCircle2, bg: theme.colors.success, color: 'white' };
      case 'LEAD_REJECTED': return { icon: XCircle, bg: theme.colors.danger, color: 'white' };
      case 'SYSTEM_ALERT': return { icon: AlertTriangle, bg: theme.colors.warning, color: 'white' };
      case 'SYSTEM_SUCCESS': return { icon: Database, bg: theme.colors.success, color: 'white' };
      case 'CAMPAIGN_UPDATE': return { icon: Megaphone, bg: theme.colors.primary, color: 'white' };
      default: return { icon: Zap, bg: theme.colors.slate400, color: 'white' };
    }
  };

  const filteredItems = newsFeedItems.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'lead') return item.eventType.startsWith('LEAD_');
    if (filterType === 'system') return item.eventType.startsWith('SYSTEM_');
    if (filterType === 'campaign') return item.eventType.startsWith('CAMPAIGN_');
    return true;
  });

  // Group by Date
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="news-feed-tab">
      <h2 className="sr-only">News Feed Übersicht</h2>
      
      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="feed-type-filter" className="flex items-center gap-2">
            <Filter size={14} aria-hidden="true"/>
            Typ filtern
          </label>
          <select
            id="feed-type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Alle Aktivitäten</option>
            <option value="lead">Leads & Sales</option>
            <option value="system">System & Technik</option>
            <option value="campaign">Kampagnen & Marketing</option>
          </select>
        </div>
        <div className="flex gap-2">
            <button
            className="btn btn-secondary"
            onClick={() => showToast('Einstellungen öffnen')}
            aria-label="Feed Einstellungen"
            >
            <Settings size={16} aria-hidden="true" />
            </button>
            <button
            className="btn btn-secondary"
            onClick={() => showToast('News-Feed aktualisiert')}
            >
            <RefreshCw size={16} aria-hidden="true" />
            Aktualisieren
            </button>
        </div>
      </div>

      {/* Modern Timeline Feed */}
      <div className="card">
        <div className="news-feed-list" style={{ paddingBottom: '2rem' }}>
          
          {Object.entries(groupedItems).map(([date, items]) => (
            <div key={date} className="timeline-group">
              {/* Date Header */}
              <div className="news-date-header">
                <h4>{date}</h4>
              </div>

              {/* Items */}
              {items.map((item) => {
                const { icon: Icon, bg, color } = getIconConfig(item.eventType);
                
                return (
                  <div key={item.id} className="news-item" role="article" aria-labelledby={`news-title-${item.id}`}>
                    <div 
                      className="news-icon-wrapper"
                      style={{ backgroundColor: bg, color: color }}
                      aria-hidden="true"
                    >
                      <Icon size={16} />
                    </div>
                    
                    <div className="news-content-card">
                      <div className="news-header">
                        <span id={`news-title-${item.id}`} className="news-message">{item.title}</span>
                        <time className="news-time" dateTime={item.timestamp}>{item.timestamp}</time>
                      </div>
                      
                      <div className="news-details">
                        {item.message}
                      </div>

                      {item.details && (
                        <div className="news-meta">
                            <span className="news-meta-item" style={{ background: 'var(--slate-100)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--slate-200)'}}>
                                {item.details}
                            </span>
                        </div>
                      )}

                      <div className="news-meta" style={{ justifyContent: 'space-between', marginTop: '0.75rem' }}>
                        <div className="news-meta-item">
                            <User size={12} aria-hidden="true"/>
                            <span>{item.meta.user}</span>
                        </div>
                        
                        {item.action && (
                            <button 
                                className="btn btn-sm btn-link" 
                                style={{ padding: 0, height: 'auto' }}
                                onClick={() => showToast(item.action)}
                                aria-label={item.action}
                            >
                                {item.action} <ArrowRight size={12} aria-hidden="true" />
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-muted">
                Keine Aktivitäten für den gewählten Filter gefunden.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default NewsFeedTab;