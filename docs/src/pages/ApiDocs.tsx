import React, { useState, useMemo } from 'react';
import { metricsData } from '../data/metrics';
import { SearchOutlined } from '@ant-design/icons';

const ApiDocs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Group metrics by category
  const categorizedMetrics = useMemo(() => {
    const groups: Record<string, any[]> = {};
    Object.values(metricsData).forEach(metric => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, []);

  // Filter metrics based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categorizedMetrics;
    
    const lowerQuery = searchQuery.toLowerCase();
    const result: Record<string, any[]> = {};
    
    Object.entries(categorizedMetrics).forEach(([category, metrics]) => {
      // If category matches, include all its metrics
      if (category.toLowerCase().includes(lowerQuery)) {
        result[category] = metrics;
        return;
      }
      
      // Otherwise, filter the metrics inside the category
      const matchedMetrics = metrics.filter(m => 
        m.name.toLowerCase().includes(lowerQuery) || 
        m.description.toLowerCase().includes(lowerQuery) ||
        m.formula.toLowerCase().includes(lowerQuery)
      );
      
      if (matchedMetrics.length > 0) {
        result[category] = matchedMetrics;
      }
    });
    
    return result;
  }, [searchQuery, categorizedMetrics]);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-12 flex flex-col xl:flex-row gap-8 items-start relative">
      
      {/* LEFT SIDEBAR: Searchable Table of Contents (Sticky) */}
      <div className="hidden xl:block w-72 sticky top-6 shrink-0 h-[calc(100vh-100px)] overflow-y-auto pr-4 custom-scrollbar">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">API Reference ToC</h3>
        <nav className="space-y-1 mb-8">
          <a href="#installation" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors">1. Installation</a>
          <a href="#core-api" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors">2. Core API Engine</a>
          <a href="#batch-api" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors">3. Batch & Time-Series</a>
          <a href="#types" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors">4. Type Definitions</a>
          <a href="#metric-dictionary" className="block px-3 py-2 text-sm text-blue-600 font-bold bg-blue-50 rounded-md transition-colors border-l-4 border-blue-500">5. Metric Dictionary</a>
        </nav>

        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Financial Categories</h3>
        <ul className="space-y-4 border-l border-gray-200 ml-2">
          {Object.keys(categorizedMetrics).map(category => (
            <li key={category}>
              <a href={`#category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="block -ml-[1px] pl-4 border-l-2 border-transparent hover:border-blue-500 text-sm text-gray-600 hover:text-blue-600 font-medium">
                {category}
              </a>
              <ul className="mt-2 space-y-2">
                {categorizedMetrics[category].map(m => (
                  <li key={m.id}>
                    <a href={`#metric-${m.id}`} className="block pl-8 text-xs text-gray-500 hover:text-gray-900 truncate">
                      {m.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full min-w-0">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Developer API Documentation</h1>
          <p className="text-xl text-gray-500 font-light max-w-3xl leading-relaxed">
            Embed the <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-lg">finance-calculator-pro</code> engine directly into your software. Everything you need to know about categories, metrics, and implementations—all on a single page.
          </p>
        </div>

        <div className="space-y-16">

          {/* SECTION: Quickstart */}
          <section id="installation" className="scroll-mt-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Installation</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Install the package via npm, yarn, or pnpm. It is compiled to CommonJS and ESM.
                </p>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="bg-[#0f172a] rounded-xl p-6 shadow-xl border border-gray-800">
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
<div><span className="text-green-400">npm</span> install finance-calculator-pro</div>
<br/>
<div><span className="text-gray-500"># Or using yarn</span></div>
<div><span className="text-green-400">yarn</span> add finance-calculator-pro</div>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION: analyzeCompany */}
          <section id="core-api" className="scroll-mt-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. The Core API Engine</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pass a flat <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-red-500 font-mono">CompanySnapshotInput</code> object containing the raw fundamental data of a company. 
                  Setting the second argument to <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">true</code> enables the <span className="font-semibold">Insights Engine</span>.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm text-blue-800 m-0">
                    <strong>Pro Tip:</strong> Any omitted data fields will simply cause their dependent formulas to return <code className="font-mono bg-blue-100 px-1 rounded">null</code>. The engine will never throw an error for missing data.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="bg-[#0f172a] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                  <div className="bg-[#1e293b] text-gray-400 text-xs px-4 py-2 font-mono flex justify-between border-b border-gray-700">
                    <span>index.ts</span>
                    <span>TypeScript</span>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
<div><span className="text-purple-400">import</span> {"{"} analyzeCompany {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">'finance-calculator-pro'</span>;</div>
<br/>
<div><span className="text-gray-500">// 1. Build the data payload</span></div>
<div><span className="text-purple-400">const</span> rawData = {"{"}</div>
<div>  price: <span className="text-yellow-300">150</span>,</div>
<div>  eps: <span className="text-yellow-300">5.50</span>,</div>
<div>  netIncome: <span className="text-yellow-300">1000000</span>,</div>
<div>  totalAssets: <span className="text-yellow-300">5000000</span></div>
<div>{"}"};</div>
<br/>
<div><span className="text-gray-500">// 2. Execute analysis with Insights enabled</span></div>
<div><span className="text-purple-400">const</span> analysis = <span className="text-blue-400">analyzeCompany</span>(rawData, <span className="text-orange-400">true</span>);</div>
<br/>
<div><span className="text-blue-400">console</span>.<span className="text-blue-300">log</span>(analysis.valuation.pe);</div>
<div><span className="text-gray-500">/* Output:</span></div>
<div><span className="text-gray-500">  {"{"}</span></div>
<div><span className="text-gray-500">    value: 27.27,</span></div>
<div><span className="text-gray-500">    status: "Bad",</span></div>
<div><span className="text-gray-500">    insight: "Expensive. High growth is priced in."</span></div>
<div><span className="text-gray-500">  {"}"}</span></div>
<div><span className="text-gray-500">*/</span></div>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION: Batch API */}
          <section id="batch-api" className="scroll-mt-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Batch & Time-Series</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  The engine also includes native support for evaluating arrays of companies simultaneously, and traversing chronological time-series data to extract growth CAGRs.
                </p>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="bg-[#0f172a] rounded-xl shadow-xl border border-gray-800 overflow-hidden h-full">
                  <div className="bg-[#1e293b] text-gray-400 text-xs px-4 py-2 font-mono flex justify-between border-b border-gray-700">
                    <span>batch-analysis.ts</span>
                    <span>TypeScript</span>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
<div><span className="text-purple-400">import</span> {"{"} analyzeBatch, analyzeFundamentalTrends {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">'finance-calculator-pro'</span>;</div>
<br/>
<div><span className="text-gray-500">// Process multiple companies concurrently</span></div>
<div><span className="text-purple-400">const</span> competitors = <span className="text-blue-400">analyzeBatch</span>([appleData, msftData, googleData], <span className="text-orange-400">true</span>);</div>
<br/>
<div><span className="text-gray-500">// Evaluate 3 years of sequential fundamental data [2021, 2022, 2023]</span></div>
<div><span className="text-purple-400">const</span> timeseries = {"{"}</div>
<div>  revenue: [<span className="text-yellow-300">365817</span>, <span className="text-yellow-300">394328</span>, <span className="text-yellow-300">383285</span>],</div>
<div>  netIncome: [<span className="text-yellow-300">94680</span>, <span className="text-yellow-300">99803</span>, <span className="text-yellow-300">96995</span>]</div>
<div>{"}"};</div>
<div><span className="text-purple-400">const</span> trends = <span className="text-blue-400">analyzeFundamentalTrends</span>(timeseries, <span className="text-green-300">'annual'</span>);</div>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION: Response Interfaces */}
          <section id="types" className="scroll-mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Exhaustive Type Definitions</h2>
            <div className="bg-[#0f172a] rounded-xl p-6 shadow-xl border border-gray-800 mb-8">
              <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
<div><span className="text-gray-500">/** The complete input data signature. ALL fields are optional because the engine gracefully skips missing derivations. */</span></div>
<div><span className="text-purple-400">export interface</span> <span className="text-blue-300">CompanySnapshotInput</span> {"{"}</div>
<div>  price?: <span className="text-yellow-300">number</span>;</div>
<div>  marketCap?: <span className="text-yellow-300">number</span>;</div>
<div>  totalRevenue?: <span className="text-yellow-300">number</span>;</div>
<div>  grossProfit?: <span className="text-yellow-300">number</span>;</div>
<div>  operatingIncome?: <span className="text-yellow-300">number</span>;</div>
<div>  netIncome?: <span className="text-yellow-300">number</span>;</div>
<div>  freeCashFlow?: <span className="text-yellow-300">number</span>;</div>
<div>  eps?: <span className="text-yellow-300">number</span>;</div>
<div>  bookValuePerShare?: <span className="text-yellow-300">number</span>;</div>
<div>  revenuePerShare?: <span className="text-yellow-300">number</span>;</div>
<div>  totalAssets?: <span className="text-yellow-300">number</span>;</div>
<div>  totalLiabilities?: <span className="text-yellow-300">number</span>;</div>
<div>  totalEquity?: <span className="text-yellow-300">number</span>;</div>
<div>  totalDebt?: <span className="text-yellow-300">number</span>;</div>
<div>  cashAndEquivalents?: <span className="text-yellow-300">number</span>;</div>
<div>  inventory?: <span className="text-yellow-300">number</span>;</div>
<div>  interestExpense?: <span className="text-yellow-300">number</span>;</div>
<div>  costOfRevenue?: <span className="text-yellow-300">number</span>;</div>
<div>  annualDividendPerShare?: <span className="text-yellow-300">number</span>;</div>
<div>  expectedEarningsGrowthRate?: <span className="text-yellow-300">number</span>;</div>
<div>  ebitda?: <span className="text-yellow-300">number</span>;</div>
<div>  workingCapital?: <span className="text-yellow-300">number</span>;</div>
<div>  retainedEarnings?: <span className="text-yellow-300">number</span>;</div>
<div>  ebit?: <span className="text-yellow-300">number</span>;</div>
<div>  taxRate?: <span className="text-yellow-300">number</span>;</div>
<div>  returns?: <span className="text-yellow-300">number</span>;</div>
<div>  riskFree?: <span className="text-yellow-300">number</span>;</div>
<div>  stdDev?: <span className="text-yellow-300">number</span>;</div>
<div>  analystTargetPrice?: <span className="text-yellow-300">number</span>;</div>
<div>{"}"}</div>
              </pre>
            </div>
          </section>

          <hr className="border-gray-400 border-2" />

          {/* SECTION: Interactive Master Dictionary */}
          <section id="metric-dictionary" className="scroll-mt-10 bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="mb-4 md:mb-0 max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">5. Master Metric Dictionary</h2>
                <p className="text-gray-600">
                  Import any of these standalone formulas natively: <code className="bg-gray-200 px-1 py-0.5 rounded text-red-600 text-sm">import {'{'} roic, wacc {'}'} from 'finance-calculator-pro'</code>. 
                  Search below to find out exactly what each metric does and how the math works natively.
                </p>
              </div>
              <div className="relative w-full md:w-72 mt-4 md:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchOutlined className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                  placeholder="Search 25+ metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {Object.keys(filteredCategories).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No metrics found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(filteredCategories).map(([category, metrics]) => (
                  <div key={category} id={`category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="scroll-mt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-1.5 h-6 bg-blue-500 rounded-r-md mr-3"></span>
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {metrics.map(metric => (
                        <div key={metric.id} id={`metric-${metric.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col scroll-mt-24 transition duration-200 hover:shadow-md hover:border-blue-300">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{metric.name}</h4>
                          <p className="text-sm text-gray-600 mb-4 flex-grow">{metric.description}</p>
                          <div className="mt-auto">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">Native Formula Export</span>
                            <div className="bg-gray-900 text-green-400 px-4 py-3 rounded text-sm font-mono overflow-x-auto whitespace-nowrap shadow-inner">
                              {metric.formula}
                            </div>
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
};

export default ApiDocs;
