// Mock Data aggregation for components
import closingData from './closing.json';
import leadsData from './leads.json';

export const mockData = {
  // Closing / Sales Data
  salesReps: closingData.salesReps || [],
  integrations: closingData.integrations || [],
  syncLogs: closingData.syncLogs || [],
  conversionFunnel: closingData.conversionFunnel || {},
  assignments: closingData.assignments || [],
  
  // Leads Data
  leads: leadsData.leads || []
};

export default mockData;


