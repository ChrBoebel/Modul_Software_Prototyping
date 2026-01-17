import { useState, useMemo } from 'react';
import {
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Circle
} from 'lucide-react';
import { Button, Badge, SearchBox, Select, ToggleGroup, FilterChip, FilterChipGroup, Avatar } from '../ui';
import leadsData from '../../data/leads.json';
import { transformLead } from '../../utils/leadUtils';

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
                  <span
                    className={`status-badge-ampel ${getStatusBadge(lead.status).class}`}
                    title={getStatusTooltip(lead.status)}
                  >
                    <Circle size={10} fill="currentColor" />
                    <span>{getStatusBadge(lead.status).label}</span>
                  </span>
                </td>
                <td>
                  <span
                    className={`score-badge ${getScoreBadge(lead.leadScore)}`}
                    title={lead.scoreBreakdown?.length > 0
                      ? `Score-Zusammensetzung:\n${lead.scoreBreakdown.map(s => `${s.label}: ${s.points > 0 ? '+' : ''}${s.points}`).join('\n')}`
                      : `Score: ${lead.leadScore}`
                    }
                    style={{ cursor: 'help' }}
                  >
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
