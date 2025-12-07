import usersData from './users.json';
import settingsData from './settings.json';
import leadsData from './leads.json';
// Lead Journey Data
import awarenessData from './awareness.json';
import captureData from './capture.json';
import nurturingData from './nurturing.json';
import qualificationData from './qualification.json';
import closingData from './closing.json';
import retentionData from './retention.json';

export const mockData = {
  users: usersData.users,
  settings: settingsData,
  leads: leadsData.leads,
  flows: leadsData.flows,
  leadStatusOptions: leadsData.statusOptions,
  leadPriorityOptions: leadsData.priorityOptions,
  leadSourceOptions: leadsData.sourceOptions,
  leadInterestTypes: leadsData.interestTypes,
  // Lead Journey - Awareness
  campaigns: awarenessData.campaigns,
  trafficSources: awarenessData.trafficSources,
  utmPresets: awarenessData.utmPresets,
  dailyTraffic: awarenessData.dailyTraffic,
  // Lead Journey - Capture
  globalVariables: captureData.globalVariables,
  leadMagnets: captureData.leadMagnets,
  funnelAnalytics: captureData.funnelAnalytics,
  // Lead Journey - Nurturing
  journeys: nurturingData.journeys,
  emailTemplates: nurturingData.emailTemplates,
  assets: nurturingData.assets,
  triggers: nurturingData.triggers,
  actions: nurturingData.actions,
  conditions: nurturingData.conditions,
  // Lead Journey - Qualification
  scoringRules: qualificationData.scoringRules,
  scoreThresholds: qualificationData.thresholds,
  scoreHistory: qualificationData.scoreHistory,
  pipelineStages: qualificationData.pipelineStages,
  ruleCategories: qualificationData.ruleCategories,
  conditionOperators: qualificationData.conditionOperators,
  scoringFields: qualificationData.fields,
  // Lead Journey - Closing
  salesReps: closingData.salesReps,
  integrations: closingData.integrations,
  syncLogs: closingData.syncLogs,
  conversionFunnel: closingData.conversionFunnel,
  assignments: closingData.assignments,
  // Lead Journey - Retention
  lifecycleTimers: retentionData.lifecycleTimers,
  referralProgram: retentionData.referralProgram,
  churnRisk: retentionData.churnRisk,
  customerSatisfaction: retentionData.customerSatisfaction
};
