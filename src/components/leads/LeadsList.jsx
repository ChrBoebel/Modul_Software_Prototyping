import { useState } from 'react';
import {
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Circle
} from 'lucide-react';
import { Button, Badge, SearchBox, Select, ToggleGroup } from '../ui';

const LeadsList = ({ showToast, onSelectLead, selectedLeadId }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leadsFilter, setLeadsFilter] = useState('all');

  // Current user (simulated)
  const currentUser = 'Max Mustermann';

  // Mock leads data
  const leads = [
    {
      id: 1,
      leadId: 'LEAD-2025-0001',
      status: 'grün',
      leadScore: 92,
      produkt: 'Solar PV',
      timestamp: '2025-01-15 10:23',
      zuletztAktualisiert: '2025-01-16 14:30',
      name: 'Max Muster',
      email: 'max.muster@email.de',
      phone: '+49 171 1234567',
      zugewiesenAn: 'Max Mustermann'
    },
    {
      id: 2,
      leadId: 'LEAD-2025-0002',
      status: 'gelb',
      leadScore: 75,
      produkt: 'Wärmepumpe',
      timestamp: '2025-01-15 09:45',
      zuletztAktualisiert: '2025-01-16 11:20',
      name: 'Anna Schmidt',
      email: 'anna.schmidt@email.de',
      phone: '+49 172 2345678',
      zugewiesenAn: 'Lisa Weber'
    },
    {
      id: 3,
      leadId: 'LEAD-2025-0003',
      status: 'rot',
      leadScore: 45,
      produkt: 'E-Mobilität',
      timestamp: '2025-01-15 08:12',
      zuletztAktualisiert: '2025-01-15 16:45',
      name: 'Peter Weber',
      email: 'peter.weber@email.de',
      phone: '+49 173 3456789',
      zugewiesenAn: 'Max Mustermann'
    },
    {
      id: 4,
      leadId: 'LEAD-2025-0004',
      status: 'grün',
      leadScore: 88,
      produkt: 'Strom',
      timestamp: '2025-01-14 16:30',
      zuletztAktualisiert: '2025-01-15 09:15',
      name: 'Lisa Müller',
      email: 'lisa.mueller@email.de',
      phone: '+49 174 4567890',
      zugewiesenAn: 'Thomas Schmidt'
    },
    {
      id: 5,
      leadId: 'LEAD-2025-0005',
      status: 'gelb',
      leadScore: 68,
      produkt: 'Gas',
      timestamp: '2025-01-14 14:55',
      zuletztAktualisiert: '2025-01-15 08:30',
      name: 'Thomas Klein',
      email: 'thomas.klein@email.de',
      phone: '+49 175 5678901',
      zugewiesenAn: 'Max Mustermann'
    },
    {
      id: 6,
      leadId: 'LEAD-2025-0006',
      status: 'grün',
      leadScore: 95,
      produkt: 'Solar PV',
      timestamp: '2025-01-14 12:20',
      zuletztAktualisiert: '2025-01-14 18:00',
      name: 'Sandra Hoffmann',
      email: 'sandra.hoffmann@email.de',
      phone: '+49 176 6789012',
      zugewiesenAn: 'Lisa Weber'
    }
  ];

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

  return (
    <div className="leads-list">
      <h2 className="sr-only">Leads Übersicht</h2>
      {/* Header */}
      <div className="leads-header">
        <div className="leads-title-area">
          <h3 className="section-title-visible">Alle Leads</h3>
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

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table leads-table">
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Status</th>
              <th>Lead-Score</th>
              <th>Produkt</th>
              <th>Timestamp</th>
              <th>Zuletzt Aktualisiert</th>
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
                <td className="lead-id-cell">{lead.leadId}</td>
                <td>
                  <span className={`status-badge-ampel ${getStatusBadge(lead.status).class}`}>
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
                <td className="timestamp-cell">{lead.timestamp}</td>
                <td className="timestamp-cell">{lead.zuletztAktualisiert}</td>
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
