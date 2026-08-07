import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import RiskScoring from './pages/RiskScoring';
import CounterfeitDetection from './pages/CounterfeitDetection';
import ReviewModeration from './pages/ReviewModeration';
import AuditLogs from './pages/AuditLogs';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        className: '!bg-surfaceLight !text-white !border !border-white/10 !rounded-xl',
      }} />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="risk-scoring" element={<RiskScoring />} />
          <Route path="counterfeit-detection" element={<CounterfeitDetection />} />
          <Route path="review-moderation" element={<ReviewModeration />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
