import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { metricsData } from '../data/metrics';
import { useDark } from '../App';

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

export default function MetricView() {
  const { id } = useParams<{ id: string }>();
  const metric = id ? metricsData[id] : null;
  const { dark } = useDark();
  const [inputs, setInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (metric) {
      const init: Record<string, number> = {};
      metric.inputs.forEach(i => { init[i.key] = i.default; });
      setInputs(init);
    }
  }, [metric]);

  if (!metric) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Playground coming soon</h2>
        <p className="text-[14px] max-w-sm mb-6" style={{ color: 'var(--text-3)' }}>
          The interactive playground for <code className="font-mono px-1">{id}</code> isn't configured yet. Use <code className="font-mono px-1">analyzeCompany()</code> directly.
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg text-[13px] font-medium no-underline transition-colors"
          style={{ background: 'var(--blue)', color: '#fff' }}
        >
          ← Back to playground
        </Link>
      </div>
    );
  }

  const liveValue = Object.keys(inputs).length > 0 ? metric.calculate(inputs) : null;
  const analysis  = (liveValue !== null && !isNaN(liveValue as number)) ? metric.evaluateInsight(liveValue) : null;
  const statusColor = analysis ? (STATUS_COLORS[analysis.status] ?? 'var(--text-3)') : 'var(--text-3)';
  const statusBg    = analysis ? (STATUS_BG[analysis.status]    ?? 'var(--bg-muted)') : 'var(--bg-muted)';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] mb-6" style={{ color: 'var(--text-4)' }}>
        <Link to="/" className="no-underline hover:underline" style={{ color: 'var(--text-4)' }}>Home</Link>
        <span>/</span>
        <span>{metric.category}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{metric.name}</span>
      </div>

      {/* Title */}
      <h1 className="text-[1.85rem] font-bold tracking-tight mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
        {metric.name}
      </h1>
      <p className="text-[15px] mb-8 max-w-xl leading-relaxed" style={{ color: 'var(--text-3)' }}>
        {metric.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: theory */}
        <div className="space-y-4">
          {/* History card */}
          <div className="rounded-xl p-5" style={{ border: '1px solid var(--blue-border)', background: 'var(--blue-bg)' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--blue)' }}>Background</p>
            <p className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--text-2)' }}>{metric.history}</p>
          </div>

          {/* Formula */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>Formula</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="px-5 py-4" style={{ background: '#0d1117' }}>
              <code className="text-[14px] font-mono" style={{ color: '#4ade80' }}>{metric.formula}</code>
            </div>
          </div>

          {/* Benchmark callout */}
          {metric.benchmark && (
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: dark ? '#2d1f00' : '#fefce8',
                border: `1px solid ${dark ? '#78350f' : '#fde68a'}`,
              }}
            >
              <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--yellow)' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--yellow)' }}>Benchmark Thresholds</p>
                <p className="text-[13px] leading-relaxed m-0" style={{ color: dark ? '#fde68a' : '#92400e' }}>{metric.benchmark}</p>
              </div>
            </div>
          )}

          {/* Category badge */}
          <div>
            <span
              className="inline-flex items-center text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider"
              style={{ background: 'var(--bg-muted)', color: 'var(--text-3)', border: '1px solid var(--border)' }}
            >
              {metric.category}
            </span>
          </div>
        </div>

        {/* Right: playground */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--blue)' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'var(--text-2)' }}>Live Playground</span>
          </div>

          {/* Sliders */}
          <div className="px-5 py-5 space-y-6">
            {metric.inputs.map(input => (
              <div key={input.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-medium" style={{ color: 'var(--text-2)' }}>{input.label}</label>
                  <span
                    className="text-[13px] font-mono font-semibold px-2 py-0.5 rounded"
                    style={{ background: 'var(--bg-muted)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {input.prefix || ''}{inputs[input.key]?.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={inputs[input.key] ?? input.default}
                  onChange={e => setInputs(prev => ({ ...prev, [input.key]: Number(e.target.value) }))}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>{input.min.toLocaleString()}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>{input.max.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Result */}
          <div
            className="mx-5 mb-5 rounded-xl p-6 text-center"
            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-4)' }}>
              Result
            </p>
            <div className="text-[3.5rem] font-black tabular-nums leading-none" style={{ color: 'var(--text)', letterSpacing: '-0.04em' }}>
              {liveValue !== null && !isNaN(liveValue as number)
                ? (liveValue as number).toFixed(2)
                : '—'}
            </div>

            {analysis && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-center">
                  <span
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}30` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: statusColor }} />
                    {analysis.status}
                  </span>
                </div>
                <p className="text-[13px] italic max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  "{analysis.insight}"
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div
            className="px-5 py-3 flex items-center gap-2 text-[12px]"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-4)', background: 'var(--bg-subtle)' }}
          >
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--green)', flexShrink: 0 }}>
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 15v-5H9l3-7 3 7h-2v5h-2z"/>
            </svg>
            Computed natively by <code className="font-mono px-1">finance-calculator-pro</code> — zero API calls
          </div>
        </div>
      </div>
    </div>
  );
}
