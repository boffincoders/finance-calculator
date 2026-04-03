import { useState, useMemo, useEffect, useRef } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';
import { metricsData } from '../data/metrics';
import { useDark } from '../App';

// ── Shiki code block ────────────────────────────────────────────────────────
let _hl: Highlighter | null = null;
async function getHighlighter(_dark: boolean) {
  if (!_hl) {
    _hl = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'bash', 'json'],
    });
  }
  return _hl;
}

function CodeBlock({ code, lang = 'typescript' }: { code: string; lang?: string }) {
  const { dark } = useDark();
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHighlighter(dark).then(hl => {
      if (!cancelled) {
        setHtml(hl.codeToHtml(code.trim(), {
          lang,
          theme: dark ? 'github-dark' : 'github-light',
        }));
      }
    });
    return () => { cancelled = true; };
  }, [code, lang, dark]);

  const copy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{lang}</span>
        <button
          onClick={copy}
          className="text-[11px] px-2 py-0.5 rounded transition-colors"
          style={{ background: 'var(--bg)', color: copied ? 'var(--green)' : 'var(--text-4)', border: '1px solid var(--border)', cursor: 'pointer' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {html
        ? <div dangerouslySetInnerHTML={{ __html: html }} style={{ fontSize: 13 }} />
        : <pre className="px-5 py-4 text-[13px] font-mono overflow-x-auto" style={{ background: dark ? '#0d1117' : '#f6f8fa', color: 'var(--text-2)', margin: 0 }}>{code.trim()}</pre>
      }
    </div>
  );
}

// ── Shared section components ────────────────────────────────────────────────
function SectionHeading({ id, number, title }: { id: string; number?: string; title: string }) {
  return (
    <div id={id} className="flex items-baseline gap-3 mb-1 scroll-mt-20">
      {number && <span className="text-[13px] font-mono shrink-0" style={{ color: 'var(--text-4)' }}>{number}</span>}
      <h2 className="text-[1.4rem] font-bold tracking-tight m-0" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>{title}</h2>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] leading-relaxed mb-5 mt-2" style={{ color: 'var(--text-3)' }}>{children}</p>;
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 doc-two-col gap-10 mb-12">
      <div className="min-w-0">{left}</div>
      <div className="min-w-0">{right}</div>
    </div>
  );
}

function NullCallout() {
  return (
    <div className="flex items-start gap-3 rounded-lg px-4 py-3 mb-5" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
      <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--blue)' }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p className="text-[13px] m-0 leading-relaxed" style={{ color: 'var(--text-3)' }}>
        All functions return{' '}
        <code className="font-mono text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-subtle)', color: 'var(--blue)', border: '1px solid var(--border)' }}>number | null</code>.{' '}
        <span style={{ color: 'var(--text-2)' }}>Null means a required input was absent</span> — the library never throws. Safe to call with partial data at any time.
      </p>
    </div>
  );
}

function FnTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-mono" style={{ background: 'var(--blue-bg)', color: 'var(--blue)', border: '1px solid var(--blue-border)' }}>
      {name}
    </span>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
const INSTALL_CODE = `npm install finance-calculator-pro
# or
yarn add finance-calculator-pro
pnpm add finance-calculator-pro`;

const CORE_CODE = `import { analyzeCompany } from 'finance-calculator-pro';

const data = {
  price: 150, eps: 5.50,
  netIncome: 1_000_000, totalAssets: 5_000_000,
  totalDebt: 500_000, cashAndEquivalents: 200_000,
};

// Returns 7 categories: valuation, profitability, liquidity,
// solvency, efficiency, risk, quality
const analysis = analyzeCompany(data, true /* withInsights */);

console.log(analysis.valuation.pe);
// { value: 27.27, status: "Bad", insight: "Expensive. High growth is priced in." }

console.log(analysis.solvency.netDebtToEbitda);
// { value: 1.5, status: "Good", insight: "Low leverage. Manageable debt load." }

console.log(analysis.quality.cashConversionRatio);
// { value: 1.4, status: "Good", insight: "Cash-backed earnings. Strong quality." }`;

const CATEGORICAL_CODE = `import {
  analyzeValuation, analyzeSolvency,
  analyzeEfficiency, analyzeQuality,
} from 'finance-calculator-pro';

const data = {
  price: 150, eps: 5,
  totalDebt: 20000, cashAndEquivalents: 5000,
  ebitda: 10000, operatingCashFlow: 7000,
  netIncome: 5000, annualDividendPerShare: 2,
};

// Run only what you need — each function accepts the same input shape
const solvency = analyzeSolvency(data, true);
console.log(solvency.netDebtToEbitda);
// { value: 1.5, status: "Good", insight: "..." }

const quality = analyzeQuality(data, true);
console.log(quality.cashConversionRatio);
// { value: 1.4, status: "Good", insight: "..." }`;

const BATCH_CODE = `import { analyzeBatch, analyzeFundamentalTrends } from 'finance-calculator-pro';

// Evaluate multiple companies at once — returns the same shape as analyzeCompany()
const results = analyzeBatch([appleData, msftData, googleData], true);
results[0].valuation.pe;  // { value: 28.5, status: "Bad", insight: "..." }

// Timeseries growth analysis — pass arrays [oldest → newest]
const trends = analyzeFundamentalTrends({
  revenue:   [365_817, 394_328, 383_285],
  netIncome: [ 94_680,  99_803,  96_995],
}, 'annual');

// Return shape:
// trends.growth.revenueCagr       → number | null  (-2.2% CAGR)
// trends.growth.revenueGrowth     → number[]       [+7.7%, -2.8%]
// trends.growth.netIncomeCagr     → number | null
// trends.margins.netProfitMargin  → number[]       [25.9%, 25.3%, 25.3%]
// trends.quality.fcfConversion    → number[]       (FCF / Net Income per period)
console.log(trends.growth.revenueCagr);   // -0.022
console.log(trends.growth.revenueGrowth); // [0.0777, -0.0282]`;

const TYPES_CODE = `interface CompanySnapshotInput {
  // Pricing
  price?: number;
  marketCap?: number;
  eps?: number;
  bookValuePerShare?: number;
  revenuePerShare?: number;
  annualDividendPerShare?: number;
  analystTargetPrice?: number;

  // Income Statement
  totalRevenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  freeCashFlow?: number;
  operatingCashFlow?: number;
  ebitda?: number;
  ebit?: number;
  costOfRevenue?: number;
  interestExpense?: number;
  expectedEarningsGrowthRate?: number;

  // Balance Sheet
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
  totalDebt?: number;
  longTermDebt?: number;
  cashAndEquivalents?: number;
  inventory?: number;
  tradeReceivables?: number;
  workingCapital?: number;
  retainedEarnings?: number;
  sharesOutstanding?: number;
  taxRate?: number;

  // Risk / Portfolio
  returns?: number;
  riskFree?: number;
  stdDev?: number;
}`;

const SINGLE_CODE = `import {
  pe, pb, ps, peg,
  priceToCashFlow, earningsYield,
  evEbitda, evRevenue, evFcf,
  roa, roe, roic,
  grossMargin, operatingMargin, netProfitMargin,
  currentRatio, quickRatio, debtToEquity,
  netDebt, netDebtToEbitda, debtToAssets,
  assetTurnover, receivablesTurnover, daysSalesOutstanding,
  payableDays, workingCapitalDays, cashConversionCycle,
  payoutRatio, cashConversionRatio,
  altmanZScore, piotroski, sharpe,
  grahamNumber, calculateDCF,
  computeNCVPS, computeIntrinsicValue, computeGFactor,
  evaluate,
} from 'finance-calculator-pro';

// Valuation & Profitability
pe(150, 5);                                    // → 30
priceToCashFlow(150_000, 7_000);               // → 21.43
earningsYield(5, 150);                         // → 0.0333

// Solvency & Efficiency
netDebtToEbitda(20_000, 5_000, 10_000);       // → 1.5
daysSalesOutstanding(50_000, 6_250);           // → 45.6 days
cashConversionCycle(46, 60, 30);              // → 76 days
payableDays(15_000, 120_000);                 // → 45.6 days
workingCapitalDays(20_000, 200_000);          // → 36.5 days

// Intrinsic Valuation
grahamNumber(5, 20);                          // → 47.43
computeNCVPS(80_000, 50_000, 1_000);          // → 30
computeIntrinsicValue(10, 0.12, 0.25);        // → 14.09
computeGFactor(70, 65, 55);                   // → 64.25

// Risk
altmanZScore(15_000, 20_000, 7_500, 250_000, 50_000, 100_000, 60_000); // → 3.71

const result = piotroski({
  netIncome: 5_000, totalAssets: 100_000, operatingCashFlow: 7_000,
  priorNetIncome: 4_000, priorTotalAssets: 100_000,
});
result.score;    // → 4
result.maxScore; // → 5

// Pair raw math with the evaluator
const ratio = pe(150, 5);  // → 30
evaluate.pe(ratio);
// { value: 30, status: "Bad", insight: "Expensive. High growth is priced in." }`;

export default function ApiDocs() {
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const categorized = useMemo(() => {
    const groups: Record<string, typeof metricsData[string][]> = {};
    Object.values(metricsData).forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categorized;
    const out: typeof categorized = {};
    Object.entries(categorized).forEach(([cat, metrics]) => {
      if (cat.toLowerCase().includes(q)) { out[cat] = metrics; return; }
      const hit = metrics.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.formula.toLowerCase().includes(q)
      );
      if (hit.length) out[cat] = hit;
    });
    return out;
  }, [search, categorized]);

  const totalMetrics = Object.values(categorized).reduce((n, ms) => n + ms.length, 0);

  return (
    <div className="flex gap-10 items-start">
      {/* ── Right sticky TOC (hidden on small screens) ── */}
      <div className="hidden xl:block w-56 shrink-0 sticky top-20 self-start" style={{ order: 2 }}>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>On this page</p>
        <nav className="space-y-1" style={{ borderLeft: '1px solid var(--border)' }}>
          {[
            { id: 'installation',    label: 'Installation' },
            { id: 'core-api',        label: 'analyzeCompany' },
            { id: 'categorical-api', label: 'Categorical Analyzers' },
            { id: 'batch-api',       label: 'Batch & Timeseries' },
            { id: 'types',           label: 'Type Definitions' },
            { id: 'single',          label: 'Individual Functions' },
            { id: 'dictionary',      label: 'Metric Dictionary' },
          ].map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="block pl-3 py-1 text-[13px] no-underline transition-colors"
              style={{ color: 'var(--text-4)', borderLeft: '2px solid transparent', marginLeft: -1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-4)'; }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0" style={{ order: 1 }}>
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: 'var(--blue-bg)', color: 'var(--blue)', border: '1px solid var(--blue-border)' }}>
              API Reference
            </span>
          </div>
          <h1 className="text-[2rem] font-bold tracking-tight mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
            Developer Documentation
          </h1>
          <p className="text-[15px] max-w-2xl leading-relaxed" style={{ color: 'var(--text-3)' }}>
            Embed <code className="px-1.5 py-0.5 rounded text-[13px] font-mono" style={{ background: 'var(--bg-muted)', color: 'var(--blue)', border: '1px solid var(--border)' }}>finance-calculator-pro</code> directly into your app.
            Every field is optional — the engine skips metrics it can't compute and returns <code className="font-mono text-[13px]">null</code> safely.
          </p>
        </div>

        <div className="space-y-12">

          {/* 1 · Installation */}
          <section id="installation" className="scroll-mt-20">
            <SectionHeading id="installation" number="01" title="Installation" />
            <Prose>Works with any Node.js ≥ 16 environment. Zero runtime dependencies — ships as CJS + ESM + type declarations.</Prose>
            <CodeBlock code={INSTALL_CODE} lang="bash" />
          </section>

          <Divider />

          {/* 2 · analyzeCompany */}
          <section id="core-api" className="scroll-mt-20">
            <SectionHeading id="core-api" number="02" title="analyzeCompany — the all-in-one API" />
            <TwoCol
              left={
                <>
                  <Prose>
                    Pass a <code className="font-mono text-[13px]">CompanySnapshotInput</code> object with any subset of fields.
                    The second argument enables the <strong>Insights Engine</strong> — each metric returns a structured object with <code className="font-mono text-[13px]">value</code>, <code className="font-mono text-[13px]">status</code>, and <code className="font-mono text-[13px]">insight</code>.
                  </Prose>
                  <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-border)' }}>
                    <p className="text-[13px] font-semibold m-0" style={{ color: 'var(--blue)' }}>Returns 7 categories:</p>
                    {['valuation', 'profitability', 'liquidity', 'solvency', 'efficiency', 'risk', 'quality'].map(c => (
                      <div key={c} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} />
                        <code className="text-[12px] font-mono" style={{ color: 'var(--text-2)' }}>analysis.{c}</code>
                      </div>
                    ))}
                  </div>
                </>
              }
              right={<CodeBlock code={CORE_CODE} />}
            />
          </section>

          <Divider />

          {/* 3 · Categorical */}
          <section id="categorical-api" className="scroll-mt-20">
            <SectionHeading id="categorical-api" number="03" title="Categorical Analyzers" />
            <TwoCol
              left={
                <>
                  <Prose>Run analysis on a single dimension instead of all seven. Useful for dashboards, screeners, or compute-sensitive environments.</Prose>
                  <div className="space-y-2">
                    {[
                      { fn: 'analyzeValuation',    note: 'P/E, P/B, P/S, PEG, EV/EBITDA, Graham, P/CF, EY, EV/Rev, EV/FCF' },
                      { fn: 'analyzeProfitability', note: 'ROA, ROE, ROIC, all margins' },
                      { fn: 'analyzeLiquidity',     note: 'Current, Quick, D/E, Interest Coverage' },
                      { fn: 'analyzeSolvency',      note: 'Net Debt, Net Debt/EBITDA, Debt/Assets' },
                      { fn: 'analyzeEfficiency',    note: 'Asset Turnover, Inventory, DSO, Payable Days, WC Days, CCC' },
                      { fn: 'analyzeRisk',          note: 'Altman Z, Sharpe, Piotroski F-Score' },
                      { fn: 'analyzeQuality',       note: 'Payout Ratio, CCR, Target Upside' },
                    ].map(({ fn, note }) => (
                      <div key={fn} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
                        <FnTag name={fn} />
                        <span className="text-[12px] pt-0.5" style={{ color: 'var(--text-3)' }}>{note}</span>
                      </div>
                    ))}
                  </div>
                </>
              }
              right={<CodeBlock code={CATEGORICAL_CODE} />}
            />
          </section>

          <Divider />

          {/* 4 · Batch */}
          <section id="batch-api" className="scroll-mt-20">
            <SectionHeading id="batch-api" number="04" title="Batch & Timeseries" />
            <TwoCol
              left={
                <Prose>
                  <strong>analyzeBatch</strong> evaluates an array of snapshots in one call — ideal for stock screeners.
                  <br /><br />
                  <strong>analyzeFundamentalTrends</strong> accepts chronological arrays (oldest → newest) and returns YoY/QoQ growth rates and CAGRs automatically.
                </Prose>
              }
              right={<CodeBlock code={BATCH_CODE} />}
            />
          </section>

          <Divider />

          {/* 5 · Types */}
          <section id="types" className="scroll-mt-20">
            <SectionHeading id="types" number="05" title="Type Definitions" />
            <Prose>
              Every field in <code className="font-mono text-[13px]">CompanySnapshotInput</code> is optional.
              Missing fields cause their dependent metrics to return <code className="font-mono text-[13px]">null</code> — the engine never throws.
            </Prose>
            <CodeBlock code={TYPES_CODE} />
          </section>

          <Divider />

          {/* 6 · Individual functions */}
          <section id="single" className="scroll-mt-20">
            <SectionHeading id="single" number="06" title="Individual Math Functions" />
            <Prose>
              Import any function directly for lightweight single-metric use.
              Pair with <code className="font-mono text-[13px]">evaluate.*</code> to get insights without building a full snapshot.
            </Prose>
            <NullCallout />
            <CodeBlock code={SINGLE_CODE} />
          </section>


          <section id="dictionary" className="scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
              <div>
                <SectionHeading id="dictionary" number="07" title="Metric Dictionary" />
                <p className="text-[13px] mt-1 m-0" style={{ color: 'var(--text-4)' }}>
                  {totalMetrics} metrics across {Object.keys(categorized).length} categories
                </p>
              </div>
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-4)' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search metrics… ⌘K"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-lg text-[13px] outline-none transition-colors w-64"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            {Object.keys(filtered).length === 0 ? (
              <div className="text-center py-20 rounded-xl" style={{ border: '1px dashed var(--border)', color: 'var(--text-4)' }}>
                No metrics match "<span style={{ color: 'var(--text-2)' }}>{search}</span>"
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(filtered).map(([category, metrics]) => (
                  <div key={category} id={`cat-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-5 rounded-full" style={{ background: 'var(--blue)' }} />
                      <h3 className="text-[15px] font-semibold m-0" style={{ color: 'var(--text)' }}>{category}</h3>
                      <span className="text-[11px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--bg-muted)', color: 'var(--text-4)' }}>{metrics.length}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {metrics.map(metric => (
                        <div
                          key={metric.id}
                          id={`metric-${metric.id}`}
                          className="rounded-xl p-5 scroll-mt-24 transition-shadow hover:shadow-sm"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="text-[14px] font-semibold m-0" style={{ color: 'var(--text)' }}>{metric.name}</h4>
                            <a
                              href={`/finance-calculator/metrics/${metric.id}`}
                              className="shrink-0 text-[11px] no-underline px-2 py-0.5 rounded transition-colors"
                              style={{ background: 'var(--blue-bg)', color: 'var(--blue)', border: '1px solid var(--blue-border)' }}
                            >
                              Playground →
                            </a>
                          </div>
                          <p className="text-[13px] leading-snug mb-3 m-0" style={{ color: 'var(--text-3)' }}>{metric.description}</p>
                          <div className="rounded-lg px-3 py-2 font-mono text-[12px] overflow-x-auto" style={{ background: 'var(--bg-muted)', color: 'var(--green)' }}>
                            {metric.formula}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="my-0" style={{ borderColor: 'var(--border-subtle)', borderTopWidth: 1 }} />;
}
