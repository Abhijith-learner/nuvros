import React, { useEffect, useState } from 'react';
import { fetchHygieneTable } from '../../services/api';
import MultiSelectDropdown from '../../components/common/MultiSelectDropdown';

const HygieneTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    brand: '',
    platform: [],
    hygiene: 'All'
  });
  const [options, setOptions] = useState({
    brands: [],
    platforms: []
  });
  const [hygieneColumns, setHygieneColumns] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const hygieneOptions = [
    'All',
    'Price Hygiene',
    'Coupon Hygiene',
    'Activation_Hygiene',
    'Availability Hygiene',
    'Deal Hygiene',
    'EDD Hygiene',
    'Sold By Validation',
    'Rating Hygiene',
    'Catalog_Hygiene'
  ];

  const commonColumns = [
    'Date', 'Brand', 'Platform', 'SKU Code', 'ASIN', 'Generic Title',
    'Category', 'Sub-category', 'GMV', 'Units'
  ];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchHygieneTable(filters);
      if (response.success) {
        setData(response.data);
        setOptions(response.options);
        setHygieneColumns(response.hygiene_columns);
      } else {
        setError(response.error || 'Failed to load data');
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getColumns = () => {
    let columns = [...commonColumns];

    if (filters.hygiene === 'All') {
      // Include all hygiene-specific columns
      Object.values(hygieneColumns).forEach(hygieneCols => {
        columns = [...columns, ...hygieneCols];
      });
    } else if (hygieneColumns[filters.hygiene]) {
      // Include only columns for selected hygiene type
      columns = [...columns, ...hygieneColumns[filters.hygiene]];
    }

    // Remove duplicates
    return [...new Set(columns)];
  };

  const renderFilters = () => (
    <div className="filters-panel">
      <div className="filters-row">
        <label>
          Start Date
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </label>
        <label>
          Brand
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            {options.brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </label>
        <div className="filter-group">
          <label>Platform</label>
          <MultiSelectDropdown
            options={options.platforms}
            values={filters.platform}
            onChange={(values) => handleFilterChange('platform', values)}
            triggerPlaceholder="Select platforms..."
            selectAllLabel="All Platforms"
          />
        </div>
        <label>
          Hygiene Type
          <select
            value={filters.hygiene}
            onChange={(e) => handleFilterChange('hygiene', e.target.value)}
          >
            {hygieneOptions.map(hygiene => (
              <option key={hygiene} value={hygiene}>{hygiene}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  const renderTable = () => {
    const columns = getColumns();

    if (data.length === 0) {
      return <div className="no-data">No data available</div>;
    }

    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column} title={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map(column => (
                  <td key={column} title={row[column] || '-'}>
                    {row[column] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="hygiene-table-container">
      <div className="table-header">
        <h2>Hygiene Table View</h2>
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && renderFilters()}

      {loading && <div className="loading">Loading table data...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="table-info">
        <p>Showing {data.length} records</p>
        <p>Selected Hygiene: {filters.hygiene}</p>
      </div>

      {renderTable()}
    </div>
  );
};

export default HygieneTable;
