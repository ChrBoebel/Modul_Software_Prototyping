import { useState, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { theme } from '../../../theme/colors';
import leadsData from '../../../data/leads.json';
import defaultProducts from '../../../data/productCatalog.json';
import defaultRules from '../../../data/availabilityRules.json';
import defaultIntegrations from '../../../data/defaultIntegrations.json';
import { getProduktName } from '../../../utils/leadUtils';

import PriorityLeadsTable from './start-tab/PriorityLeadsTable';
import CampaignPerformanceTable from './start-tab/CampaignPerformanceTable';
import ProductCoverageCard from './start-tab/ProductCoverageCard';
import IntegrationStatusBanner from './start-tab/IntegrationStatusBanner';
import LeadIntakeChart from './start-tab/LeadIntakeChart';
import ConversionFunnelCard from './start-tab/ConversionFunnelCard';

const StartTab = ({ showToast, onTabChange, onNavigate, flowLeads = [] }) => {
  // State for selected campaign (null = show all campaigns combined)
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  // Load product mapping data from localStorage (with default demo data)
  const [products] = useLocalStorage('swk:productCatalog', defaultProducts);
  const [rules] = useLocalStorage('swk:availabilityRules', defaultRules);
  const [addresses] = useLocalStorage('swk:addresses', []);

  // Load integration status from localStorage (shared with Settings, with default demo data)
  const [integrations] = useLocalStorage('swk:integrations', defaultIntegrations);

  // Calculate integration status summary
  const integrationStatus = useMemo(() => {
    if (!integrations || integrations.length === 0) {
      return { hasError: false, connectedCount: 0, errorCount: 0, lastSync: null };
    }

    const connected = integrations.filter(i => i.status === 'connected');
    const errors = integrations.filter(i => i.status === 'error');

    // Find the most recent sync
    let latestSync = null;
    for (const int of integrations) {
      if (int.lastSync) {
        if (!latestSync || int.lastSync > latestSync) {
          latestSync = int.lastSync;
        }
      }
    }

    return {
      hasError: errors.length > 0,
      connectedCount: connected.length,
      errorCount: errors.length,
      total: integrations.length,
      lastSync: latestSync,
      errorIntegrations: errors.map(e => e.name)
    };
  }, [integrations]);

  // Calculate product coverage stats
  const productStats = useMemo(() => {
    const activeProducts = products.filter(p => p.active !== false);
    const activeRules = rules.filter(r => r.active);

    // Count unique PLZs covered by rules
    const coveredPlzs = new Set(activeRules.map(r => r.postalCode).filter(Boolean));

    // Count products per rule
    const productCounts = new Map();
    for (const rule of activeRules) {
      const productIds = Array.isArray(rule.productIds) ? rule.productIds : [];
      for (const pid of productIds) {
        productCounts.set(pid, (productCounts.get(pid) || 0) + 1);
      }
    }

    // Get top 3 products by rule coverage
    const topProducts = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => {
        const product = products.find(p => p.id === id);
        return {
          id,
          name: product?.name || id,
          ruleCount: count
        };
      });

    // Calculate coverage percentage (simplified: rules exist = covered)
    const totalPlzGermany = 8000; // Approximate number of PLZ areas in Germany
    const coveragePercent = Math.min(100, Math.round((coveredPlzs.size / totalPlzGermany) * 100 * 10)); // Scale up for visibility

    return {
      totalProducts: activeProducts.length,
      totalRules: activeRules.length,
      coveredPlzCount: coveredPlzs.size,
      addressCount: addresses.length,
      topProducts,
      coveragePercent
    };
  }, [products, rules, addresses]);

  // Data for availability distribution chart
  const availabilityChartData = useMemo(() => {
    const totalRules = rules.filter(r => r.active).length;
    const totalProducts = products.filter(p => p.config?.active !== false).length;

    return [
      { name: 'Produkte', value: totalProducts, color: theme.colors.secondary },
      { name: 'Regeln', value: totalRules, color: theme.colors.primary },
      { name: 'PLZ', value: productStats.coveredPlzCount, color: theme.colors.success }
    ];
  }, [rules, products, productStats.coveredPlzCount]);

  // Format timestamp for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Gestern';
    } else {
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    }
  };

  // Transform and sort leads by score for Priority-A display (merge with flow leads)
  const priorityLeads = useMemo(() => {
    const allLeads = [...flowLeads, ...leadsData.leads];
    return allLeads
      .map(lead => {
        const customer = lead.customer || {};
        const isBusiness = customer.customerType === 'business';
        const displayName = isBusiness && customer.companyName
          ? customer.companyName
          : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Neuer Lead';

        return {
          id: lead.leadNumber,
          numericId: lead.id,
          name: displayName,
          contactPerson: isBusiness ? customer.contactPerson : null,
          customerType: customer.customerType || 'private',
          score: lead.qualification?.score || 0,
          scoreBreakdown: lead.qualification?.scoreBreakdown || [],
          product: getProduktName(lead.interest?.type),
          timestamp: formatTime(lead.timestamp),
          status: lead.status
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 5); // Top 5
  }, [flowLeads]);

  // Campaigns with funnel data for each campaign
  const campaigns = [
    {
      id: 'camp-001',
      name: 'Solar Frühling 2025',
      status: 'Aktiv',
      leads30d: 145,
      qualiQuote: '35%',
      trend: 'up',
      funnelData: { started: 1200, contact: 720, questionnaire: 540, qualified: 145, closed: 51 }
    },
    {
      id: 'camp-002',
      name: 'Wärmepumpen Aktion',
      status: 'Pausiert',
      leads30d: 89,
      qualiQuote: '42%',
      trend: 'down',
      funnelData: { started: 850, contact: 510, questionnaire: 380, qualified: 89, closed: 37 }
    },
    {
      id: 'camp-003',
      name: 'E-Auto Förderung',
      status: 'Aktiv',
      leads30d: 67,
      qualiQuote: '28%',
      trend: 'up',
      funnelData: { started: 620, contact: 350, questionnaire: 245, qualified: 67, closed: 19 }
    },
    {
      id: 'camp-004',
      name: 'Ökostrom Wechsel',
      status: 'Prüfung',
      leads30d: 234,
      qualiQuote: '18%',
      trend: 'stable',
      funnelData: { started: 2330, contact: 920, questionnaire: 685, qualified: 157, closed: 13 }
    }
  ];

  // Get selected campaign or null for "all"
  const selectedCampaign = selectedCampaignId
    ? campaigns.find(c => c.id === selectedCampaignId)
    : null;

  // Dynamic funnel data based on selected campaign
  const rawFunnelSteps = useMemo(() => {
    let data;

    if (selectedCampaign) {
      // Use funnel data from selected campaign
      data = selectedCampaign.funnelData;
    } else {
      // Combine all campaigns
      data = campaigns.reduce((acc, camp) => ({
        started: acc.started + camp.funnelData.started,
        contact: acc.contact + camp.funnelData.contact,
        questionnaire: acc.questionnaire + camp.funnelData.questionnaire,
        qualified: acc.qualified + camp.funnelData.qualified,
        closed: acc.closed + camp.funnelData.closed
      }), { started: 0, contact: 0, questionnaire: 0, qualified: 0, closed: 0 });
    }

    return [
      { label: 'Formulare gestartet', value: data.started, fill: theme.colors.primary },
      { label: 'Kontaktdaten', value: data.contact, fill: theme.colors.primaryDark },
      { label: 'Fragebogen', value: data.questionnaire, fill: theme.colors.secondary },
      { label: 'System-Qualifiziert', value: data.qualified, fill: theme.colors.secondaryDark },
      { label: 'Erfolgreicher Anschluss', value: data.closed, fill: theme.colors.slate500 }
    ];
  }, [selectedCampaign]);

  // Calculate percentages and enrichment
  const funnelSteps = rawFunnelSteps.map((step, index, array) => {
    const prevValue = index > 0 ? array[index - 1].value : step.value;
    const total = array[0].value;

    return {
      ...step,
      conversionRate: index === 0 ? 100 : ((step.value / prevValue) * 100).toFixed(1),
      percentageOfTotal: ((step.value / total) * 100).toFixed(1),
      dropOff: index === 0 ? 0 : (prevValue - step.value)
    };
  });

  // Chart Data - Strict Brand Colors
  const chartData = [
    { name: 'Mo', qualified: 12, unqualified: 4, rejected: 2 },
    { name: 'Di', qualified: 19, unqualified: 6, rejected: 3 },
    { name: 'Mi', qualified: 15, unqualified: 8, rejected: 1 },
    { name: 'Do', qualified: 22, unqualified: 5, rejected: 4 },
    { name: 'Fr', qualified: 18, unqualified: 7, rejected: 2 },
    { name: 'Sa', qualified: 8, unqualified: 3, rejected: 1 },
    { name: 'So', qualified: 5, unqualified: 2, rejected: 0 },
  ];

  // Calculate average total leads per day (Tufte: provide context)
  const avgTotalLeads = Math.round(
    chartData.reduce((sum, d) => sum + d.qualified + d.unqualified + d.rejected, 0) / chartData.length
  );

  return (
    <div className="start-tab">
      <h2 className="sr-only">Start Übersicht</h2>
      <div className="start-grid">
        {/* Left Column */}
        <div className="start-left">
          <PriorityLeadsTable
            priorityLeads={priorityLeads}
            onNavigate={onNavigate}
            showToast={showToast}
          />
          <CampaignPerformanceTable
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
          />
          <ProductCoverageCard
            productStats={productStats}
            availabilityChartData={availabilityChartData}
            onNavigate={onNavigate}
          />
        </div>

        {/* Right Column */}
        <div className="start-right">
          <IntegrationStatusBanner
            integrationStatus={integrationStatus}
            integrations={integrations}
            onNavigate={onNavigate}
            showToast={showToast}
          />
          <LeadIntakeChart
            chartData={chartData}
            avgTotalLeads={avgTotalLeads}
          />
          <ConversionFunnelCard
            funnelSteps={funnelSteps}
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
          />
        </div>
      </div>
    </div>
  );
};

export default StartTab;
