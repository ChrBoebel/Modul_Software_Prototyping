import { useState, useMemo } from 'react';
import {
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Circle
} from 'lucide-react';
import { Button, Badge, SearchBox, Select, ToggleGroup, FilterChip, FilterChipGroup } from '../ui';
import leadsData from '../../data/leads.json';

// Transform leads.json data to display format
const transformLead = (lead) => {
  // Map interest type to German product name
  const produktMap = {
    'solar': 'Solar PV',
    'heatpump': 'Wärmepumpe',
    'charging_station': 'E-Mobilität',
    'energy_contract': 'Strom',
    'energy_storage': 'Speicher'
  };

  // Derive Ampel status from score
  const getAmpelStatus = (score) => {
    if (score >= 80) return 'grün';
    if (score >= 50) return 'gelb';
    return 'rot';
  };

  // Format timestamp for display
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  };

  return {
    id: lead.id,
    leadId: lead.leadNumber,
    status: getAmpelStatus(lead.qualification?.score || 0),
    leadScore: lead.qualification?.score || 0,
    produkt: produktMap[lead.interest?.type] || lead.interest?.type || 'Unbekannt',
    timestamp: formatTimestamp(lead.timestamp),
    name: `${lead.customer?.firstName || ''} ${lead.customer?.lastName || ''}`.trim() || 'Unbekannt',
    email: lead.customer?.email || '',
    phone: lead.customer?.phone || '',
    zugewiesenAn: lead.assignedTo || 'Nicht zugewiesen',
    // Keep original data for detail view
    originalData: lead
  };
};

const LeadsList = ({ showToast, onSelectLead, selectedLeadId, flowLeads = [] }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leadsFilter, setLeadsFilter] = useState('all');

  // Current user (simulated)
  const currentUser = 'Max Mustermann';

  // Transform and merge leads from JSON data with flow-generated leads
  const leads = useMemo(() => {
    const jsonLeads = leadsData.leads.map(transformLead);
    const transformedFlowLeads = flowLeads.map(transformLead);
    // Flow leads first (newest), then JSON data
    return [...transformedFlowLeads, ...jsonLeads];
  }, [flowLeads]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'grün': { class: 'success', label: 'Grün', color: 'var(--success)' },
      'gelb': { class: 'warning', label: 'Gelb', color: 'var(--warning)' },
      'rot': { class: 'danger', label: 'Rot', color: 'var(--danger)' }
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
      'grün': 'Hohe Conversion-Wahrscheinlichkeit',
      'gelb': 'Mittlere Conversion-Wahrscheinlichkeit',
      'rot': 'Niedrige Conversion-Wahrscheinlichkeit'
    };
    return tooltips[status] || status;
  };

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
    { value: 'grün', label: 'Grün' },
    { value: 'gelb', label: 'Gelb' },
    { value: 'rot', label: 'Rot' }
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
                  <div className="lead-name-info">
                    <span className="lead-name">{lead.name}</span>
                    <span className="lead-id-subtext">{lead.leadId}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge-ampel ${getStatusBadge(lead.status).class}`}
                    title={getStatusTooltip(lead.status)}
                  >
                    <Circle size={10} fill="currentColor" />
                    <span>{getStatusBadge(lead.status).label}</span>
                  </span>
                </td>
                <td>
                  <span className={`score-badge ${getScoreBadge(lead.leadScore)}`}>
                    {lead.leadScore}
                  </span>
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
