export const fraudCasesData = [
  { name: 'Jan', cases: 400, risk: 240 },
  { name: 'Feb', cases: 300, risk: 139 },
  { name: 'Mar', cases: 200, risk: 980 },
  { name: 'Apr', cases: 278, risk: 390 },
  { name: 'May', cases: 189, risk: 480 },
  { name: 'Jun', cases: 239, risk: 380 },
  { name: 'Jul', cases: 349, risk: 430 },
];

export const counterfeitCategories = [
  { name: 'Electronics', value: 400 },
  { name: 'Fashion', value: 300 },
  { name: 'Cosmetics', value: 300 },
  { name: 'Sneakers', value: 200 },
];

export const reviewClassification = [
  { name: 'Genuine', value: 85 },
  { name: 'Fake', value: 10 },
  { name: 'Suspicious', value: 5 },
];

export const auditLogs = [
  { id: 'LOG-001', timestamp: '2023-10-24 10:23', agent: 'Risk Scoring', action: 'Blocked Transaction', decision: 'High Risk', reason: 'Multiple failed CVV attempts', severity: 'high' },
  { id: 'LOG-002', timestamp: '2023-10-24 10:15', agent: 'Authenticity', action: 'Flagged Listing', decision: 'Counterfeit', reason: 'Logo mismatch (98% confidence)', severity: 'high' },
  { id: 'LOG-003', timestamp: '2023-10-24 09:45', agent: 'Review Moderation', action: 'Removed Review', decision: 'Fake', reason: 'AI generated text detected', severity: 'medium' },
  { id: 'LOG-004', timestamp: '2023-10-24 09:30', agent: 'Risk Scoring', action: 'Allowed Transaction', decision: 'Safe', reason: 'Returning trusted customer', severity: 'low' },
  { id: 'LOG-005', timestamp: '2023-10-24 08:12', agent: 'Authenticity', action: 'Approved Listing', decision: 'Authentic', reason: 'All checks passed', severity: 'low' },
];
