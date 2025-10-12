import kpisData from './kpis.json';
import facilitiesData from './facilities.json';
import customersData from './customers.json';
import invoicesData from './invoices.json';
import alertsData from './alerts.json';
import energyData from './energy.json';
import gridData from './grid.json';
import analyticsData from './analytics.json';

export const mockData = {
  kpis: kpisData.kpis,
  energyConsumption: energyData.energyConsumption,
  energyMix: energyData.energyMix,
  facilities: facilitiesData.facilities,
  alerts: alertsData.alerts,
  customers: customersData.customers,
  invoices: invoicesData.invoices,
  gridLoad: gridData.gridLoad,
  voltageFrequency: gridData.voltageFrequency,
  loadForecast: gridData.loadForecast,
  regionalGrid: gridData.regionalGrid,
  transformers: gridData.transformers,
  batteryStorage: analyticsData.batteryStorage,
  peakDemand: analyticsData.peakDemand,
  renewableTimeline: energyData.renewableTimeline,
  gridLosses: analyticsData.gridLosses,
  customerSegments: analyticsData.customerSegments,
  outages: analyticsData.outages
};
