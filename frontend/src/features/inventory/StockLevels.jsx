import React from 'react';
import { formatNumber } from '../../utils/format';

const sortOptions = [
  { value: 'drr_desc', label: 'DRR Highest to Lowest' },
  { value: 'drr_asc', label: 'DRR Lowest to Highest' },
  { value: 'doh_desc', label: 'DOH Highest to Lowest' },
  { value: 'doh_asc', label: 'DOH Lowest to Highest' },
  { value: 'doc_desc', label: 'DOC Highest to Lowest' },
  { value: 'doc_asc', label: 'DOC Lowest to Highest' },
];

const StockLevels = ({
  data,
  loading,
  error,
  filters,
  options,
  onChangeFilters,
  onRefresh,
}) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Inventory Stock Levels</h2>
        <div className="date-filters">
          <div className="date-input-group">
            <label htmlFor="stock-query-date">Query Date:</label>
            <input
              id="stock-query-date"
              type="date"
              value={filters.query_date || ''}
              onChange={(e) => onChangeFilters({ query_date: e.target.value })}
              className="platform-select"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="stock-sort">Sort:</label>
            <select
              id="stock-sort"
              value={filters.sort || 'drr_desc'}
              onChange={(e) => onChangeFilters({ sort: e.target.value })}
              className="platform-select"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="date-input-group">
            <label htmlFor="stock-platform">Platform:</label>
            <select
              id="stock-platform"
              value={filters.platform || ''}
              onChange={(e) => onChangeFilters({ platform: e.target.value })}
              className="platform-select"
            >
              <option value="">All Platforms</option>
              {(options.platforms || []).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="date-input-group">
            <label htmlFor="stock-brand">Brand:</label>
            <select
              id="stock-brand"
              value={filters.brand || ''}
              onChange={(e) => onChangeFilters({ brand: e.target.value })}
              className="platform-select"
            >
              {(options.brands || []).map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="date-input-group">
            <label htmlFor="stock-supply">Supply Source:</label>
            <select
              id="stock-supply"
              value={filters.supply_source || ''}
              onChange={(e) => onChangeFilters({ supply_source: e.target.value })}
              className="platform-select"
            >
              <option value="">All</option>
              {(options.supply_sources || []).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={onRefresh} className="refresh-btn">Refresh Data</button>
        </div>
      </div>

      {loading && <div className="loading">Loading stock levels...</div>}
      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={onRefresh} className="retry-btn">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Title</th>
                <th>DRR</th>
                <th>DOH</th>
                <th>DOC</th>
                <th>Stock in Hand</th>
                <th>Open PO</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((row, idx) => (
                <tr key={idx}>
                  <td className="sku-cell">{row.sku}</td>
                  <td className="title-cell" title={row.title}>{row.title}</td>
                  <td>{formatNumber(row.drr || 0)}</td>
                  <td>{formatNumber(row.doh || 0)}</td>
                  <td>{formatNumber(row.doc || 0)}</td>
                  <td>{formatNumber(row.stock_in_hand || 0)}</td>
                  <td>{formatNumber(row.open_po || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockLevels;
