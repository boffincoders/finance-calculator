import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Home from './pages/Home';
import MetricView from './pages/MetricView';
import ApiDocs from './pages/ApiDocs';

// Dark mode context
export const DarkModeContext = createContext<{ dark: boolean; toggle: () => void }>({
  dark: false,
  toggle: () => {},
});
export const useDark = () => useContext(DarkModeContext);

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dark', String(dark));
  }, [dark]);

  return (
    <DarkModeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <BrowserRouter basename="/finance-calculator">
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="api-docs" element={<ApiDocs />} />
            <Route path="metrics/:id" element={<MetricView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeContext.Provider>
  );
}

export default App;
