import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, ArrowUpRight, Globe, Mail, MousePointer, Share2, Search, Link2 } from 'lucide-react';
import { theme, chartColors } from '../../../theme/colors';
import { Tooltip } from '../../ui/Tooltip';

const TrafficTab = ({ showToast }) => {
  const [filterPeriod, setFilterPeriod] = useState('7d');

  // Mock traffic data by source - using brand color palette
  const trafficBySource = [
    { source: 'Google Ads', besucher: 12500, leads: 340, icon: MousePointer },
    { source: 'Facebook', besucher: 8900, leads: 180, icon: Share2 },
    { source: 'Direkt', besucher: 6200, leads: 95, icon: Globe },
    { source: 'Email', besucher: 4100, leads: 220, icon: Mail },
    { source: 'Organic', besucher: 3500, leads: 85, icon: Search },
    { source: 'Referral', besucher: 1200, leads: 42, icon: Link2 }
  ];

  // Mock traffic timeline data
  const trafficTimeline = [
    { date: 'Mo', besucher: 4200, leads: 120 },
    { date: 'Di', besucher: 5100, leads: 145 },
    { date: 'Mi', besucher: 4800, leads: 132 },
    { date: 'Do', besucher: 5500, leads: 168 },
    { date: 'Fr', besucher: 6200, leads: 185 },
    { date: 'Sa', besucher: 3800, leads: 95 },
    { date: 'So', besucher: 3100, leads: 78 }
  ];

  // Calculate totals
  const totals = useMemo(() => {
    const totalBesucher = trafficBySource.reduce((sum, s) => sum + s.besucher, 0);
    const totalLeads = trafficBySource.reduce((sum, s) => sum + s.leads, 0);
    const conversionRate = ((totalLeads / totalBesucher) * 100).toFixed(1);
    const topSource = trafficBySource.reduce((max, s) => s.besucher > max.besucher ? s : max, trafficBySource[0]);
    const maxBesucher = Math.max(...trafficBySource.map(s => s.besucher));

    return { totalBesucher, totalLeads, conversionRate, topSource, maxBesucher };
  }, []);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          padding: '12px 16px',
          minWidth: '140px'
        }}>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '13px',
            fontWeight: 600,
            color: theme.colors.slate700
          }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: entry.color
              }} />
              <span style={{ fontSize: '12px', color: theme.colors.slate500 }}>
                {entry.name}:
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.slate700 }}>
                {entry.value.toLocaleString('de-DE')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 className="sr-only">Traffic Analysen</h2>

      {/* Header with Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: theme.colors.slate800
        }}>
          Traffic Übersicht
        </h3>
        <select
          id="traffic-period-filter"
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          style={{
            padding: '8px 12px',
            paddingRight: '32px',
            fontSize: '13px',
            fontWeight: 500,
            border: `1px solid ${theme.colors.slate200}`,
            borderRadius: '8px',
            background: 'white',
            color: theme.colors.slate700,
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center'
          }}
        >
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="90d">Letzte 90 Tage</option>
        </select>
      </div>

      {/* KPI Summary Row - matching StartTab style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        {/* Besucher */}
        <Tooltip content="Summe aller Website-Besucher aus allen Quellen" position="bottom">
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: `1px solid ${theme.colors.slate100}`,
            cursor: 'help'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: theme.colors.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={18} color={theme.colors.primary} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: theme.colors.slate500, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Besucher
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 700, color: theme.colors.slate800 }}>
                  {totals.totalBesucher.toLocaleString('de-DE')}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} color={theme.colors.secondary} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.secondary }}>+12.5%</span>
              <span style={{ fontSize: '11px', color: theme.colors.slate400, marginLeft: '4px' }}>vs. Vorwoche</span>
            </div>
          </div>
        </Tooltip>

        {/* Leads */}
        <Tooltip content="Anzahl generierter Kontaktanfragen" position="bottom">
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: `1px solid ${theme.colors.slate100}`,
            cursor: 'help'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: theme.colors.secondaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={18} color={theme.colors.secondary} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: theme.colors.slate500, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Leads
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 700, color: theme.colors.slate800 }}>
                  {totals.totalLeads.toLocaleString('de-DE')}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} color={theme.colors.secondary} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.secondary }}>+8.2%</span>
              <span style={{ fontSize: '11px', color: theme.colors.slate400, marginLeft: '4px' }}>vs. Vorwoche</span>
            </div>
          </div>
        </Tooltip>

        {/* Conversion Rate */}
        <Tooltip content="Berechnung: (Leads / Besucher) × 100" position="bottom">
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: `1px solid ${theme.colors.slate100}`,
            cursor: 'help'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: theme.colors.slate100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowUpRight size={18} color={theme.colors.slate600} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: theme.colors.slate500, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Conversion
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 700, color: theme.colors.slate800 }}>
                  {totals.conversionRate}%
                </p>
              </div>
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: theme.colors.slate400 }}>Besucher → Lead</span>
            </div>
          </div>
        </Tooltip>

        {/* Top Quelle */}
        <Tooltip content="Traffic-Quelle mit den meisten Besuchern" position="bottom">
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: `1px solid ${theme.colors.slate100}`,
            cursor: 'help'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: theme.colors.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MousePointer size={18} color={theme.colors.primary} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: theme.colors.slate500, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Top Quelle
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 700, color: theme.colors.slate800 }}>
                  {totals.topSource.source}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: theme.colors.slate400 }}>{totals.topSource.besucher.toLocaleString('de-DE')} Besucher</span>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: '16px'
      }}>
        {/* Traffic Verlauf Chart */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: `1px solid ${theme.colors.slate100}`
        }}>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.colors.slate700
          }}>
            Traffic Verlauf
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficTimeline}>
              <defs>
                <linearGradient id="colorBesucher" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.12}/>
                  <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.secondary} stopOpacity={0.12}/>
                  <stop offset="95%" stopColor={theme.colors.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate100} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={theme.colors.slate300}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={theme.colors.slate300}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="besucher"
                stroke={theme.colors.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBesucher)"
                name="Besucher"
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke={theme.colors.secondary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLeads)"
                name="Leads"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: `1px solid ${theme.colors.slate100}`
        }}>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.colors.slate700
          }}>
            Traffic nach Quelle
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {trafficBySource.map((source, index) => {
              const Icon = source.icon;
              const percentage = ((source.besucher / totals.maxBesucher) * 100).toFixed(0);
              const convRate = ((source.leads / source.besucher) * 100).toFixed(1);
              const isHighConversion = parseFloat(convRate) > 3;

              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: theme.colors.slate100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={14} color={theme.colors.slate600} />
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: theme.colors.slate700
                      }}>
                        {source.source}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: theme.colors.slate800
                    }}>
                      {source.besucher.toLocaleString('de-DE')}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: theme.colors.slate100,
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: theme.colors.primary,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px'
                  }}>
                    <span style={{ fontSize: '11px', color: theme.colors.slate400 }}>
                      {source.leads} Leads
                    </span>
                    <Tooltip content="Conversion-Rate dieser Quelle" position="left">
                      <span style={{
                        fontSize: '11px',
                        color: isHighConversion ? theme.colors.secondary : theme.colors.slate400,
                        fontWeight: isHighConversion ? 600 : 400,
                        cursor: 'help'
                      }}>
                        {convRate}% Conv.
                      </span>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficTab;
