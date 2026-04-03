import { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeCompany } from 'finance-calculator-pro';

const STATUS_COLORS: Record<string, string> = {
  Good:    'var(--green)',
  Bad:     'var(--red)',
  Neutral: 'var(--blue)',
};

const STATUS_BG: Record<string, string> = {
  Good:    '#f0fdf4',
  Bad:     '#fef2f2',
  Neutral: 'var(--blue-bg)',
};

function MetricCard({ title, data, metricId }: { title: string; data: any; metricId?: string }) {
  if (!data || data.value === null || data.value === undefined || (typeof data.value === 'number' && isNaN(data.value))) {
    return (
      <div className="rounded-xl p-5 flex flex-col" style={{ border: '1px dashed var(--border)', background: 'var(--bg-subtle)' }}>
        <div className="text-[12px] font-medium mb-3" style={{ color: 'var(--text-3)' }}>{title}</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold" style={{ color: 'var(--text-4)' }}>—</span>
        </div>
        <p className="text-[11px] mt-2 m-0" style={{ color: 'var(--text-4)' }}>Missing required input</p>
        {metricId && (
          <Link
            to={`/metrics/${metricId}`}
            className="mt-3 text-[11px] no-underline"
            style={{ color: 'var(--blue)' }}
          >
            See formula →
          </Link>
        )}
      </div>
    );
  }

  const color = STATUS_COLORS[data.status] ?? 'var(--text-3)';
  const bg    = STATUS_BG[data.status]    ?? 'var(--bg-muted)';

  return (
    <div
      className="rounded-xl p-5 flex flex-col"
      style={{ border: '1px solid var(--border)', borderTop: `3px solid ${color}`, background: 'var(--bg)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>{title}</div>
        {metricId && (
          <Link to={`/metrics/${metricId}`} className="text-[10px] no-underline shrink-0" style={{ color: 'var(--text-4)' }}>
            Explore →
          </Link>
        )}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
        {typeof data.value === 'number' ? data.value.toFixed(2) : data.value}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: bg, color }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
          {data.status}
        </span>
      </div>
      {data.insight && (
        <p className="mt-2 text-[12px] leading-snug" style={{ color: 'var(--text-3)' }}>{data.insight}</p>
      )}
    </div>
  );
}

const SNAPSHOT_FIELDS: { key: string; label: string; prefix?: string }[] = [
  { key: 'price',              label: 'Share Price',        prefix: '₹ / $' },
  { key: 'eps',                label: 'EPS',                prefix: '$' },
  { key: 'bookValuePerShare',  label: 'Book Value/Share',   prefix: '$' },
  { key: 'revenuePerShare',    label: 'Revenue/Share',      prefix: '$' },
  { key: 'marketCap',          label: 'Market Cap',         prefix: '$' },
  { key: 'totalDebt',          label: 'Total Debt',         prefix: '$' },
  { key: 'cashAndEquivalents', label: 'Cash & Equivalents', prefix: '$' },
  { key: 'ebitda',             label: 'EBITDA',             prefix: '$' },
  { key: 'ebit',               label: 'EBIT',               prefix: '$' },
  { key: 'netIncome',          label: 'Net Income',         prefix: '$' },
  { key: 'operatingCashFlow',  label: 'Operating Cash Flow',prefix: '$' },
  { key: 'totalRevenue',       label: 'Total Revenue',      prefix: '$' },
  { key: 'totalAssets',        label: 'Total Assets',       prefix: '$' },
  { key: 'totalLiabilities',   label: 'Total Liabilities',  prefix: '$' },
  { key: 'totalEquity',        label: 'Total Equity',       prefix: '$' },
  { key: 'workingCapital',     label: 'Working Capital',    prefix: '$' },
  { key: 'retainedEarnings',   label: 'Retained Earnings',  prefix: '$' },
];

const DEFAULT_SNAPSHOT: Record<string, number> = {
  price: 150, eps: 5, bookValuePerShare: 20, revenuePerShare: 50,
  marketCap: 150000, totalDebt: 20000, cashAndEquivalents: 5000,
  ebitda: 9000, ebit: 7500,
  netIncome: 5000, operatingCashFlow: 7500,
  totalRevenue: 50000, totalAssets: 100000,
  totalLiabilities: 60000, totalEquity: 40000,
  workingCapital: 20000, retainedEarnings: 15000,
};

const SECTIONS = [
  {
    title: 'Valuation',
    metrics: [
      { key: 'pe',       label: 'P/E Ratio',  path: 'valuation.pe',       metricId: 'pe' },
      { key: 'pb',       label: 'P/B Ratio',  path: 'valuation.pb',       metricId: 'pb' },
      { key: 'ps',       label: 'P/S Ratio',  path: 'valuation.ps',       metricId: 'ps' },
      { key: 'evEbitda', label: 'EV/EBITDA',  path: 'valuation.evEbitda', metricId: 'ev-ebitda' },
    ],
  },
  {
    title: 'Profitability',
    metrics: [
      { key: 'roa',             label: 'Return on Assets', path: 'profitability.roa',             metricId: 'roa' },
      { key: 'roe',             label: 'Return on Equity', path: 'profitability.roe',             metricId: 'roe' },
      { key: 'netProfitMargin', label: 'Net Margin',       path: 'profitability.netProfitMargin', metricId: 'net-profit-margin' },
    ],
  },
  {
    title: 'Liquidity',
    metrics: [
      { key: 'currentRatio', label: 'Current Ratio', path: 'liquidity.currentRatio', metricId: 'current-ratio' },
      { key: 'debtToEquity', label: 'Debt / Equity',  path: 'liquidity.debtToEquity', metricId: 'debt-to-equity' },
      { key: 'netDebtToEbitda', label: 'Net Debt / EBITDA', path: 'solvency.netDebtToEbitda', metricId: 'net-debt-to-ebitda' },
    ],
  },
  {
    title: 'Risk',
    metrics: [
      { key: 'altmanZScore',    label: 'Altman Z-Score',    path: 'risk.altmanZScore',          metricId: 'altman-z' },
      { key: 'debtToAssets',    label: 'Debt / Assets',     path: 'solvency.debtToAssets',      metricId: 'debt-to-assets' },
      { key: 'cashConversionRatio', label: 'Cash Conversion', path: 'quality.cashConversionRatio', metricId: 'cash-conversion-ratio' },
    ],
  },
];

function getPath(obj: any, path: string): any {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

export default function Home() {
  const [snapshot, setSnapshot] = useState<Record<string, number>>(DEFAULT_SNAPSHOT);

  const analysis = analyzeCompany(snapshot as any, true);

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: 'var(--blue-bg)', color: 'var(--blue)', border: '1px solid var(--blue-border)' }}
          >
            Live Playground
          </span>
        </div>
        <h1 className="text-[2rem] font-bold tracking-tight mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Financial Analysis Playground
        </h1>
        <p className="text-[15px] max-w-2xl leading-relaxed" style={{ color: 'var(--text-3)' }}>
          Enter a company's fundamental data and watch every metric recalculate instantly —
          powered entirely by{' '}
          <code className="px-1.5 py-0.5 rounded text-[13px] font-mono" style={{ background: 'var(--bg-muted)', color: 'var(--blue)', border: '1px solid var(--border)' }}>finance-calculator-pro</code>{' '}
          in your browser. No API calls, no servers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-1 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wider m-0" style={{ color: 'var(--text-4)' }}>
              Company Snapshot
            </h2>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            {SNAPSHOT_FIELDS.map(field => (
              <div key={field.key} className="flex items-center justify-between gap-3">
                <label className="text-[12px] shrink-0" style={{ color: 'var(--text-2)' }}>{field.label}</label>
                <div className="flex items-center rounded-md overflow-hidden min-w-0" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
                  {field.prefix && (
                    <span className="px-1.5 text-[11px] shrink-0" style={{ color: 'var(--text-4)', borderRight: '1px solid var(--border)', background: 'var(--bg-muted)' }}>
                      {field.prefix}
                    </span>
                  )}
                  <input
                    type="number"
                    value={snapshot[field.key]}
                    onChange={e => setSnapshot(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    className="w-20 px-2 py-1.5 text-[12px] font-mono outline-none bg-transparent"
                    style={{ color: 'var(--text)', minWidth: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[11px] m-0" style={{ color: 'var(--text-4)' }}>
              All fields feed directly into <code className="font-mono">analyzeCompany()</code>
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-[13px]"
            style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', color: 'var(--blue)' }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Metrics are evaluated against institutional benchmarks. Thresholds vary by industry.
          </div>

          {SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-4)' }}>
                {section.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {section.metrics.map(m => (
                  <MetricCard key={m.key} title={m.label} data={getPath(analysis, m.path)} metricId={m.metricId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
