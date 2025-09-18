// Utility helpers for date defaults

export const getCurrentMonthStartEnd = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toIso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  return { start: toIso(start), end: toIso(end) };
};

export const getMonthStartEnd = (dateLike) => {
  const d = dateLike ? new Date(dateLike) : new Date();
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const toIso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  return { start: toIso(start), end: toIso(end) };
};

// Calculate number of weeks between two month dates (YYYY-MM format)
export const calculateWeeksBetweenMonths = (monthStart, monthEnd) => {
  if (!monthStart || !monthEnd) return 4; // Default to 4 weeks if dates are missing
  
  const startDate = new Date(monthStart + '-01');
  const endDate = new Date(monthEnd + '-01');
  
  // Set to the last day of the end month
  endDate.setMonth(endDate.getMonth() + 1, 0);
  
  // Calculate the difference in milliseconds
  const diffTime = endDate.getTime() - startDate.getTime();
  
  // Convert to days and then to weeks (rounded up)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(diffDays / 7);
  
  return Math.max(1, weeks); // At least 1 week
};

// Generate week column headers based on number of weeks
export const generateWeekHeaders = (numWeeks) => {
  const headers = [];
  for (let i = 1; i <= numWeeks; i++) {
    headers.push(`W${i}`);
  }
  return headers;
};


