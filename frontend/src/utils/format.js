export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  const n = Number(num);
  if (!Number.isFinite(n)) return '—';
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(n);
};

export const formatPercent = (num, digits = 2) => {
  if (num === null || num === undefined) return '—';
  const n = Number(num);
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(digits)}%`;
};


