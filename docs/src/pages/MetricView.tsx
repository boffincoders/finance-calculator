import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Slider, Statistic, Alert, Badge, Breadcrumb, Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { metricsData } from '../data/metrics';

const MetricView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const metric = id ? metricsData[id] : null;

  // Initialize state inputs based on defaults
  const [inputs, setInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (metric) {
      const initial: Record<string, number> = {};
      metric.inputs.forEach(input => {
        initial[input.key] = input.default;
      });
      setInputs(initial);
    }
  }, [metric]);

  const handleInputChange = (key: string, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  if (!metric) {
    return (
      <Result
        status="404"
        title="Metric Not Configured Yet"
        subTitle={`The playground for the ${id} metric is currently under construction. Please use the analyzeCompany API directly for this metric or check back soon.`}
        extra={<Button type="primary"><Link to="/">Go Home</Link></Button>}
      />
    );
  }

  // Calculate the live value using the imported pure math module
  const liveValue = Object.keys(inputs).length > 0 ? metric.calculate(inputs) : null;
  // Evaluate the live value using the imported evaluator module
  const analysis = (liveValue !== null && !isNaN(liveValue as number)) ? metric.evaluateInsight(liveValue) : null;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item>{metric.category}</Breadcrumb.Item>
        <Breadcrumb.Item>{metric.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Pure Tailwind CSS Grid for layout instead of ANTD Row/Col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">

        {/* Left Col: Explanations & Theory */}
        <div>
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">{metric.name}</h2>
          <p className="text-xl text-gray-500 font-light mb-8 leading-relaxed">
            {metric.description}
          </p>

          <div className="bg-blue-50/50 shadow-sm border border-blue-100 rounded-xl p-6 mb-4 mt-4">
            <span className="uppercase text-xs tracking-wider text-blue-600 font-bold block mb-3">The Architecture & History</span>
            <p className="m-0 text-gray-700 leading-relaxed text-[15px]">
              {metric.history}
            </p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mt-2">
            <span className="uppercase text-xs font-bold tracking-wider block mb-3 text-gray-500">The Mathematical Formula</span>
            <div className="bg-[#0f172a] text-[#4ade80] p-6 rounded-md font-mono text-sm overflow-x-auto whitespace-nowrap shadow-inner border border-gray-800">
              {metric.formula}
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Playground */}
        <div>
          <div className="bg-white shadow-lg border-t-4 border-t-blue-500 border-x border-b border-gray-200 rounded-xl p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-8 pb-4 border-b border-gray-100">
              <span className="text-blue-600 font-semibold mr-2">•</span>Live Mathematical Playground
            </h3>
            <div className="mb-10 space-y-8">
              {metric.inputs.map(input => (
                <div key={input.key}>
                  <div className="flex justify-between mb-2">
                    <label className="font-semibold text-gray-700 text-sm">{input.label}</label>
                    <span className="text-gray-500 font-mono text-sm font-medium">
                      {input.prefix}{inputs[input.key]?.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={inputs[input.key]}
                    onChange={(val) => handleInputChange(input.key, val)}
                    tooltip={{ open: false }}
                  />
                </div>
              ))}
            </div>

            <hr className="border-gray-100 my-8" />

            <div className="bg-gray-50/80 p-8 rounded-xl border border-gray-200 text-center shadow-inner">
              <span className="block mb-2 uppercase text-[11px] font-bold tracking-[0.2em] text-gray-400">Calculated Output</span>
              <Statistic
                value={liveValue}
                precision={2}
                valueStyle={{ fontSize: '3.5rem', lineHeight: 1, fontWeight: 800, color: '#111827' }}
              />

              {analysis && (
                <div className="mt-6 animate-fade-in">
                  <Badge
                    status={analysis.status === 'Good' ? 'success' : analysis.status === 'Bad' ? 'error' : 'processing'}
                    text={<span className="font-bold text-sm ml-1">{analysis.status}</span>}
                  />
                  <p className="text-gray-500 mt-3 text-sm italic leading-relaxed max-w-xs mx-auto">
                    "{analysis.insight}"
                  </p>
                </div>
              )}
            </div>
            <div className='mt-2'>
              <Alert
                className="shadow-sm"
                title={<span className="text-xs text-gray-700">Zero-dependency evaluation powered natively by <code className="bg-white/50 px-1 rounded border border-green-200 text-green-700 font-semibold">finance-calculator-pro</code> inside your browser. No API requests were made.</span>}
                type="success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricView;
