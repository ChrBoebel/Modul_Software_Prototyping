import { useState } from 'react';
import {
  RefreshCw,
  Clock,
  Gift,
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  User,
  ChevronRight
} from 'lucide-react';
import { mockData } from '../../../data/mockData';
import { theme } from '../../../theme/colors';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const RetentionOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('timers');

  const lifecycleTimers = mockData.lifecycleTimers || [];
  const referralProgram = mockData.referralProgram || {};
  const churnRisk = mockData.churnRisk || {};
  const customerSatisfaction = mockData.customerSatisfaction || {};

  // Calculate stats
  const totalReferrals = referralProgram.stats?.totalReferrals || 0;
  const successfulReferrals = referralProgram.stats?.successfulReferrals || 0;
  const potentialChurnValue = churnRisk.metrics?.potentialChurnValue || 0;
  const retentionRate = churnRisk.metrics?.retentionRate || 0;
  const npsScore = customerSatisfaction.npsScore || 0;

  const getRiskBadge = (riskLevel) => {
    const styles = {
      high: { bg: 'var(--danger-light)', color: 'var(--danger)', label: 'Hoch' },
      medium: { bg: 'var(--warning-light)', color: 'var(--warning)', label: 'Mittel' },
      low: { bg: 'var(--success-light)', color: 'var(--success)', label: 'Niedrig' }
    };
    return styles[riskLevel] || styles.low;
  };

  const getRiskColor = (score) => {
    if (score >= 70) return theme.colors.danger;
    if (score >= 50) return theme.colors.slate500;
    return theme.colors.secondary;
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.active) return { label: 'Inaktiv', color: 'var(--text-tertiary)' };
    if (coupon.used >= coupon.usageLimit) return { label: 'Ausgeschöpft', color: 'var(--danger)' };
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    if (validUntil < now) return { label: 'Abgelaufen', color: 'var(--danger)' };
    return { label: 'Aktiv', color: 'var(--success)' };
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Code "${code}" kopiert`, 'success');
  };

  const npsTrend = customerSatisfaction.npsTrend || [];

  return (
    <div className="retention-overview">
      <h2 className="sr-only">Retention Übersicht</h2>
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon variant-success" aria-hidden="true">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{retentionRate}%</span>
            <span className="kpi-label">Retention-Rate</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon variant-secondary" aria-hidden="true">
            <Gift size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{successfulReferrals}</span>
            <span className="kpi-label">Erfolgreiche Empfehlungen</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon variant-warning" aria-hidden="true">
            <AlertTriangle size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{(potentialChurnValue / 1000).toFixed(0)}k €</span>
            <span className="kpi-label">Churn-Risiko (Wert)</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon variant-secondary" aria-hidden="true">
            <Star size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{npsScore}</span>
            <span className="kpi-label">NPS Score</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs" role="tablist">
        <button
          className={`section-tab ${activeTab === 'timers' ? 'active' : ''}`}
          onClick={() => setActiveTab('timers')}
          role="tab"
          aria-selected={activeTab === 'timers'}
        >
          <Clock size={16} aria-hidden="true" />
          Lifecycle-Timer
        </button>
        <button
          className={`section-tab ${activeTab === 'referral' ? 'active' : ''}`}
          onClick={() => setActiveTab('referral')}
          role="tab"
          aria-selected={activeTab === 'referral'}
        >
          <Gift size={16} aria-hidden="true" />
          Empfehlungsprogramm
        </button>
        <button
          className={`section-tab ${activeTab === 'churn' ? 'active' : ''}`}
          onClick={() => setActiveTab('churn')}
          role="tab"
          aria-selected={activeTab === 'churn'}
        >
          <AlertTriangle size={16} aria-hidden="true" />
          Churn-Risiko
        </button>
        <button
          className={`section-tab ${activeTab === 'nps' ? 'active' : ''}`}
          onClick={() => setActiveTab('nps')}
          role="tab"
          aria-selected={activeTab === 'nps'}
        >
          <Star size={16} aria-hidden="true" />
          Kundenzufriedenheit
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'timers' && (
        <div className="timers-section" role="tabpanel">
          <div className="card">
            <div className="card-header">
              <h3>Lifecycle-Timer</h3>
              <button className="btn btn-primary" onClick={() => showToast('Timer-Erstellung in Entwicklung', 'info')}>
                <Plus size={16} aria-hidden="true" />
                Neuer Timer
              </button>
            </div>
            <div className="timers-grid">
              {lifecycleTimers.map(timer => (
                <div key={timer.id} className="timer-card">
                  <div className="timer-header">
                    <div className="timer-icon" aria-hidden="true">
                      <Clock size={20} />
                    </div>
                    <div className="timer-info">
                      <h4>{timer.name}</h4>
                      <p>{timer.description}</p>
                    </div>
                    <label className="toggle" aria-label={`Timer ${timer.name} aktivieren/deaktivieren`}>
                      <input type="checkbox" checked={timer.active} readOnly />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="timer-config">
                    <div className="config-item">
                      <Calendar size={14} aria-hidden="true" />
                      <span>
                        {timer.triggerType === 'contract_end'
                          ? `${timer.triggerMonthsBefore} Monate vor Vertragsende`
                          : timer.triggerType === 'anniversary'
                            ? 'Jährlich'
                            : `${Math.abs(timer.triggerMonthsBefore)} Monate nach ${timer.triggerType}`}
                      </span>
                    </div>
                    <div className="config-item">
                      <Mail size={14} aria-hidden="true" />
                      <span>E-Mail senden</span>
                    </div>
                  </div>
                  <div className="timer-stats">
                    <div className="stat">
                      <span className="stat-value">{timer.triggered}</span>
                      <span className="stat-label">Ausgelöst</span>
                    </div>
                    <div className="stat highlight">
                      <span className="stat-value">{timer.converted}</span>
                      <span className="stat-label">Konvertiert</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">
                        {timer.triggered > 0 ? ((timer.converted / timer.triggered) * 100).toFixed(0) : 0}%
                      </span>
                      <span className="stat-label">Rate</span>
                    </div>
                  </div>
                  <div className="timer-actions">
                    <button className="btn btn-sm btn-secondary" aria-label={`${timer.name} bearbeiten`}>
                      <Edit2 size={14} aria-hidden="true" />
                      Bearbeiten
                    </button>
                    <button className="btn btn-sm btn-secondary" aria-label={`${timer.name} löschen`}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'referral' && (
        <div className="referral-section" role="tabpanel">
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Aktive Gutscheincodes</h3>
                <button className="btn btn-primary" onClick={() => showToast('Code-Erstellung in Entwicklung', 'info')}>
                  <Plus size={16} aria-hidden="true" />
                  Neuer Code
                </button>
              </div>
              <div className="coupons-list">
                {referralProgram.coupons?.map(coupon => {
                  const status = getCouponStatus(coupon);
                  return (
                    <div key={coupon.id} className="coupon-card">
                      <div className="coupon-header">
                        <code className="coupon-code">{coupon.code}</code>
                        <button
                          className="btn btn-sm btn-icon"
                          onClick={() => copyCouponCode(coupon.code)}
                          aria-label={`Code ${coupon.code} kopieren`}
                        >
                          <Copy size={14} aria-hidden="true" />
                        </button>
                        <span className="coupon-status" style={{ color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                      <p className="coupon-description">{coupon.description}</p>
                      <div className="coupon-details">
                        <span className="coupon-discount">
                          {coupon.discountType === 'percent'
                            ? `${coupon.discount}% Rabatt`
                            : `${coupon.discount}€ Rabatt`}
                        </span>
                        <span className="coupon-usage">
                          {coupon.used} / {coupon.usageLimit} verwendet
                        </span>
                        <span className="coupon-valid">
                          Gültig bis: {coupon.validUntil}
                        </span>
                      </div>
                      <div className="coupon-progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${(coupon.used / coupon.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Empfehlungs-Netzwerk</h3>
              </div>
              <div className="referral-stats-summary">
                <div className="stat-box">
                  <span className="stat-value">{referralProgram.stats?.totalReferrals || 0}</span>
                  <span className="stat-label">Gesamt Empfehlungen</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{referralProgram.stats?.successfulReferrals || 0}</span>
                  <span className="stat-label">Erfolgreich</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{referralProgram.stats?.conversionRate || 0}%</span>
                  <span className="stat-label">Rate</span>
                </div>
                <div className="stat-box highlight">
                  <span className="stat-value">{(referralProgram.stats?.revenueGenerated / 1000).toFixed(0)}k €</span>
                  <span className="stat-label">Umsatz</span>
                </div>
              </div>
              <div className="referral-tree">
                {referralProgram.referralTree?.map(referrer => (
                  <div key={referrer.referrerId} className="referrer-node">
                    <div className="referrer-header">
                      <div className="referrer-info">
                        <User size={16} />
                        <span className="referrer-name">{referrer.referrerName}</span>
                      </div>
                      <span className="referrer-reward">{referrer.totalReward}€ Prämie</span>
                    </div>
                    <div className="referrals-list">
                      {referrer.referrals.map((ref, index) => (
                        <div key={index} className="referral-item">
                          <ChevronRight size={14} />
                          <span className="ref-name">{ref.customerName}</span>
                          <span className="ref-product">{ref.product}</span>
                          <span className={`ref-status ${ref.status}`}>
                            {ref.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {ref.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'}
                          </span>
                          {ref.value > 0 && (
                            <span className="ref-value">{ref.value.toLocaleString('de-DE')}€</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'churn' && (
        <div className="churn-section">
          <div className="card">
            <div className="card-header">
              <h3>Abwanderungsrisiko</h3>
              <div className="churn-summary">
                <span className="risk-count high">{churnRisk.metrics?.highRiskCount || 0} Hoch</span>
                <span className="risk-count medium">{churnRisk.metrics?.mediumRiskCount || 0} Mittel</span>
                <span className="risk-count low">{churnRisk.metrics?.lowRiskCount || 0} Niedrig</span>
              </div>
            </div>
            <div className="churn-metrics-bar">
              <div className="metric-card">
                <span className="metric-value">{churnRisk.metrics?.expiringNext30Days || 0}</span>
                <span className="metric-label">Ablauf in 30 Tagen</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{churnRisk.metrics?.expiringNext60Days || 0}</span>
                <span className="metric-label">Ablauf in 60 Tagen</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{churnRisk.metrics?.expiringNext90Days || 0}</span>
                <span className="metric-label">Ablauf in 90 Tagen</span>
              </div>
              <div className="metric-card highlight">
                <span className="metric-value">{(churnRisk.metrics?.potentialChurnValue / 1000).toFixed(0)}k €</span>
                <span className="metric-label">Gefährdeter Wert</span>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Kunde</th>
                    <th>Vertragsende</th>
                    <th>Risiko-Score</th>
                    <th>Risiko-Stufe</th>
                    <th>Risikofaktoren</th>
                    <th>Wert</th>
                    <th>Empfehlung</th>
                  </tr>
                </thead>
                <tbody>
                  {churnRisk.atRiskCustomers?.map(customer => {
                    const badge = getRiskBadge(customer.riskLevel);
                    return (
                      <tr key={customer.customerId}>
                        <td>
                          <div className="customer-info">
                            <strong>{customer.name}</strong>
                            <span>{customer.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-info">
                            <span>{customer.contractEnd}</span>
                            <span className="days-until">in {customer.daysUntilEnd} Tagen</span>
                          </div>
                        </td>
                        <td>
                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{
                                width: `${customer.riskScore}%`,
                                backgroundColor: getRiskColor(customer.riskScore)
                              }}
                            />
                            <span>{customer.riskScore}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                        </td>
                        <td>
                          <div className="risk-factors">
                            {customer.riskFactors.map((factor, index) => (
                              <span key={index} className="risk-factor">{factor}</span>
                            ))}
                          </div>
                        </td>
                        <td><strong>{customer.contractValue.toLocaleString('de-DE')} €</strong></td>
                        <td>
                          <span className="recommendation">{customer.recommendedAction}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nps' && (
        <div className="nps-section">
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Net Promoter Score (NPS)</h3>
              </div>
              <div className="nps-display">
                <div className="nps-score-large">
                  <span className="score">{npsScore}</span>
                  <span className="label">NPS Score</span>
                </div>
                <div className="nps-breakdown">
                  <div className="nps-segment promoters">
                    <span className="percentage">{customerSatisfaction.promoters || 0}%</span>
                    <span className="label">Promotoren (9-10)</span>
                  </div>
                  <div className="nps-segment passives">
                    <span className="percentage">{customerSatisfaction.passives || 0}%</span>
                    <span className="label">Passive (7-8)</span>
                  </div>
                  <div className="nps-segment detractors">
                    <span className="percentage">{customerSatisfaction.detractors || 0}%</span>
                    <span className="label">Kritiker (0-6)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>NPS-Trend</h3>
              </div>
              <div className="chart-container" style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={npsTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--text-secondary)" />
                    <YAxis domain={[0, 100]} stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="score" name="NPS" stroke={theme.colors.info} strokeWidth={2} dot={{ fill: theme.colors.info }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card full-width">
              <div className="card-header">
                <h3>Neuestes Feedback</h3>
              </div>
              <div className="feedback-list">
                {customerSatisfaction.recentFeedback?.map(feedback => (
                  <div key={feedback.id} className="feedback-item">
                    <div className="feedback-score" style={{
                      backgroundColor: feedback.score >= 9 ? 'var(--success-light)' : feedback.score >= 7 ? 'var(--warning-light)' : 'var(--danger-light)',
                      color: feedback.score >= 9 ? 'var(--success)' : feedback.score >= 7 ? 'var(--warning)' : 'var(--danger)'
                    }}>
                      {feedback.score}
                    </div>
                    <div className="feedback-content">
                      <div className="feedback-header">
                        <strong>{feedback.customerName}</strong>
                        <span>{feedback.date}</span>
                      </div>
                      <p>{feedback.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionOverview;
