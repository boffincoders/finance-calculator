import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BarChartOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  StockOutlined,
  SettingOutlined,
  CodeOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const MENU_ITEMS = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">Overview & Analyzer</Link>,
  },
  {
    key: '/api-docs',
    icon: <CodeOutlined />,
    label: <Link to="/api-docs">Developer API Docs</Link>,
  },
  {
    key: 'valuation',
    icon: <StockOutlined />,
    label: 'Valuation Metrics',
    children: [
      { key: '/metrics/pe', label: <Link to="/metrics/pe">P/E Ratio</Link> },
      { key: '/metrics/pb', label: <Link to="/metrics/pb">P/B Ratio</Link> },
      { key: '/metrics/ps', label: <Link to="/metrics/ps">P/S Ratio</Link> },
      { key: '/metrics/peg', label: <Link to="/metrics/peg">PEG Ratio</Link> },
      { key: '/metrics/ev-ebitda', label: <Link to="/metrics/ev-ebitda">EV/EBITDA</Link> },
      { key: '/metrics/dcf', label: <Link to="/metrics/dcf">Discounted Cash Flow</Link> },
      { key: '/metrics/graham', label: <Link to="/metrics/graham">Graham Number</Link> },
      { key: '/metrics/dividend', label: <Link to="/metrics/dividend">Dividend Yield</Link> },
    ],
  },
  {
    key: 'profitability',
    icon: <BarChartOutlined />,
    label: 'Profitability',
    children: [
      { key: '/metrics/roa', label: <Link to="/metrics/roa">Return on Assets (ROA)</Link> },
      { key: '/metrics/roe', label: <Link to="/metrics/roe">Return on Equity (ROE)</Link> },
      { key: '/metrics/roic', label: <Link to="/metrics/roic">ROIC</Link> },
      { key: '/metrics/gross-margin', label: <Link to="/metrics/gross-margin">Gross Margin</Link> },
      { key: '/metrics/operating-margin', label: <Link to="/metrics/operating-margin">Operating Margin</Link> },
      { key: '/metrics/net-margin', label: <Link to="/metrics/net-margin">Net Profit Margin</Link> },
      { key: '/metrics/fcf-margin', label: <Link to="/metrics/fcf-margin">FCF Margin</Link> },
    ],
  },
  {
    key: 'liquidity',
    icon: <LineChartOutlined />,
    label: 'Liquidity & Solvency',
    children: [
      { key: '/metrics/current-ratio', label: <Link to="/metrics/current-ratio">Current Ratio</Link> },
      { key: '/metrics/quick-ratio', label: <Link to="/metrics/quick-ratio">Quick Ratio</Link> },
      { key: '/metrics/debt-to-equity', label: <Link to="/metrics/debt-to-equity">Debt-to-Equity</Link> },
      { key: '/metrics/interest-coverage', label: <Link to="/metrics/interest-coverage">Interest Coverage</Link> },
    ],
  },
  {
    key: 'efficiency',
    icon: <SettingOutlined />,
    label: 'Efficiency',
    children: [
      { key: '/metrics/asset-turnover', label: <Link to="/metrics/asset-turnover">Asset Turnover</Link> },
      { key: '/metrics/inventory-turnover', label: <Link to="/metrics/inventory-turnover">Inventory Turnover</Link> },
    ],
  },
  {
    key: 'risk',
    icon: <SafetyCertificateOutlined />,
    label: 'Risk & Quality',
    children: [
      { key: '/metrics/z-score', label: <Link to="/metrics/z-score">Altman Z-Score</Link> },
      { key: '/metrics/sharpe', label: <Link to="/metrics/sharpe">Sharpe Ratio</Link> },
      { key: '/metrics/target-upside', label: <Link to="/metrics/target-upside">Target Upside</Link> },
    ],
  }
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        width={260}
        className="border-r border-gray-200"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-white">
          <h1 className="text-lg font-bold m-0 text-blue-600">
            {collapsed ? 'FCP' : 'Finance Engine'}
          </h1>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={MENU_ITEMS}
          className="border-none mt-2"
        />
      </Sider>
      <Layout>
        <Header className="bg-[#001529] px-6 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-white text-lg tracking-wide">finance-calculator-pro</span>
            <div className="flex items-center space-x-4 border-l border-gray-600 pl-4 ml-2">
              <a href="https://github.com/boffincoders/finance-calculator" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors font-bold text-xl tracking-tighter" title="GitHub Repository">
                GitHub
              </a>
              <a href="https://www.npmjs.com/package/finance-calculator-pro" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors font-bold text-xl tracking-tighter" title="NPM Package">
                npm
              </a>
            </div>
          </div>
          <div>
            <Button type="primary" size="large" href="https://boffincoders.com" target="_blank">
              Hire Boffin Coders
            </Button>

          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          <Outlet />
        </Content>
        <Footer className="text-center text-sm text-gray-500">
          Open Source Financial Engine ©{new Date().getFullYear()} Created by <a href="https://boffincoders.com" className="font-semibold text-blue-600">Boffin Coders</a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
