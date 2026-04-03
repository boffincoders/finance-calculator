import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDark } from '../App';

const CATEGORIES = [
  {
    label: 'Valuation',
    items: [
      { id: 'pe', label: 'P/E Ratio' },
      { id: 'pb', label: 'P/B Ratio' },
      { id: 'ps', label: 'P/S Ratio' },
      { id: 'peg', label: 'PEG Ratio' },
      { id: 'ev-ebitda', label: 'EV/EBITDA' },
      { id: 'ev-revenue', label: 'EV / Revenue' },
      { id: 'ev-fcf', label: 'EV / Free Cash Flow' },
      { id: 'price-to-cash-flow', label: 'Price-to-Cash-Flow' },
      { id: 'earnings-yield', label: 'Earnings Yield' },
      { id: 'dcf', label: 'Discounted Cash Flow' },
      { id: 'graham', label: 'Graham Number' },
      { id: 'dividend', label: 'Dividend Yield' },
    ],
  },
  {
    label: 'Profitability',
    items: [
      { id: 'roa', label: 'ROA' },
      { id: 'roe', label: 'ROE' },
      { id: 'roic', label: 'ROIC' },
      { id: 'gross-margin', label: 'Gross Margin' },
      { id: 'operating-margin', label: 'Operating Margin' },
      { id: 'net-margin', label: 'Net Profit Margin' },
      { id: 'fcf-margin', label: 'FCF Margin' },
    ],
  },
  {
    label: 'Liquidity',
    items: [
      { id: 'current-ratio', label: 'Current Ratio' },
      { id: 'quick-ratio', label: 'Quick Ratio' },
      { id: 'debt-to-equity', label: 'Debt-to-Equity' },
      { id: 'interest-coverage', label: 'Interest Coverage' },
    ],
  },
  {
    label: 'Solvency',
    items: [
      { id: 'net-debt', label: 'Net Debt' },
      { id: 'net-debt-to-ebitda', label: 'Net Debt / EBITDA' },
      { id: 'debt-to-assets', label: 'Debt-to-Assets' },
    ],
  },
  {
    label: 'Efficiency',
    items: [
      { id: 'asset-turnover', label: 'Asset Turnover' },
      { id: 'inventory-turnover', label: 'Inventory Turnover' },
      { id: 'receivables-turnover', label: 'Receivables Turnover' },
      { id: 'days-sales-outstanding', label: 'Days Sales Outstanding' },
    ],
  },
  {
    label: 'Quality',
    items: [
      { id: 'payout-ratio', label: 'Payout Ratio' },
      { id: 'cash-conversion-ratio', label: 'Cash Conversion Ratio' },
    ],
  },
  {
    label: 'Risk',
    items: [
      { id: 'z-score', label: 'Altman Z-Score' },
      { id: 'sharpe', label: 'Sharpe Ratio' },
      { id: 'piotroski', label: 'Piotroski F-Score' },
      { id: 'target-upside', label: 'Target Upside' },
    ],
  },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h24v24H0V0zm3 3v18h18V3H3zm16 16H5V5h14v14zm-9-2h2V9h-4v8h2z" />
    </svg>
  );
}

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { dark, toggle } = useDark();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    CATEGORIES.forEach(c => { init[c.label] = false; });
    // Auto-expand category of current page
    return init;
  });

  const currentMetricId = location.pathname.startsWith('/metrics/') ? location.pathname.split('/')[2] : null;

  const toggleCat = (label: string) => {
    setExpandedCats(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isMetricActive = (id: string) => location.pathname === `/metrics/${id}`;

  const Sidebar = () => (
    <nav className="flex flex-col h-full overflow-y-auto py-6">
      {/* Logo */}
      <div className="px-5 mb-6">
        <Link to="/" className="flex items-center gap-2 no-underline" onClick={() => setMobileOpen(false)}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-black" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            F
          </div>
          <span className="font-semibold text-[15px]" style={{ color: 'var(--text)' }}>finance-calculator</span>
        </Link>
      </div>

      {/* Top nav links */}
      <div className="px-3 mb-2">
        <NavLink to="/" label="Overview & Playground" onClick={() => setMobileOpen(false)} />
        <NavLink to="/api-docs" label="Developer API Docs" onClick={() => setMobileOpen(false)} />
      </div>

      <div className="mx-5 my-3 border-t" style={{ borderColor: 'var(--border)' }} />

      {/* Metric categories */}
      <div className="px-3 flex-1">
        <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>Metrics</p>
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCats[cat.label] || cat.items.some(i => isMetricActive(i.id));
          return (
            <div key={cat.label} className="mb-1">
              <button
                onClick={() => toggleCat(cat.label)}
                className="w-full flex justify-between items-center px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer"
                style={{ color: 'var(--text-3)', background: 'transparent', border: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
              >
                <span>{cat.label}</span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              {isExpanded && (
                <div className="ml-2 pl-3 mt-0.5 mb-1" style={{ borderLeft: '1px solid var(--border)' }}>
                  {cat.items.map(item => (
                    <Link
                      key={item.id}
                      to={`/metrics/${item.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1 px-2 rounded text-[13px] no-underline transition-colors"
                      style={{
                        color: isMetricActive(item.id) ? 'var(--blue)' : 'var(--text-3)',
                        fontWeight: isMetricActive(item.id) ? '500' : '400',
                        background: isMetricActive(item.id) ? 'var(--blue-bg)' : 'transparent',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom version badge */}
      <div className="px-5 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <a href="https://www.npmjs.com/package/finance-calculator-pro" target="_blank" rel="noreferrer" className="no-underline">
          <img src="https://img.shields.io/npm/v/finance-calculator-pro.svg?style=flat-square&label=npm&color=cb3837" alt="npm" className="h-5" />
        </a>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Fixed Sidebar — desktop */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30"
        style={{ width: '260px', borderRight: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
      >
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex flex-col w-72 h-full" style={{ background: 'var(--bg-subtle)', borderRight: '1px solid var(--border)' }}>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 md:ml-[260px]">
        {/* Top navbar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 h-14"
          style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}
        >
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md mr-3 transition-colors"
            style={{ color: 'var(--text-3)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>

          {/* Breadcrumb / page title hint on desktop */}
          <div className="hidden md:flex items-center gap-2 text-sm" style={{ color: 'var(--text-3)' }}>
            <span className="font-medium" style={{ color: 'var(--text)' }}>finance-calculator-pro</span>
            {currentMetricId && (
              <>
                <span>/</span>
                <span>{currentMetricId}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* GitHub star button */}
            <a
              href="https://github.com/boffincoders/finance-calculator"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium no-underline transition-colors"
              style={{ background: 'var(--bg-muted)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue)'; (e.currentTarget as HTMLElement).style.color = 'var(--blue)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
            >
              <GitHubIcon />
              <span className="hidden sm:inline">Star on GitHub</span>
              <span
                className="hidden sm:flex items-center justify-center text-[11px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'var(--border)', color: 'var(--text-3)', minWidth: '20px' }}
              >
                ★
              </span>
            </a>

            {/* npm badge */}
            <a
              href="https://www.npmjs.com/package/finance-calculator-pro"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium no-underline transition-colors"
              style={{ background: '#cb3837', color: '#fff', border: '1px solid #b83131' }}
            >
              <NpmIcon />
              <span className="hidden sm:inline">npm</span>
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
              style={{ background: 'var(--bg-muted)', color: 'var(--text-3)', border: '1px solid var(--border)', cursor: 'pointer' }}
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 w-full mx-auto">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-4)' }}>
          Open-source financial engine &copy;{new Date().getFullYear()} &mdash; Built by{' '}
          <a href="https://boffincoders.com" target="_blank" rel="noreferrer" className="font-semibold no-underline" style={{ color: 'var(--blue)' }}>
            Boffin Coders
          </a>
          {' '}·{' '}
          <a href="https://github.com/boffincoders/finance-calculator" target="_blank" rel="noreferrer" className="no-underline" style={{ color: 'var(--text-4)' }}>
            GitHub
          </a>
          {' '}·{' '}
          <a href="https://www.npmjs.com/package/finance-calculator-pro" target="_blank" rel="noreferrer" className="no-underline" style={{ color: 'var(--text-4)' }}>
            npm
          </a>
        </footer>
      </div>
    </div>
  );
};

// Reusable top-level nav link
function NavLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-2 py-1.5 rounded-md text-[13px] no-underline transition-colors mb-0.5"
      style={{
        color: active ? 'var(--blue)' : 'var(--text-2)',
        fontWeight: active ? '500' : '400',
        background: active ? 'var(--blue-bg)' : 'transparent',
      }}
    >
      {label}
    </Link>
  );
}

export default AppLayout;
