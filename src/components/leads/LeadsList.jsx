import { useState, useMemo, useCallback } from 'react';
import {
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Circle,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Button, Badge, SearchBox, Select, ToggleGroup, FilterChip, FilterChipGroup, Avatar, ScoreBadge, StatusBadge } from '../ui';
import leadsData from '../../data/leads.json';
import { transformLead } from '../../utils/leadUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getCombinedAvailabilityForAddress } from '../produkt-mapping/availabilityLogic';
import defaultProducts from '../../data/productCatalog.json';
import defaultRules from '../../data/availabilityRules.json';
import defaultAddresses from '../../data/addresses.json';
import defaultAvailability from '../../data/availability.json';
import defaultAvailabilityStatus from '../../data/availabilityStatus.json';

const LeadsList = ({ showToast, onSelectLead, selectedLeadId, flowLeads = [] }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leadsFilter, setLeadsFilter] = useState('all');

  // Current user (simulated)
  const currentUser = 'Max Mustermann';

  // Load product mapping data for availability check
  const [products] = useLocalStorage('swk:productCatalog', defaultProducts);
  const [rules] = useLocalStorage('swk:availabilityRules', defaultRules);
  const [addresses] = useLocalStorage('swk:addresses', defaultAddresses);
  const [availability] = useLocalStorage('swk:availability', defaultAvailability);
  const [availabilityStatus] = useLocalStorage('swk:availabilityStatus', defaultAvailabilityStatus);

  // Transform and merge leads from JSON data with flow-generated leads
  const leads = useMemo(() => {
    const jsonLeads = leadsData.leads.map(transformLead);
    const transformedFlowLeads = flowLeads.map(transformLead);
    // Flow leads first (newest), then JSON data
    return [...transformedFlowLeads, ...jsonLeads];
  }, [flowLeads]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'hoch': { class: 'success', label: 'Hoch', color: 'var(--success)' },
      'mittel': { class: 'warning', label: 'Mittel', color: 'var(--warning)' },
      'niedrig': { class: 'danger', label: 'Niedrig', color: 'var(--danger)' }
    };
    return statusMap[status] || { class: 'neutral', label: status, color: 'var(--slate-400)' };
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getStatusTooltip = (status) => {
    const tooltips = {
      'hoch': 'Hohe Conversion-Wahrscheinlichkeit (Score ≥80)',
      'mittel': 'Mittlere Conversion-Wahrscheinlichkeit (Score 50-79)',
      'niedrig': 'Niedrige Conversion-Wahrscheinlichkeit (Score <50)'
    };
    return tooltips[status] || status;
  };

  // Get availability status for a lead
  const getLeadAvailability = useCallback((lead) => {
    const customer = lead.originalData?.customer;
    if (!customer?.address && !customer?.postalCode) {
      return { status: 'unknown', label: '—', icon: HelpCircle, tooltip: 'Keine Adresse bekannt' };
    }

    // Parse address from string or object
    let addressObj = null;
    if (typeof customer.address === 'string' && customer.address.trim()) {
      // Parse string address like "Hauptstraße 45, 78462 Konstanz"
      const parts = customer.address.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        const streetMatch = parts[0].match(/^(.+?)\s+(\d+\w*)$/);
        const cityMatch = parts[1].match(/^(\d{5})\s+(.+)$/);
        if (streetMatch && cityMatch) {
          addressObj = {
            street: streetMatch[1],
            houseNumber: streetMatch[2],
            postalCode: cityMatch[1],
            city: cityMatch[2]
          };
        }
      }
    } else if (customer.postalCode) {
      addressObj = {
        postalCode: customer.postalCode,
        street: customer.street || '',
        houseNumber: customer.houseNumber || '',
        city: customer.city || ''
      };
    }

    if (!addressObj) return { status: 'unknown', label: '—', icon: HelpCircle, tooltip: 'Adresse nicht parsbar' };

    try {
      const result = getCombinedAvailabilityForAddress(addressObj, {
        products, rules, addresses, availability, availabilityStatus
      });
      if (result.isServiceable) {
        const productCount = result.availableProducts?.length || 0;
        return {
          status: 'serviceable',
          label: 'Versorgbar',
          icon: CheckCircle,
          tooltip: `${productCount} Produkt${productCount !== 1 ? 'e' : ''} verfügbar`
        };
      }
      return { status: 'not-serviceable', label: 'Nicht versorgbar', icon: XCircle, tooltip: 'Keine Produkte an dieser Adresse' };
    } catch {
      return { status: 'unknown', label: '—', icon: HelpCircle, tooltip: 'Fehler bei Prüfung' };
    }
  }, [products, rules, addresses, availability, availabilityStatus]);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOwner = leadsFilter === 'all' || lead.zugewiesenAn === currentUser;
    return matchesStatus && matchesSearch && matchesOwner;
  });

  const myLeadsCount = leads.filter(l => l.zugewiesenAn === currentUser).length;

  const leadsToggleOptions = [
    { value: 'all', label: 'Alle Leads', count: leads.length },
    { value: 'mine', label: 'Meine Leads', count: myLeadsCount }
  ];

  const statusOptions = [
    { value: 'all', label: 'Alle Status' },
    { value: 'hoch', label: 'Hoch' },
    { value: 'mittel', label: 'Mittel' },
    { value: 'niedrig', label: 'Niedrig' }
  ];

  // Check if any filters are active
  const hasActiveFilters = filterStatus !== 'all' || leadsFilter !== 'all' || searchTerm !== '';

  // Clear all filters
  const clearAllFilters = () => {
    setFilterStatus('all');
    setLeadsFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="leads-list">
      <h2 className="sr-only">Leads Übersicht</h2>
      {/* Header */}
      <div className="leads-header">
        <div className="leads-title-area">
          <h3 className="section-title-visible">Alle Leads</h3>
          <Badge variant="neutral" size="sm">
            {filteredLeads.length} von {leads.length}
          </Badge>
        </div>
        <div className="leads-controls" role="search" aria-label="Leads Filter und Suche">
          <ToggleGroup
            options={leadsToggleOptions}
            value={leadsFilter}
            onChange={setLeadsFilter}
            ariaLabel="Lead Ansicht filtern"
          />
          <SearchBox
            id="lead-search"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <div className="filter-group-inline">
            <Select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusOptions}
              placeholder=""
            />
          </div>
          <Button
            variant="icon"
            size="sm"
            icon={RefreshCw}
            onClick={() => showToast('Leads aktualisiert')}
            ariaLabel="Leads Liste aktualisieren"
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <FilterChipGroup onClearAll={clearAllFilters}>
          {leadsFilter !== 'all' && (
            <FilterChip
              label="Meine Leads"
              onRemove={() => setLeadsFilter('all')}
            />
          )}
          {filterStatus !== 'all' && (
            <FilterChip
              label={`Status: ${statusOptions.find(s => s.value === filterStatus)?.label || filterStatus}`}
              onRemove={() => setFilterStatus('all')}
            />
          )}
          {searchTerm && (
            <FilterChip
              label={`Suche: "${searchTerm}"`}
              onRemove={() => setSearchTerm('')}
            />
          )}
        </FilterChipGroup>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Score</th>
              <th>Verfügbarkeit</th>
              <th>Produkt</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className={selectedLeadId === lead.id ? 'selected' : ''}
                onClick={() => onSelectLead(lead)}
                tabIndex={0}
                role="button"
                aria-selected={selectedLeadId === lead.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectLead(lead);
                  }
                }}
              >
                <td className="lead-name-cell">
                  <div className="lead-name-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar
                      name={lead.name}
                      size="sm"
                      usePlaceholder
                      type={lead.customerType === 'business' ? 'company' : 'person'}
                    />
                    <div>
                      <span className="lead-name">{lead.name}</span>
                      {lead.contactPerson && (
                        <span className="lead-contact-subtext">{lead.contactPerson}</span>
                      )}
                      <span className="lead-id-subtext">{lead.leadId}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <StatusBadge
                    status={lead.status}
                    label={getStatusBadge(lead.status).label}
                    icon={Circle}
                    variant={getStatusBadge(lead.status).class}
                    size="sm"
                    tooltip={{
                      title: getStatusBadge(lead.status).label,
                      description: getStatusTooltip(lead.status)
                    }}
                  />
                </td>
                <td>
                  <ScoreBadge
                    score={lead.leadScore}
                    breakdown={lead.scoreBreakdown}
                  />
                </td>
                <td>
                  {(() => {
                    const avail = getLeadAvailability(lead);
                    const variantMap = {
                      'serviceable': 'success',
                      'not-serviceable': 'danger',
                      'unknown': 'neutral'
                    };
                    return (
                      <StatusBadge
                        status={avail.status}
                        label={avail.label}
                        icon={avail.icon}
                        variant={variantMap[avail.status] || 'neutral'}
                        size="sm"
                        tooltip={{
                          title: avail.label,
                          description: avail.tooltip
                        }}
                      />
                    );
                  })()}
                </td>
                <td>{lead.produkt}</td>
                <td className="actions-cell">
                  <div className="quick-actions">
                    <Button
                      variant="icon"
                      size="sm"
                      icon={Phone}
                      title={`Anrufen: ${lead.phone}`}
                      ariaLabel={`Anrufen: ${lead.phone}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${lead.phone}`;
                        showToast(`Anruf an ${lead.name}`);
                      }}
                    />
                    <Button
                      variant="icon"
                      size="sm"
                      icon={Mail}
                      title={`E-Mail: ${lead.email}`}
                      ariaLabel={`E-Mail an ${lead.email}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${lead.email}`;
                        showToast(`E-Mail an ${lead.name}`);
                      }}
                    />
                    <Button
                      variant="link"
                      size="sm"
                      icon={ExternalLink}
                      title="Details anzeigen"
                      ariaLabel={`Details für ${lead.name} anzeigen`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLead(lead);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsList;
