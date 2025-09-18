import React from 'react';

const InventoryMovements = ({
  data,
  loading,
  error,
  filters,
  options,
  onChangeFilters,
  onRefresh,
}) => {
  const platforms = data?.platforms || [];
  const rows = data?.rows || [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Inventory Movements</h2>
        <div className="date-filters">
          <div className="date-input-group">
            <label htmlFor="inv-mov-date">Choose Date:</label>
            <input
              id="inv-mov-date"
              type="date"
              value={filters.query_date || ''}
              onChange={(e) => onChangeFilters({ query_date: e.target.value })}
              className="platform-select"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="inv-mov-supply">Supply City:</label>
            <select
              id="inv-mov-supply"
              value={filters.supply_source || ''}
              onChange={(e) => onChangeFilters({ supply_source: e.target.value })}
              className="platform-select"
            >
              <option value="">All</option>
              {(options?.supply_sources || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="date-input-group">
            <label htmlFor="inv-mov-brand">Brand:</label>
            <select
              id="inv-mov-brand"
              value={filters.brand || ''}
              onChange={(e) => onChangeFilters({ brand: e.target.value })}
              className="platform-select"
            >
              {(options?.brands || []).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <button onClick={onRefresh} className="refresh-btn">Refresh Data</button>
        </div>
      </div>

      {error && (
        <div className="error-banner">{error}</div>
      )}
      {loading && (
        <div className="loading-indicator">Loading...</div>
      )}

      {!loading && !error && (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Metric</th>
                {platforms.map((p) => (
                  <th key={p}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>{row.label}</td>
                  {platforms.map((p) => (
                    <td key={p + '-' + row.key}>{row.counts?.[p] || 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryMovements;


