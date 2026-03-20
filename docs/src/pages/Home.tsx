import React, { useState } from 'react';
import { InputNumber, Statistic, Alert, Badge } from 'antd';
import { analyzeCompany } from 'finance-calculator-pro';

const Home: React.FC = () => {
  const [snapshot, setSnapshot] = useState<any>({
    price: 150,
    eps: 5,
    bookValuePerShare: 20,
    revenuePerShare: 50,
    marketCap: 150000,
    totalDebt: 20000,
    cashAndEquivalents: 5000,
    netIncome: 5000,
    totalRevenue: 50000,
    totalAssets: 100000,
    totalLiabilities: 60000,
    totalEquity: 40000,
  });

  const analysis = analyzeCompany(snapshot, true);

  const handleInputChange = (field: string, value: number | null) => {
    setSnapshot((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderMetricCard = (title: string, data: any) => {
    if (!data || data.value === null || data.value === undefined || isNaN(data.value)) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 opacity-50 h-full flex flex-col justify-center">
          <div className="font-semibold text-gray-700 mb-1">{title}</div>
          <span className="text-gray-400 text-sm">N/A - Missing Data</span>
        </div>
      );
    }
    
    let color = 'gray';
    if (data.status === 'Good') color = '#22c55e'; // green-500
    if (data.status === 'Neutral') color = '#3b82f6'; // blue-500
    if (data.status === 'Bad') color = '#ef4444'; // red-500

    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-x border-b border-gray-200 h-full flex flex-col" style={{ borderTopColor: color }}>
        <div className="font-semibold text-gray-800 mb-3">{title}</div>
        <Statistic value={data.value} precision={2} />
        <div className="mt-3">
          <Badge status={data.status === 'Good' ? 'success' : data.status === 'Bad' ? 'error' : 'processing'} text={<span className="font-semibold text-sm">{data.status}</span>} />
        </div>
        <p className="mt-3 text-xs text-gray-500 leading-snug flex-grow">{data.insight}</p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Finance Engine Simulator</h2>
      <p className="text-gray-500 mb-8 text-lg">
        Below is the full power of the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500 font-mono text-sm">analyzeCompany</code> engine. Adjust the raw fundamental snapshot on the left, and watch the entire valuation, profitability, and risk profile recalculate instantly on the right without a single API call.
      </p>

      {/* Replaced ANTD Row/Col with pure Tailwind Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Company Snapshot Input</h3>
            <div className="flex flex-col space-y-4">
              {Object.keys(snapshot).map(key => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize text-gray-700 text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <InputNumber 
                    value={snapshot[key]} 
                    onChange={(val) => handleInputChange(key, val)} 
                    style={{ width: '120px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2">
          <Alert message="Instant Analysis Engine" description="Metrics are evaluated natively based on institutional benchmarks and standard deviation bounds." type="info" showIcon className="mb-8" />
          
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Valuation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
             <div>{renderMetricCard('P/E Ratio', analysis.valuation.pe)}</div>
             <div>{renderMetricCard('P/B Ratio', analysis.valuation.pb)}</div>
             <div>{renderMetricCard('P/S Ratio', analysis.valuation.ps)}</div>
             <div>{renderMetricCard('EV/EBITDA', analysis.valuation.evEbitda)}</div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Profitability</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
             <div>{renderMetricCard('Return on Assets (ROA)', analysis.profitability.roa)}</div>
             <div>{renderMetricCard('Return on Equity (ROE)', analysis.profitability.roe)}</div>
             <div>{renderMetricCard('Net Margin', analysis.profitability.netProfitMargin)}</div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Risk & Liquidity</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <div>{renderMetricCard('Altman Z-Score', analysis.risk.altmanZScore)}</div>
             <div>{renderMetricCard('Current Ratio', analysis.liquidity.currentRatio)}</div>
             <div>{renderMetricCard('Debt to Equity', analysis.liquidity.debtToEquity)}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
