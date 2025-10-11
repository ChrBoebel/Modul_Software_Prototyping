export const mockData = {
  kpis: [
    {
      id: "energy_consumption",
      title: "Energieverbrauch",
      value: "2,847",
      unit: "MWh",
      change: "+12.5",
      trend: "up",
      icon: "⚡",
      sparkline: [2450, 2520, 2600, 2680, 2750, 2820, 2847]
    },
    {
      id: "cost",
      title: "Kosten",
      value: "284,700",
      unit: "€",
      change: "+8.3",
      trend: "up",
      icon: "💰",
      sparkline: [260000, 265000, 270000, 275000, 280000, 282000, 284700]
    },
    {
      id: "co2_emissions",
      title: "CO₂-Emissionen",
      value: "1,423",
      unit: "Tonnen",
      change: "-15.2",
      trend: "down",
      icon: "🌱",
      sparkline: [1680, 1620, 1580, 1540, 1500, 1460, 1423]
    },
    {
      id: "system_uptime",
      title: "System Verfügbarkeit",
      value: "99.94",
      unit: "%",
      change: "+0.12",
      trend: "up",
      icon: "📊",
      sparkline: [99.82, 99.85, 99.88, 99.90, 99.91, 99.93, 99.94]
    }
  ],
  energyConsumption: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    datasets: [
      {
        label: "Heute",
        data: [180, 165, 220, 380, 420, 390, 280],
        color: "#FD951F"
      },
      {
        label: "Gestern",
        data: [175, 160, 210, 360, 400, 370, 260],
        color: "#000099"
      }
    ]
  },
  energyMix: {
    labels: ["Solar", "Wind", "Gas", "Kohle", "Wasser"],
    data: [35, 28, 20, 12, 5],
    colors: ["#FD951F", "#000099", "#ef4444", "#6b7280", "#10b981"]
  },
  facilities: [
    {
      id: 1,
      name: "Kraftwerk Nord",
      type: "Solar",
      capacity: "50 MW",
      output: "42.5 MW",
      efficiency: "85%",
      status: "active",
      lastMaintenance: "2025-09-15",
      alerts: 0
    },
    {
      id: 2,
      name: "Windpark Ost",
      type: "Wind",
      capacity: "75 MW",
      output: "68.2 MW",
      efficiency: "91%",
      status: "active",
      lastMaintenance: "2025-08-22",
      alerts: 0
    },
    {
      id: 3,
      name: "Kraftwerk Süd",
      type: "Gas",
      capacity: "120 MW",
      output: "95.8 MW",
      efficiency: "80%",
      status: "active",
      lastMaintenance: "2025-09-28",
      alerts: 1
    },
    {
      id: 4,
      name: "Kohlewerk West",
      type: "Kohle",
      capacity: "200 MW",
      output: "145.0 MW",
      efficiency: "73%",
      status: "maintenance",
      lastMaintenance: "2025-10-08",
      alerts: 3
    },
    {
      id: 5,
      name: "Wasserkraft Zentral",
      type: "Wasser",
      capacity: "30 MW",
      output: "28.5 MW",
      efficiency: "95%",
      status: "active",
      lastMaintenance: "2025-07-10",
      alerts: 0
    }
  ],
  alerts: [
    {
      id: 1,
      severity: "high",
      facility: "Kohlewerk West",
      message: "Turbine 2 Temperatur über Schwellenwert",
      timestamp: "2025-10-10T14:23:00Z",
      status: "open"
    },
    {
      id: 2,
      severity: "medium",
      facility: "Kraftwerk Süd",
      message: "Planmäßige Wartung in 48h",
      timestamp: "2025-10-10T12:15:00Z",
      status: "acknowledged"
    },
    {
      id: 3,
      severity: "low",
      facility: "Windpark Ost",
      message: "Wetterbericht: Niedrige Windgeschwindigkeit erwartet",
      timestamp: "2025-10-10T09:30:00Z",
      status: "open"
    },
    {
      id: 4,
      severity: "success",
      facility: "Kraftwerk Nord",
      message: "Wartung erfolgreich abgeschlossen - System läuft optimal",
      timestamp: "2025-10-10T08:45:00Z",
      status: "acknowledged"
    }
  ],
  customers: [
    {
      id: 1,
      name: "Stadtwerke München GmbH",
      type: "Gewerbe",
      consumption: "1,250,000",
      unit: "kWh/Jahr",
      tariff: "Gewerbe Plus",
      contractStart: "2023-01-15",
      status: "active"
    },
    {
      id: 2,
      name: "Schmidt, Anna",
      type: "Privat",
      consumption: "3,200",
      unit: "kWh/Jahr",
      tariff: "Basis",
      contractStart: "2024-03-01",
      status: "active"
    },
    {
      id: 3,
      name: "TechCorp Solutions AG",
      type: "Gewerbe",
      consumption: "850,000",
      unit: "kWh/Jahr",
      tariff: "Business Premium",
      contractStart: "2022-06-20",
      status: "active"
    },
    {
      id: 4,
      name: "Müller, Thomas",
      type: "Privat",
      consumption: "4,100",
      unit: "kWh/Jahr",
      tariff: "Öko",
      contractStart: "2024-09-12",
      status: "active"
    },
    {
      id: 5,
      name: "Bäckerei Weber",
      type: "Gewerbe",
      consumption: "45,000",
      unit: "kWh/Jahr",
      tariff: "Gewerbe Standard",
      contractStart: "2023-11-05",
      status: "active"
    },
    {
      id: 6,
      name: "Fischer, Maria",
      type: "Privat",
      consumption: "2,800",
      unit: "kWh/Jahr",
      tariff: "Öko Plus",
      contractStart: "2024-07-18",
      status: "active"
    },
    {
      id: 7,
      name: "Autohaus Schneider",
      type: "Gewerbe",
      consumption: "120,000",
      unit: "kWh/Jahr",
      tariff: "Business Standard",
      contractStart: "2024-02-28",
      status: "pending"
    },
    {
      id: 8,
      name: "Wagner, Klaus",
      type: "Privat",
      consumption: "3,600",
      unit: "kWh/Jahr",
      tariff: "Basis",
      contractStart: "2023-05-10",
      status: "active"
    }
  ],
  invoices: [
    {
      id: 1001,
      customer: "Stadtwerke München GmbH",
      amount: "125,000.00",
      issueDate: "2025-09-15",
      dueDate: "2025-10-15",
      status: "paid"
    },
    {
      id: 1002,
      customer: "TechCorp Solutions AG",
      amount: "68,500.00",
      issueDate: "2025-09-28",
      dueDate: "2025-10-28",
      status: "pending"
    },
    {
      id: 1003,
      customer: "Bäckerei Weber",
      amount: "3,850.00",
      issueDate: "2025-08-10",
      dueDate: "2025-09-10",
      status: "overdue"
    },
    {
      id: 1004,
      customer: "Schmidt, Anna",
      amount: "285.00",
      issueDate: "2025-10-01",
      dueDate: "2025-10-31",
      status: "pending"
    },
    {
      id: 1005,
      customer: "Autohaus Schneider",
      amount: "12,400.00",
      issueDate: "2025-09-20",
      dueDate: "2025-10-20",
      status: "paid"
    },
    {
      id: 1006,
      customer: "Fischer, Maria",
      amount: "245.00",
      issueDate: "2025-10-05",
      dueDate: "2025-11-05",
      status: "pending"
    },
    {
      id: 1007,
      customer: "Müller, Thomas",
      amount: "320.00",
      issueDate: "2025-09-12",
      dueDate: "2025-10-12",
      status: "paid"
    },
    {
      id: 1008,
      customer: "Wagner, Klaus",
      amount: "298.00",
      issueDate: "2025-08-25",
      dueDate: "2025-09-25",
      status: "overdue"
    },
    {
      id: 1009,
      customer: "TechCorp Solutions AG",
      amount: "71,200.00",
      issueDate: "2025-10-08",
      dueDate: "2025-11-08",
      status: "pending"
    },
    {
      id: 1010,
      customer: "Stadtwerke München GmbH",
      amount: "118,900.00",
      issueDate: "2025-10-10",
      dueDate: "2025-11-10",
      status: "pending"
    }
  ],
  gridLoad: {
    current: 73,
    max: 100,
    unit: "%",
    status: "normal" // normal, warning, critical
  },
  voltageFrequency: {
    voltage: { current: 231.2, target: 230, unit: "V", min: 207, max: 253 },
    frequency: { current: 50.02, target: 50, unit: "Hz", min: 49.8, max: 50.2 }
  },
  loadForecast: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    forecast: [180, 165, 220, 380, 420, 390, 280],
    actual: [175, 168, 225, 375, 415, 395, 285]
  },
  regionalGrid: [
    { id: "nord", name: "Nord", load: 68, status: "normal", capacity: "850 MW" },
    { id: "sued", name: "Süd", load: 82, status: "warning", capacity: "920 MW" },
    { id: "ost", name: "Ost", load: 71, status: "normal", capacity: "780 MW" },
    { id: "west", name: "West", load: 91, status: "critical", capacity: "1050 MW" }
  ],
  transformers: [
    { id: 1, name: "Trafo Station A", load: 94, capacity: "150 MVA", status: "critical" },
    { id: 2, name: "Trafo Station B", load: 87, capacity: "120 MVA", status: "warning" },
    { id: 3, name: "Trafo Station C", load: 76, capacity: "180 MVA", status: "normal" },
    { id: 4, name: "Trafo Station D", load: 68, capacity: "100 MVA", status: "normal" },
    { id: 5, name: "Trafo Station E", load: 55, capacity: "90 MVA", status: "normal" }
  ],
  batteryStorage: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    charging: [20, 35, 45, 15, 0, 0, 10],
    discharging: [0, 0, 0, 25, 40, 35, 20],
    capacity: 100,
    current: 65
  },
  peakDemand: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    today: [180, 165, 220, 380, 420, 390, 280],
    yesterday: [175, 160, 210, 360, 400, 370, 260],
    lastWeek: [170, 155, 205, 350, 390, 360, 250]
  },
  renewableTimeline: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    renewable: [120, 95, 140, 210, 240, 180, 150],
    conventional: [60, 70, 80, 170, 180, 210, 130]
  },
  gridLosses: {
    generation: 1000,
    transmission: 900,
    distribution: 820,
    consumption: 740,
    losses: {
      transmission: 100,
      distribution: 80,
      other: 80
    }
  },
  customerSegments: [
    { name: "Industrie", value: 42, color: "#000099" },
    { name: "Gewerbe", value: 28, color: "#FD951F" },
    { name: "Privat", value: 24, color: "#3b82f6" },
    { name: "Landwirtschaft", value: 6, color: "#10b981" }
  ],
  outages: [
    { id: 1, region: "Nord", zone: "N-12", severity: "low", duration: "2h", affected: 45 },
    { id: 2, region: "Süd", zone: "S-08", severity: "medium", duration: "4h", affected: 230 },
    { id: 3, region: "West", zone: "W-15", severity: "high", duration: "ongoing", affected: 1200 }
  ]
};
