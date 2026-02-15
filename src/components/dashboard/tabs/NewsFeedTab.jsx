import { useState, useMemo } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Megaphone,
  ArrowRight,
  Settings,
  Database,
  Filter,
  UserPlus,
  TrendingUp,
  Package,
  MapPin,
  Layers
} from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Avatar } from '../../ui/Avatar';
import { theme } from '../../../theme/colors';
import leadsData from '../../../data/leads.json';
import defaultProducts from '../../../data/productCatalog.json';
import defaultRules from '../../../data/availabilityRules.json';
import defaultIntegrations from '../../../data/defaultIntegrations.json';
import { getProduktName } from '../../../utils/leadUtils';

// Format timestamp for display
const formatEventTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Gerade eben';
  if (diffHours < 24) return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return date.toLocaleDateString('de-DE', { weekday: 'short' });
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
};

// Group events by date for timeline display
const getDateGroup = (date) => {
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return 'Diese Woche';
  return 'Älter';
};

const NewsFeedTab = ({ showToast, onNavigate, flowLeads = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [integrations] = useLocalStorage('swk:integrations', defaultIntegrations);
  const [products] = useLocalStorage('swk:products', defaultProducts);
  const [rules] = useLocalStorage('swk:availability-rules', defaultRules);

  // Icon configuration for event types
  const getIconConfig = (type) => {
    switch (type) {
      case 'LEAD_NEW':
        return { icon: UserPlus, bg: theme.colors.info, color: 'white' };
      case 'LEAD_QUALIFIED':
        return { icon: CheckCircle2, bg: theme.colors.success, color: 'white' };
      case 'LEAD_CONVERTED':
        return { icon: TrendingUp, bg: theme.colors.secondary, color: 'white' };
      case 'LEAD_REJECTED':
        return { icon: XCircle, bg: theme.colors.danger, color: 'white' };
      case 'SYSTEM_ALERT':
        return { icon: AlertTriangle, bg: theme.colors.warning, color: 'white' };
      case 'SYSTEM_SUCCESS':
        return { icon: Database, bg: theme.colors.success, color: 'white' };
      case 'CAMPAIGN_UPDATE':
        return { icon: Megaphone, bg: theme.colors.primary, color: 'white' };
      case 'MAPPING_PRODUCT':
        return { icon: Package, bg: theme.colors.secondary, color: 'white' };
      case 'MAPPING_RULE':
        return { icon: Layers, bg: theme.colors.info, color: 'white' };
      case 'MAPPING_ADDRESS':
        return { icon: MapPin, bg: theme.colors.primary, color: 'white' };
      default:
        return { icon: UserPlus, bg: theme.colors.slate400, color: 'white' };
    }
  };

  // Generate feed events from real data
  const feedEvents = useMemo(() => {
    const events = [];
    const allLeads = [...flowLeads, ...leadsData.leads];

    // 1. Generate lead events
    allLeads.forEach(lead => {
      const customer = lead.customer || {};
      const isBusiness = customer.customerType === 'business';
      const displayName = isBusiness && customer.companyName
        ? customer.companyName
        : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unbekannt';

      const leadDate = new Date(lead.timestamp);

      // Lead creation event
      events.push({
        id: `lead-new-${lead.id}`,
        timestamp: leadDate,
        eventType: 'LEAD_NEW',
        title: 'Neuer Lead eingegangen',
        message: `${displayName} hat das Formular ausgefüllt.`,
        details: `Produkt: ${getProduktName(lead.interest?.type)} • Score: ${lead.qualification?.score || 0}`,
        leadId: lead.id,
        customer: {
          name: displayName,
          type: customer.customerType
        }
      });

      // Status-based events
      if (lead.status === 'qualified' || lead.status === 'converted') {
        events.push({
          id: `lead-qualified-${lead.id}`,
          timestamp: new Date(leadDate.getTime() + 3600000), // 1 hour later
          eventType: 'LEAD_QUALIFIED',
          title: 'Lead qualifiziert',
          message: `${displayName} wurde als qualifizierter Lead markiert.`,
          details: `Score: ${lead.qualification?.score || 0}`,
          leadId: lead.id,
          customer: {
            name: displayName,
            type: customer.customerType
          },
          meta: { user: lead.assignedTo || 'System' }
        });
      }

      if (lead.status === 'rejected') {
        events.push({
          id: `lead-rejected-${lead.id}`,
          timestamp: new Date(leadDate.getTime() + 1800000), // 30 min later
          eventType: 'LEAD_REJECTED',
          title: 'Lead abgelehnt',
          message: `${displayName} wurde abgelehnt.`,
          leadId: lead.id,
          customer: {
            name: displayName,
            type: customer.customerType
          }
        });
      }
    });

    // 2. Generate integration events
    integrations.forEach(integration => {
      if (integration.status === 'error') {
        events.push({
          id: `int-error-${integration.id}`,
          timestamp: new Date(integration.lastSync.replace(' ', 'T')),
          eventType: 'SYSTEM_ALERT',
          title: `Integration Fehler: ${integration.name}`,
          message: integration.error || 'Verbindungsfehler aufgetreten',
          details: `Typ: ${integration.type}`,
          integrationId: integration.id
        });
      } else if (integration.status === 'connected') {
        events.push({
          id: `int-sync-${integration.id}`,
          timestamp: new Date(integration.lastSync.replace(' ', 'T')),
          eventType: 'SYSTEM_SUCCESS',
          title: `${integration.name} synchronisiert`,
          message: 'Daten erfolgreich synchronisiert',
          details: `Typ: ${integration.type}`,
          integrationId: integration.id
        });
      }
    });

    // 3. Generate mapping events from products
    const productList = Array.isArray(products) ? products : products?.products || [];
    productList.forEach(product => {
      if (product.createdAt || product.updatedAt) {
        const timestamp = new Date(product.updatedAt || product.createdAt);
        events.push({
          id: `mapping-product-${product.id}`,
          timestamp,
          eventType: 'MAPPING_PRODUCT',
          title: product.updatedAt ? 'Produkt aktualisiert' : 'Neues Produkt angelegt',
          message: `${product.name} wurde ${product.updatedAt ? 'aktualisiert' : 'erstellt'}.`,
          details: `Typ: ${getProduktName(product.type)} • Status: ${product.active ? 'Aktiv' : 'Inaktiv'}`,
          productId: product.id
        });
      }
    });

    // 4. Generate mapping events from availability rules (limit to 3 most recent)
    const ruleList = Array.isArray(rules) ? rules : rules?.rules || [];
    const recentRules = ruleList
      .filter(rule => rule.createdAt || rule.updatedAt)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 3);

    recentRules.forEach(rule => {
      const timestamp = new Date(rule.updatedAt || rule.createdAt);
      const productCount = rule.productIds?.length || 0;
      const ruleTypeLabel = rule.type === 'postal-code' ? 'PLZ' :
                           rule.type === 'city' ? 'Stadt' :
                           rule.type === 'street' ? 'Straße' : 'Regel';
      const locationInfo = rule.postalCode || rule.city || rule.street || '';
      events.push({
        id: `mapping-rule-${rule.id}`,
        timestamp,
        eventType: 'MAPPING_RULE',
        title: rule.updatedAt ? 'Regel geändert' : 'Neue Regel',
        message: `${ruleTypeLabel} ${locationInfo}`,
        details: `${productCount} Produkte`,
        ruleId: rule.id
      });
    });

    // Sort by timestamp descending (newest first)
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }, [flowLeads, integrations, products, rules]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return feedEvents.filter(item => {
      if (filterType === 'all') return true;
      if (filterType === 'lead') return item.eventType.startsWith('LEAD_');
      if (filterType === 'system') return item.eventType.startsWith('SYSTEM_');
      if (filterType === 'campaign') return item.eventType.startsWith('CAMPAIGN_');
      if (filterType === 'mapping') return item.eventType.startsWith('MAPPING_');
      return true;
    });
  }, [feedEvents, filterType]);

  // Group filtered events by date
  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce((acc, item) => {
      const group = getDateGroup(item.timestamp);
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [filteredEvents]);

  // Navigation handlers
  const handleItemAction = (item) => {
    if (item.leadId && onNavigate) {
      onNavigate('leads', { leadId: item.leadId });
    } else if (item.integrationId && onNavigate) {
      onNavigate('einstellung');
    } else if ((item.productId || item.ruleId) && onNavigate) {
      onNavigate('produkt-mapping');
    } else {
      showToast('Aktion nicht verfügbar');
    }
  };

  const getActionLabel = (item) => {
    if (item.leadId) return 'Öffnen';
    if (item.integrationId) return item.eventType === 'SYSTEM_ALERT' ? 'Beheben' : 'Details';
    if (item.productId) return 'Ansehen';
    if (item.ruleId) return 'Ansehen';
    return null;
  };

  return (
    <div className="news-feed-tab">
      <h2 className="sr-only">News Feed Übersicht</h2>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="feed-type-filter" className="flex items-center gap-2">
            <Filter size={14} aria-hidden="true" />
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
            <option value="mapping">Produkt-Mapping</option>
            <option value="campaign">Kampagnen & Marketing</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate('einstellung')}
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

      {/* Timeline Feed */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="news-feed-list">

          {Object.entries(groupedEvents).map(([date, items]) => (
            <div key={date} className="timeline-group">
              {/* Date Header */}
              <div className="news-date-header">
                <h4>{date}</h4>
              </div>

              {/* Items */}
              {items.map((item) => {
                const { icon: Icon, bg } = getIconConfig(item.eventType);
                const actionLabel = getActionLabel(item);

                return (
                  <div
                    key={item.id}
                    className="news-item"
                    role="article"
                    aria-labelledby={`news-title-${item.id}`}
                    onClick={() => actionLabel && handleItemAction(item)}
                    style={{ cursor: actionLabel ? 'pointer' : 'default' }}
                    tabIndex={actionLabel ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (actionLabel && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleItemAction(item);
                      }
                    }}
                  >
                    <div
                      className="news-icon-wrapper"
                      style={{ backgroundColor: bg, color: 'white' }}
                      aria-hidden="true"
                    >
                      <Icon size={14} />
                    </div>

                    <div className="news-content-card">
                      <div className="news-header">
                        <span id={`news-title-${item.id}`} className="news-message">
                          {item.title}
                        </span>
                      </div>

                      <div className="news-details">
                        {item.message}
                        {item.details && ` · ${item.details}`}
                      </div>

                      <div className="news-meta">
                        {item.customer ? (
                          <div className="news-meta-item">
                            <Avatar
                              name={item.customer.name}
                              size="xs"
                              usePlaceholder
                              type={item.customer.type === 'business' ? 'company' : 'person'}
                            />
                            <span>{item.customer.name}</span>
                          </div>
                        ) : (
                          <span>System</span>
                        )}

                        <span className="news-time">
                          {formatEventTime(item.timestamp)}
                        </span>

                        {actionLabel && (
                          <button
                            className="btn btn-sm btn-link"
                            style={{ padding: 0, height: 'auto', marginLeft: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemAction(item);
                            }}
                          >
                            {actionLabel} <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="news-feed-empty">
              <div className="news-feed-empty-icon">
                <Filter size={24} />
              </div>
              <p className="news-feed-empty-text">
                Keine Aktivitäten für den gewählten Filter gefunden.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default NewsFeedTab;
