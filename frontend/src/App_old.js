// Add ESLint disable comment at the top to suppress react-hooks/exhaustive-deps and no-unused-vars warnings
/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import * as XLSX from 'xlsx';

function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') || '');
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '', full_name: '' });
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const [data, setData] = useState([]);
  const [targetData, setTargetData] = useState([]);
  const [totalGrowthRate, setTotalGrowthRate] = useState(null);
  const [totalCitiesLiveOverall, setTotalCitiesLiveOverall] = useState(0);
  const [totalArticlesOverall, setTotalArticlesOverall] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetLoading, setTargetLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetError, setTargetError] = useState(null);
  const [activeModule, setActiveModule] = useState('sales');
  const [activeTab, setActiveTab] = useState('overall');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState({ sales: true }); // Track which modules are expanded
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-31');
  
  // DRR Report state
  const [drrData, setDrrData] = useState([]);
  const [drrLoading, setDrrLoading] = useState(false);
  const [drrError, setDrrError] = useState(null);
  const [drrStartDate, setDrrStartDate] = useState('2025-07-01');
  const [drrEndDate, setDrrEndDate] = useState('2025-07-31');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSupplySource, setSelectedSupplySource] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [availableSupplySources, setAvailableSupplySources] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  
  // Platform Sales Summary state
  const [platformSummaryData, setPlatformSummaryData] = useState([]);
  const [platformSummaryLoading, setPlatformSummaryLoading] = useState(false);
  const [platformSummaryError, setPlatformSummaryError] = useState(null);
  const [platformSummaryStartDate, setPlatformSummaryStartDate] = useState('2025-07-01');
  const [platformSummaryEndDate, setPlatformSummaryEndDate] = useState('2025-07-31');
  const [selectedPlatformSummary, setSelectedPlatformSummary] = useState('');
  const [availablePlatformsSummary, setAvailablePlatformsSummary] = useState([]);

  // Platform Sales Report state
  const [platformReportData, setPlatformReportData] = useState([]);
  const [platformReportLoading, setPlatformReportLoading] = useState(false);
  const [platformReportError, setPlatformReportError] = useState(null);
  const [platformReportMonth, setPlatformReportMonth] = useState('2025-07');
  const [selectedPlatformReport, setSelectedPlatformReport] = useState('');
  const [availablePlatformsReport, setAvailablePlatformsReport] = useState([]);
  const [selectedMetricReport, setSelectedMetricReport] = useState('gmv');
  const [salesPerfView, setSalesPerfView] = useState('target'); // 'target' | 'weekly'
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState(null);
  
  // Sales Contribution state
  const [contribData, setContribData] = useState([]);
  const [contribLoading, setContribLoading] = useState(false);
  const [contribError, setContribError] = useState(null);
  const [contribStartDate, setContribStartDate] = useState('2025-07-01');
  const [contribEndDate, setContribEndDate] = useState('2025-07-31');
  const [selectedContribPlatforms, setSelectedContribPlatforms] = useState([]); // multi-select
  
  // Sales Contribution pagination state
  const [contribCurrentPage, setContribCurrentPage] = useState(1);
  const [contribPageSize, setContribPageSize] = useState(20);
  const [contribPagination, setContribPagination] = useState({
    current_page: 1,
    page_size: 20,
    total_count: 0,
    total_pages: 1,
    has_previous: false,
    has_next: false
  });
  const [availableContribPlatforms, setAvailableContribPlatforms] = useState([]);
  const [contribDropdownOpen, setContribDropdownOpen] = useState(false);
  const [contribSearch, setContribSearch] = useState('');
  
  // Daily Report state
  const [dailyReportData, setDailyReportData] = useState([]);
  const [dailyReportLoading, setDailyReportLoading] = useState(false);
  const [dailyReportError, setDailyReportError] = useState(null);
  const [dailyReportStartDate, setDailyReportStartDate] = useState('2025-07-01');
  const [dailyReportEndDate, setDailyReportEndDate] = useState('2025-07-31');
  const [selectedDailyReportPlatform, setSelectedDailyReportPlatform] = useState('');
  const [availableDailyReportPlatforms, setAvailableDailyReportPlatforms] = useState([]);
  const [dailyReportDates, setDailyReportDates] = useState([]);
  const [selectedDailyReportMetric, setSelectedDailyReportMetric] = useState('gmv');
  const [dailyReportView, setDailyReportView] = useState('platform_item_id'); // 'platform_item_id' | 'supply_source' | 'supply_city'
  
  // Daily Report pagination state
  const [dailyReportCurrentPage, setDailyReportCurrentPage] = useState(1);
  const [dailyReportPageSize, setDailyReportPageSize] = useState(20);
  const [dailyReportPagination, setDailyReportPagination] = useState({
    current_page: 1,
    page_size: 20,
    total_count: 0,
    total_pages: 1,
    has_previous: false,
    has_next: false,
  });
  
  // Download loading states
  const [downloadLoading, setDownloadLoading] = useState({
    salesSummary: false,
    drr: false,
    platformSummary: false,
    platformReport: false,
    weekly: false,
    salesContribution: false,
    dailyReport: false
  });
  
  // Sorting state per table (kept minimal; Overall Sales Summary sorting disabled)
  const [sortState, setSortState] = useState({
    drr: { key: null, direction: 'asc' },
    platformSummary: { key: null, direction: 'asc' },
    platformReport: { key: null, direction: 'asc' },
    weekly: { key: null, direction: 'asc' },
    salesContribution: { key: null, direction: 'asc' }
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 20,
    total_count: 0,
    total_pages: 1,
    has_previous: false,
    has_next: false
  });

  // Add brand filter state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [availableBrands, setAvailableBrands] = useState(['Origami']);
  const [availableOverallPlatforms, setAvailableOverallPlatforms] = useState([]);

  const modules = [
    {
      key: 'sales',
      label: 'Sales',
      icon: '📊',
      tabs: [
        { key: 'overall', label: 'Overall Sales Summary' },
        { key: 'drr', label: 'DRR Report' },
        { key: 'platformSummary', label: 'Platform Sales Summary' },
        { key: 'platformReport', label: 'Sales Performance' },
        { key: 'salesContribution', label: 'Sales Contribution' },
        { key: 'dailyReport', label: 'Daily Report' }
      ]
    },
    {
      key: 'inventory',
      label: 'Inventory',
      icon: '📦',
      tabs: [
        { key: 'inventory-overview', label: 'Inventory Overview' },
        { key: 'stock-levels', label: 'Stock Levels' },
        { key: 'inventory-movements', label: 'Inventory Movements' }
      ]
    },
    {
      key: 'po',
      label: 'PO',
      icon: '📋',
      tabs: [
        { key: 'po-overview', label: 'PO Overview' },
        { key: 'po-tracking', label: 'PO Tracking' },
        { key: 'po-analytics', label: 'PO Analytics' }
      ]
    },
    {
      key: 'ads',
      label: 'Ads',
      icon: '📢',
      tabs: [
        { key: 'ads-overview', label: 'Ads Overview' },
        { key: 'campaign-performance', label: 'Campaign Performance' },
        { key: 'ads-analytics', label: 'Ads Analytics' }
      ]
    },
    {
      key: 'hygiene',
      label: 'Hygiene',
      icon: '🧼',
      tabs: [
        { key: 'hygiene-overview', label: 'Hygiene Overview' },
        { key: 'quality-metrics', label: 'Quality Metrics' },
        { key: 'compliance-reports', label: 'Compliance Reports' }
      ]
    }
  ];

  // Helper functions for navigation
  const getCurrentModule = () => modules.find(m => m.key === activeModule);
  const getCurrentTabs = () => getCurrentModule()?.tabs || [];
  const getCurrentTab = () => getCurrentTabs().find(t => t.key === activeTab);
  
  const toggleModuleExpansion = (moduleKey) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
      fetchTargetData();
    }
  }, [startDate, endDate, authToken, selectedBrand]);

  useEffect(() => {
    if (!authToken) return;
    if (activeTab === 'drr') {
      fetchDrrData();
    }
  }, [activeTab, drrStartDate, drrEndDate, selectedPlatform, selectedCity, selectedSupplySource, selectedCategory, selectedSubCategory, currentPage, pageSize, authToken, selectedBrand]);

  useEffect(() => {
    if (!authToken) return;
    if (activeTab === 'platformSummary') {
      fetchPlatformSummaryData();
    }
  }, [activeTab, platformSummaryStartDate, platformSummaryEndDate, selectedPlatformSummary, authToken]);

  useEffect(() => {
    if (!authToken) return;
    if (activeTab === 'salesContribution') {
      fetchSalesContribution();
    }
    if (activeTab === 'platformReport') {
      if (salesPerfView === 'target') {
        fetchPlatformReportData();
      } else {
        fetchWeeklyData();
      }
      if (availablePlatformsReport.length === 0) {
        fetchPlatformsForReport();
      }
    }
  }, [activeTab, platformReportMonth, selectedPlatformReport, selectedMetricReport, salesPerfView, authToken]);

  useEffect(() => {
    if (!authToken) return;
    if (activeTab === 'salesContribution') {
      fetchSalesContribution();
    }
  }, [activeTab, contribStartDate, contribEndDate, selectedContribPlatforms, contribCurrentPage, contribPageSize, authToken]);

  useEffect(() => {
    if (!authToken) return;
    if (activeTab === 'dailyReport') {
      fetchDailyReport();
    }
  }, [activeTab, dailyReportStartDate, dailyReportEndDate, selectedDailyReportPlatform, selectedDailyReportMetric, dailyReportView, authToken]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [drrStartDate, drrEndDate, selectedPlatform]);

  // Reset Sales Contribution to first page when filters change
  useEffect(() => {
    if (contribCurrentPage !== 1) {
      setContribCurrentPage(1);
    }
  }, [contribStartDate, contribEndDate, selectedContribPlatforms]);

  // Reset Daily Report to first page when filters change
  useEffect(() => {
    if (dailyReportCurrentPage !== 1) {
      setDailyReportCurrentPage(1);
    }
  }, [dailyReportStartDate, dailyReportEndDate, selectedDailyReportPlatform, selectedDailyReportMetric, dailyReportView]);

  const apiBaseURL = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000/api/' : 'https://nuvr.purpleblock.ai/api/');
  const api = axios.create({
    baseURL: apiBaseURL,
  });

  // Flag to prevent multiple refresh attempts
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    
    failedQueue = [];
  };

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If we're already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token available');
          }

          // Attempt to refresh the token
          const refreshResponse = await axios.post(`${apiBaseURL}auth/refresh/`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (refreshResponse.data.success && refreshResponse.data.token) {
            const newToken = refreshResponse.data.token;
            localStorage.setItem('token', newToken);
            setAuthToken(newToken);
            
            // Show success notification
            setTokenRefreshed(true);
            setTimeout(() => setTokenRefreshed(false), 3000);
            
            // Process the queue
            processQueue(null, newToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          // Token refresh failed, logout user
          processQueue(refreshError, null);
          localStorage.removeItem('token');
          setAuthToken('');
          setError('Session expired. Please log in again.');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  // Proactive token refresh - refresh token 1 hour before expiry
  const refreshTokenProactively = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Decode token to check expiry (without verification for client-side check)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return;

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // Refresh if token expires within the next hour (3600000 ms)
      if (timeUntilExpiry <= 3600000 && timeUntilExpiry > 0) {
        const refreshResponse = await axios.post(`${apiBaseURL}auth/refresh/`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (refreshResponse.data.success && refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
          setAuthToken(refreshResponse.data.token);
          
          // Show success notification
          setTokenRefreshed(true);
          setTimeout(() => setTokenRefreshed(false), 3000);
          console.log('Token refreshed proactively');
        }
      }
    } catch (error) {
      console.log('Proactive token refresh failed:', error.message);
      // Don't logout on proactive refresh failure, let the interceptor handle it
    }
  };

  // Set up interval for proactive token refresh (check every 10 minutes)
  useEffect(() => {
    if (authToken) {
      const refreshInterval = setInterval(refreshTokenProactively, 600000); // 10 minutes
      return () => clearInterval(refreshInterval);
    }
  }, [authToken]);

  // Utility function to check if error is authentication-related
  const isAuthError = (error) => {
    return error.response?.status === 401 || 
           error.message?.toLowerCase().includes('token') ||
           error.message?.toLowerCase().includes('unauthorized');
  };

  // Indian numbering formatter: full number with en-IN grouping, no L/Cr suffixes, no decimals
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '—';
    const n = Number(num);
    if (!Number.isFinite(n)) return '—';
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(n);
  };

  // XLSX export helper
  const exportToXlsx = (fileName, rows, sheetName = 'Sheet1') => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = Array.isArray(rows) && rows.length && Array.isArray(rows[0])
        ? XLSX.utils.aoa_to_sheet(rows)
        : XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, fileName);
    } catch (e) {
      // Non-blocking export failure
      console.error('Failed to export XLSX', e);
    }
  };

  // Download handlers per table (current view only)
  const handleDownloadSalesSummary = async () => {
    if (!Array.isArray(data) || data.length === 0) return;
    
    setDownloadLoading(prev => ({ ...prev, salesSummary: true }));
    try {
      let platforms = data.map(item => item.platform);
      const totalGMV = data.reduce((sum, item) => sum + (item.sales_gmv || 0), 0);
      const totalUnits = data.reduce((sum, item) => sum + (item.sales_units || 0), 0);
      const totalASP = totalUnits > 0 ? totalGMV / totalUnits : 0;
      const platformToItem = data.reduce((acc, item) => { acc[item.platform] = item; return acc; }, {});

      const header = ['Metric', ...platforms, 'Total'];
      const rowGMV = ['Sales GMV', ...platforms.map(p => formatNumber((platformToItem[p]?.sales_gmv) || 0)), formatNumber(totalGMV)];
      const rowUnits = ['Sales Units', ...platforms.map(p => formatNumber((platformToItem[p]?.sales_units) || 0)), formatNumber(totalUnits)];
      const rowASP = ['ASP', ...platforms.map(p => {
        const item = platformToItem[p] || {};
        const asp = item.sales_units > 0 ? item.sales_gmv / item.sales_units : 0;
        return formatNumber(asp);
      }), formatNumber(totalASP)];
      const rowGrowthRate = ['Growth Rate', ...platforms.map(p => {
        const item = platformToItem[p] || {};
        const growthRate = item.growth_rate;
        if (growthRate === null || growthRate === undefined) {
          return 'No Data';
        }
        return `${growthRate}%`;
      }), totalGrowthRate === null || totalGrowthRate === undefined ? 'No Data' : `${totalGrowthRate}%`];

      const file = `overall_sales_summary_${startDate || 'all'}_${endDate || 'all'}.xlsx`;
      exportToXlsx(file, [header, rowGMV, rowUnits, rowASP, rowGrowthRate], 'Overall Summary');
    } finally {
      setDownloadLoading(prev => ({ ...prev, salesSummary: false }));
    }
  };

  const fetchAllDrrData = async () => {
    try {
      let allData = [];
      let currentPage = 1;
      let hasMoreData = true;
      
      while (hasMoreData) {
        const params = {
          page: currentPage,
          page_size: 100 // Use the same page size as the UI
        };
        if (drrStartDate) params.start_date = drrStartDate;
        if (drrEndDate) params.end_date = drrEndDate;
        if (selectedPlatform) params.platform = selectedPlatform;
        if (selectedCity) params.city = selectedCity;
        if (selectedSupplySource) params.supply_source = selectedSupplySource;
        if (selectedCategory) params.category = selectedCategory;
        
        const response = await api.get('/drr-report/', { params });
        if (response.data.success && response.data.data) {
          allData = [...allData, ...response.data.data];
          
          // Check if there are more pages
          const pagination = response.data.pagination;
          if (pagination && currentPage < pagination.total_pages) {
            currentPage++;
          } else {
            hasMoreData = false;
          }
        } else {
          hasMoreData = false;
        }
      }
      
      return allData;
    } catch (err) {
      console.error('Failed to fetch all DRR data:', err);
      return [];
    }
  };

  const handleDownloadDrr = async () => {
    setDownloadLoading(prev => ({ ...prev, drr: true }));
    try {
      const allData = await fetchAllDrrData();
      if (allData.length === 0) {
        console.log('No data to export');
        return;
      }
      
      console.log(`Exporting ${allData.length} DRR records`);
      
      const s = sortState.drr;
      const sorted = Array.isArray(allData) ? [...allData] : [];
      if (s && s.key) sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
      
      const header = ['Platform Item ID', 'Title', 'Platform', 'DRR', 'Last 7 Days DRR', 'GMV', 'Units', 'Remark'];
      const rows = sorted.map(item => [
        item.platform_item_id,
        item.title,
        item.platform,
        formatNumber(item.drr || 0),
        formatNumber(item.last_7_days_drr || 0),
        formatNumber(item.total_gmv || 0),
        formatNumber(item.total_units || 0),
        item.last_7_days_drr > item.drr ? 'Growing' : 'Need Attention'
      ]);
      const file = `drr_report_${drrStartDate || ''}_${drrEndDate || ''}.xlsx`;
      exportToXlsx(file, [header, ...rows], 'DRR');
    } finally {
      setDownloadLoading(prev => ({ ...prev, drr: false }));
    }
  };

  const fetchAllPlatformSummaryData = async () => {
    try {
      // Platform summary doesn't seem to have pagination based on the regular fetch function
      const params = {};
      if (platformSummaryStartDate) params.start_date = platformSummaryStartDate;
      if (platformSummaryEndDate) params.end_date = platformSummaryEndDate;
      if (selectedPlatformSummary) params.platform = selectedPlatformSummary;
      
      const response = await api.get('/platform-sales-summary/', { params });
      return response.data.success ? response.data.data : [];
    } catch (err) {
      console.error('Failed to fetch all Platform Summary data:', err);
      return [];
    }
  };

  const handleDownloadPlatformSummary = async () => {
    setDownloadLoading(prev => ({ ...prev, platformSummary: true }));
    try {
      const allData = await fetchAllPlatformSummaryData();
      if (allData.length === 0) return;
      
      const s = sortState.platformSummary;
      const sorted = Array.isArray(allData) ? [...allData] : [];
      if (s && s.key) sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
      
      const header = ['Category', 'DRR', 'Last 7 days Avg', 'GMV', 'Units', 'ASP'];
      const rows = sorted.map(item => [
        item.category,
        formatNumber(item.drr || 0),
        formatNumber(item.last_7_days_avg || 0),
        formatNumber(item.total_gmv || 0),
        formatNumber(item.total_units || 0),
        formatNumber(item.asp || 0)
      ]);
      const file = `platform_sales_summary_${platformSummaryStartDate || ''}_${platformSummaryEndDate || ''}.xlsx`;
      exportToXlsx(file, [header, ...rows], 'Platform Summary');
    } finally {
      setDownloadLoading(prev => ({ ...prev, platformSummary: false }));
    }
  };

  const fetchAllPlatformReportData = async () => {
    try {
      // Platform report doesn't seem to have pagination based on the regular fetch function
      const params = {};
      if (platformReportMonth) {
        const [y, m] = platformReportMonth.split('-');
        params.year = parseInt(y);
        params.month = parseInt(m);
      }
      if (selectedPlatformReport) params.platform = selectedPlatformReport;
      if (selectedMetricReport) params.metric = selectedMetricReport;

      const response = await api.get('/platform-sales-report/', { params });
      return response.data.success ? response.data.data : [];
    } catch (err) {
      console.error('Failed to fetch all Platform Report data:', err);
      return [];
    }
  };

  const handleDownloadPlatformReport = async () => {
    setDownloadLoading(prev => ({ ...prev, platformReport: true }));
    try {
      const allData = await fetchAllPlatformReportData();
      if (allData.length === 0) return;
      
      const s = sortState.platformReport;
      const sorted = Array.isArray(allData) ? [...allData] : [];
      if (s && s.key) sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
      
      const header = ['Category', 'Current', 'Target', 'Projected', 'Attainment'];
      const rows = sorted.map(item => [
        item.category,
        formatNumber(item.current),
        formatNumber(item.target),
        formatNumber(item.projected),
        `${Number(item.attainment ?? 0).toFixed(2)}%`
      ]);
      const file = `sales_performance_${platformReportMonth || ''}_${selectedPlatformReport || 'all'}_${selectedMetricReport || ''}.xlsx`;
      exportToXlsx(file, [header, ...rows], 'Sales Performance');
    } finally {
      setDownloadLoading(prev => ({ ...prev, platformReport: false }));
    }
  };

  const fetchAllWeeklyData = async () => {
    try {
      // Weekly data doesn't seem to have pagination based on the regular fetch function
      const params = {};
      if (platformReportMonth) {
        const [y, m] = platformReportMonth.split('-');
        params.year = parseInt(y);
        params.month = parseInt(m);
      }
      if (selectedPlatformReport) params.platform = selectedPlatformReport;
      if (selectedMetricReport) params.metric = selectedMetricReport;

      const response = await api.get('/sales-performance-weekly/', { params });
      return response.data.success ? response.data.data : [];
    } catch (err) {
      console.error('Failed to fetch all Weekly data:', err);
      return [];
    }
  };

  const handleDownloadWeekly = async () => {
    setDownloadLoading(prev => ({ ...prev, weekly: true }));
    try {
      const allData = await fetchAllWeeklyData();
      if (allData.length === 0) return;
      
      const s = sortState.weekly;
      const sorted = Array.isArray(allData) ? [...allData] : [];
      if (s && s.key) sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
      
      const header = ['Category', 'W1', 'W2', 'W3', 'W4'];
      const rows = sorted.map(item => [
        item.category,
        formatNumber(item.w1),
        formatNumber(item.w2),
        formatNumber(item.w3),
        formatNumber(item.w4)
      ]);
      const file = `sales_performance_weekly_${platformReportMonth || ''}_${selectedPlatformReport || 'all'}.xlsx`;
      exportToXlsx(file, [header, ...rows], 'Weekly');
    } finally {
      setDownloadLoading(prev => ({ ...prev, weekly: false }));
    }
  };

  // Generic sort helpers
  const compareValues = (a, b, direction = 'asc') => {
    const aNum = Number(a);
    const bNum = Number(b);
    const aIsNum = Number.isFinite(aNum);
    const bIsNum = Number.isFinite(bNum);

    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;

    let cmp = 0;
    if (aIsNum && bIsNum) {
      cmp = aNum - bNum;
    } else {
      const aStr = String(a).toLowerCase();
      const bStr = String(b).toLowerCase();
      if (aStr > bStr) cmp = 1;
      else if (aStr < bStr) cmp = -1;
      else cmp = 0;
    }
    return direction === 'asc' ? cmp : -cmp;
  };

  const handleSort = (tableKey, columnKey) => {
    setSortState((prev) => {
      const current = prev[tableKey] || { key: null, direction: 'asc' };
      const nextDir = current.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc';
      return { ...prev, [tableKey]: { key: columnKey, direction: nextDir } };
    });
  };

  // Overall Sales Summary sorting removed

  const sortArrow = (tableKey, columnKey) => {
    const s = sortState[tableKey];
    if (!s || s.key !== columnKey) return '';
    return s.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const setSort = (tableKey, columnKey, direction) => {
    setSortState((prev) => ({ ...prev, [tableKey]: { key: columnKey || null, direction: direction || 'asc' } }));
  };

  const clearSort = (tableKey) => setSortState((prev) => ({ ...prev, [tableKey]: { key: null, direction: 'asc' } }));

  const fetchSalesContribution = async () => {
    try {
      setContribLoading(true);
      setContribError(null);
      const params = {
        page: contribCurrentPage,
        page_size: contribPageSize
      };
      if (contribStartDate) params.start_date = contribStartDate;
      if (contribEndDate) params.end_date = contribEndDate;
      if (selectedContribPlatforms && selectedContribPlatforms.length > 0) {
        params.platforms = selectedContribPlatforms.join(',');
      }
      const response = await api.get('/sales-contribution/', { params });
      if (response.data.success) {
        setContribData(response.data.data || []);
        setAvailableContribPlatforms(response.data.platforms || []);
        setContribPagination(response.data.pagination || {});
      } else {
        setContribError(response.data.error || 'Failed to fetch');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setContribError(`Failed to fetch Sales Contribution: ${errorMessage}`);
    } finally {
      setContribLoading(false);
    }
  };

  const fetchDailyReport = async () => {
    try {
      setDailyReportLoading(true);
      setDailyReportError(null);
      const params = {};
      if (dailyReportStartDate) params.start_date = dailyReportStartDate;
      if (dailyReportEndDate) params.end_date = dailyReportEndDate;
      if (selectedDailyReportPlatform) params.platform = selectedDailyReportPlatform;
      if (selectedDailyReportMetric) params.metric = selectedDailyReportMetric;
      if (dailyReportView) params.view = dailyReportView;
      
      const response = await api.get('/daily-report/', { params });
      if (response.data.success) {
        const tableData = response.data.data || [];
        setDailyReportData(tableData);
        setAvailableDailyReportPlatforms(response.data.platforms || []);
        setDailyReportDates(response.data.unique_dates || []);
        // Initialize pagination
        const totalCount = tableData.length;
        const pageSize = dailyReportPageSize;
        const totalPages = Math.ceil(totalCount / pageSize) || 1;
        setDailyReportPagination({
          current_page: 1,
          page_size: pageSize,
          total_count: totalCount,
          total_pages: totalPages,
          has_previous: false,
          has_next: totalPages > 1,
        });
      } else {
        setDailyReportError(response.data.error || 'Failed to fetch');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setDailyReportError(`Failed to fetch Daily Report: ${errorMessage}`);
    } finally {
      setDailyReportLoading(false);
    }
  };

  const handleDownloadSalesContribution = async () => {
    if (!Array.isArray(contribData) || contribData.length === 0) return;
    setDownloadLoading(prev => ({ ...prev, salesContribution: true }));
    try {
      const s = sortState.salesContribution;
      const sorted = Array.isArray(contribData) ? [...contribData] : [];
      if (s && s.key) sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
      const header = ['Title', 'Platform Item ID', 'GMV', 'Units', 'Contribution %'];
      const rows = sorted.map(item => [
        item.title,
        item.platform_item_id,
        Number(item.gmv || 0),
        Number(item.units || 0),
        Number(((item.contribution || 0) * 100).toFixed(2))
      ]);
      const file = `sales_contribution_${contribStartDate || ''}_${contribEndDate || ''}.xlsx`;
      exportToXlsx(file, [header, ...rows], 'Sales Contribution');
    } finally {
      setDownloadLoading(prev => ({ ...prev, salesContribution: false }));
    }
  };

  const handleDownloadDailyReport = async () => {
    if (!Array.isArray(dailyReportData) || dailyReportData.length === 0) return;
    setDownloadLoading(prev => ({ ...prev, dailyReport: true }));
    try {
      // Determine the identifier column based on view
      const identifierColumn = dailyReportView === 'supply_source' ? 'Supply Source' : (dailyReportView === 'supply_city' ? 'Supply City' : 'Platform Item ID');
      const identifierKey = dailyReportView === 'supply_source' ? 'supply_source' : (dailyReportView === 'supply_city' ? 'supply_city' : 'platform_item_id');
      
      const header = [identifierColumn, ...dailyReportDates.map(date => 
        new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )];
      
      const rows = dailyReportData.map(item => {
        const row = [item[identifierKey]];
        dailyReportDates.forEach(date => {
          const value = item.dates[date] || 0;
          row.push(value);
        });
        return row;
      });
      
      const file = `daily_report_${dailyReportView}_${selectedDailyReportMetric}_${dailyReportStartDate || ''}_${dailyReportEndDate || ''}.xlsx`;
      exportToXlsx(file, [header, ...rows], 'Daily Report');
    } finally {
      setDownloadLoading(prev => ({ ...prev, dailyReport: false }));
    }
  };

  const onContribPlatformsChange = (e) => {
    const options = Array.from(e.target.selectedOptions || []);
    setSelectedContribPlatforms(options.map(o => o.value));
  };

  const toggleAllContribPlatforms = (selectAll) => {
    if (selectAll) {
      setSelectedContribPlatforms([...availableContribPlatforms]);
    } else {
      setSelectedContribPlatforms([]);
    }
  };

  const isAllPlatformsSelected = selectedContribPlatforms.length === 0 || selectedContribPlatforms.length === availableContribPlatforms.length;
  const filteredContribPlatforms = (availableContribPlatforms || []).filter(p => p && p.toLowerCase().includes(contribSearch.toLowerCase()));

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (selectedBrand) params.brand = selectedBrand;
      const response = await api.get('/consolidated-data/', { params });
      if (response.data.success) {
        console.log('Consolidated data:', response.data.data);
        setData(response.data.data);
        setTotalGrowthRate(response.data.total_growth_rate);
        setTotalCitiesLiveOverall(response.data.total_cities_live || 0);
        setTotalArticlesOverall(response.data.total_articles || 0);
        setAvailableOverallPlatforms(response.data.platforms || []);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      // Handle authentication errors gracefully
      if (isAuthError(err)) {
        // Don't show error for auth issues, let the interceptor handle it
        console.log('Authentication error in fetchData, handled by interceptor');
      } else {
        // Show detailed backend error if available for non-auth errors
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };



  const fetchTargetData = async () => {
    try {
      setTargetLoading(true);
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (selectedBrand) params.brand = selectedBrand;
      const response = await api.get('/sales-target-data/', { params });
      if (response.data.success) {
        setTargetData(response.data.data);
      } else {
        setTargetError(response.data.error);
      }
    } catch (err) {
      // Handle authentication errors gracefully
      if (isAuthError(err)) {
        // Don't show error for auth issues, let the interceptor handle it
        console.log('Authentication error in fetchTargetData, handled by interceptor');
      } else {
        // Show detailed backend error if available for non-auth errors
        const errorMessage = err.response?.data?.error || err.message;
        setTargetError(`Failed to fetch target data: ${errorMessage}`);
      }
    } finally {
      setTargetLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      setWeeklyLoading(true);
      setWeeklyError(null);
      const params = {};
      if (platformReportMonth) {
        const [y, m] = platformReportMonth.split('-');
        params.year = parseInt(y);
        params.month = parseInt(m);
      }
      if (selectedPlatformReport) params.platform = selectedPlatformReport;
      if (selectedMetricReport) params.metric = selectedMetricReport;

      const response = await api.get('/sales-performance-weekly/', { params });
      if (response.data.success) {
        setWeeklyData(response.data.data);
      } else {
        setWeeklyError(response.data.error || 'Failed to fetch');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setWeeklyError(`Failed to fetch Weekly data: ${errorMessage}`);
    } finally {
      setWeeklyLoading(false);
    }
  };

  const fetchDrrData = async () => {
    try {
      setDrrLoading(true);
      setDrrError(null);
      const params = {
        page: currentPage,
        page_size: pageSize
      };
      if (drrStartDate) params.start_date = drrStartDate;
      if (drrEndDate) params.end_date = drrEndDate;
      if (selectedPlatform) params.platform = selectedPlatform;
      if (selectedCity) params.city = selectedCity;
      if (selectedSupplySource) params.supply_source = selectedSupplySource;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSubCategory) params.sub_category = selectedSubCategory;
      if (selectedBrand) params.brand = selectedBrand;
      
      const response = await api.get('/drr-report/', { params });
      if (response.data.success) {
        console.log('DRR API Response:', response.data);
        console.log('Sub-categories received:', response.data.sub_categories);
        setDrrData(response.data.data);
        setAvailablePlatforms(response.data.platforms || []);
        setAvailableCities(response.data.cities || []);
        setAvailableSupplySources(response.data.supply_sources || []);
        setAvailableCategories(response.data.categories || []);
        setAvailableSubCategories(response.data.sub_categories || []);
        setPagination(response.data.pagination || {});
      } else {
        setDrrError(response.data.error);
      }
    } catch (err) {
      // Show detailed backend error if available
      const errorMessage = err.response?.data?.error || err.message;
      setDrrError(`Failed to fetch DRR data: ${errorMessage}`);
    } finally {
      setDrrLoading(false);
    }
  };

  const fetchPlatformSummaryData = async () => {
    try {
      setPlatformSummaryLoading(true);
      setPlatformSummaryError(null);
      const params = {};
      if (platformSummaryStartDate) params.start_date = platformSummaryStartDate;
      if (platformSummaryEndDate) params.end_date = platformSummaryEndDate;
      if (selectedPlatformSummary) params.platform = selectedPlatformSummary;
      
      const response = await api.get('/platform-sales-summary/', { params });
      if (response.data.success) {
        setPlatformSummaryData(response.data.data);
        setAvailablePlatformsSummary(response.data.platforms || []);
      } else {
        setPlatformSummaryError(response.data.error);
      }
    } catch (err) {
      // Show detailed backend error if available
      const errorMessage = err.response?.data?.error || err.message;
      setPlatformSummaryError(`Failed to fetch Platform Sales Summary data: ${errorMessage}`);
    } finally {
      setPlatformSummaryLoading(false);
    }
  };

  const fetchPlatformsForReport = async () => {
    try {
      // Reuse an existing endpoint that returns platforms list
      const response = await api.get('/platform-sales-summary/');
      setAvailablePlatformsReport(response.data.platforms || []);
    } catch (err) {
      // Non-blocking
    }
  };

  const fetchPlatformReportData = async () => {
    try {
      setPlatformReportLoading(true);
      setPlatformReportError(null);
      const params = {};
      if (platformReportMonth) {
        const [y, m] = platformReportMonth.split('-');
        params.year = parseInt(y);
        params.month = parseInt(m);
      }
      if (selectedPlatformReport) params.platform = selectedPlatformReport;
      if (selectedMetricReport) params.metric = selectedMetricReport;

      const response = await api.get('/platform-sales-report/', { params });
      if (response.data.success) {
        setPlatformReportData(response.data.data);
        if (Array.isArray(response.data.platforms)) {
          setAvailablePlatformsReport(response.data.platforms);
        }
      } else {
        setPlatformReportError(response.data.error || 'Failed to fetch');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setPlatformReportError(`Failed to fetch Sales Performance data: ${errorMessage}`);
    } finally {
      setPlatformReportLoading(false);
    }
  };

  const renderSalesSummaryTable = () => {
    if (data.length === 0) return <p>No data available</p>;

    const platforms = data.map(item => item.platform);
    const totalGMV = data.reduce((sum, item) => sum + (item.sales_gmv || 0), 0);
    const totalUnits = data.reduce((sum, item) => sum + (item.sales_units || 0), 0);
    const totalASP = totalUnits > 0 ? totalGMV / totalUnits : 0;
    const totalCities = data.reduce((sum, item) => sum + (item.cities_live || 0), 0);
    const totalArticles = totalArticlesOverall;

    // Helper to get item by platform
    const platformToItem = data.reduce((acc, item) => { acc[item.platform] = item; return acc; }, {});

    // Define rows for each metric
    const metrics = [
      { label: 'Sales GMV', key: 'sales_gmv', format: val => formatNumber(val) },
      { label: 'Sales Units', key: 'sales_units', format: val => formatNumber(val) },
      { label: 'ASP', key: null, format: (item) => formatNumber(item.sales_units > 0 ? item.sales_gmv / item.sales_units : 0) },
      { label: 'Growth Rate', key: 'growth_rate', format: val => (val == null ? 'No Data' : `${val}%`) },
      { label: 'Cities Live', key: null, format: (item) => {
          if (Array.isArray(item.city_list) && item.city_list.length > 0) {
            return item.city_list.join(', ');
          } else if (item.cities_live != null) {
            return formatNumber(item.cities_live);
          }
          return '';
        }
      },
      { label: 'Total Articles', key: null, format: (item) => Array.isArray(item.title_list) ? item.title_list.join(', ') : formatNumber(item.total_articles || 0) },
      { label: 'Platform Weightage', key: null, format: (item) => formatNumber(totalGMV ? (item.sales_gmv / totalGMV) * 100 : 0) + '%' }
    ];

    // Compute total unique cities across all platforms
    const allCities = data.flatMap(item => Array.isArray(item.city_list) ? item.city_list : []);
    const totalUniqueCities = new Set(allCities).size;
    // Compute total unique titles across all platforms
    const allTitles = data.flatMap(item => Array.isArray(item.title_list) ? item.title_list : []);
    const totalUniqueTitles = new Set(allTitles).size;

    return (
      <div className="table-container">
        <table className="sales-summary-table">
          <thead>
            <tr>
              <th>Metric</th>
              {platforms.map((platform, idx) => <th key={idx}>{platform}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, idx) => (
              <tr key={idx}>
                <td><strong>{metric.label}</strong></td>
                {platforms.map((platform, pi) => {
                  const item = platformToItem[platform] || {};
                  const value = metric.key
                    ? item[metric.key] || 0
                    : metric.format(item);
                  return <td key={pi}>{metric.key ? metric.format(item[metric.key] || 0) : value}</td>;
                })}
                <td><strong>{(() => {
                  switch(metric.label) {
                    case 'Sales GMV': return formatNumber(totalGMV);
                    case 'Sales Units': return formatNumber(totalUnits);
                    case 'ASP': return formatNumber(totalASP);
                    case 'Growth Rate': return totalGrowthRate == null ? 'No Data' : `${totalGrowthRate}%`;
                    case 'Cities Live': return formatNumber(totalCitiesLiveOverall);
                    case 'Total Articles': return formatNumber(totalArticlesOverall);
                    case 'Platform Weightage': return '100%';
                    default: return '';
                  }
                })()}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTargetSummaryTable = () => {
    if (targetData.length === 0) return <p>No target data available</p>;

    // Extract platforms and compute totals for targets
    let platforms = targetData.map(item => item.platform);
    const totalGMV = targetData.reduce((sum, item) => sum + (item.sales_gmv || 0), 0);
    const totalUnits = targetData.reduce((sum, item) => sum + (item.sales_units || 0), 0);
    const totalASP = totalUnits > 0 ? totalGMV / totalUnits : 0;

    const platformToItem = targetData.reduce((acc, item) => {
      acc[item.platform] = item;
      return acc;
    }, {});
    const platformToActual = data.reduce((acc, item) => { acc[item.platform] = item; return acc; }, {});

    return (
      <div className="table-container">
        <table className="sales-summary-table">
          <thead>
            <tr>
              <th></th>
              {platforms.map((platform, index) => (
                <th key={index}>{platform}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Sales GMV</strong></td>
              {platforms.map((platform, index) => {
                const item = platformToItem[platform] || {};
                return <td key={index}>{formatNumber(item.sales_gmv || 0)}</td>;
              })}
              <td><strong>{formatNumber(totalGMV)}</strong></td>
            </tr>
            <tr>
              <td><strong>Sales Units</strong></td>
              {platforms.map((platform, index) => {
                const item = platformToItem[platform] || {};
                return <td key={index}>{formatNumber(item.sales_units || 0)}</td>;
              })}
              <td><strong>{formatNumber(totalUnits)}</strong></td>
            </tr>
            <tr>
              <td><strong>ASP</strong></td>
              {platforms.map((platform, index) => {
                const item = platformToItem[platform] || {};
                const asp = item.sales_units > 0 ? item.sales_gmv / item.sales_units : 0;
                return <td key={index}>{formatNumber(asp)}</td>;
              })}
              <td><strong>{formatNumber(totalASP)}</strong></td>
            </tr>
            <tr>
              <td><strong>Target Attainment %</strong></td>
              {platforms.map((platform, index) => {
                const actualGMV = platformToActual[platform]?.sales_gmv || 0;
                const targetGMV = platformToItem[platform]?.sales_gmv || 0;
                const attainment = targetGMV ? (actualGMV / targetGMV) * 100 : 0;
                return <td key={index}>{formatNumber(attainment)}%</td>;
              })}
              <td><strong>{formatNumber((data.reduce((sum, item) => sum + (item.sales_gmv || 0), 0) / totalGMV) * 100)}%</strong></td>
            </tr>
            <tr>
              <td><strong>Platform Weightage</strong></td>
              {platforms.map((platform, index) => {
                const item = platformToItem[platform] || {};
                const weight = totalGMV ? (item.sales_gmv / totalGMV) * 100 : 0;
                return <td key={index}>{formatNumber(weight)}%</td>;
              })}
              <td><strong>100%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderDrrTable = () => {
    if (drrData.length === 0) return <p>No data available</p>;

    const s = sortState.drr;
    const sorted = Array.isArray(drrData) ? [...drrData] : [];
    if (s && s.key) {
      sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
    }

    return (
      <div>
        <div className="table-container">
          {/* Sorting controls removed as requested */}
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('drr', 'platform_item_id')} style={{ cursor: 'pointer' }}>Platform Item ID{sortArrow('drr', 'platform_item_id')}</th>
                <th onClick={() => handleSort('drr', 'title')} style={{ cursor: 'pointer' }}>Title{sortArrow('drr', 'title')}</th>
                <th onClick={() => handleSort('drr', 'platform')} style={{ cursor: 'pointer' }}>Platform{sortArrow('drr', 'platform')}</th>
                <th onClick={() => handleSort('drr', 'drr')} style={{ cursor: 'pointer' }}>DRR{sortArrow('drr', 'drr')}</th>
                <th onClick={() => handleSort('drr', 'last_7_days_drr')} style={{ cursor: 'pointer' }}>Last 7 Days DRR{sortArrow('drr', 'last_7_days_drr')}</th>
                <th onClick={() => handleSort('drr', 'total_gmv')} style={{ cursor: 'pointer' }}>GMV{sortArrow('drr', 'total_gmv')}</th>
                <th onClick={() => handleSort('drr', 'total_units')} style={{ cursor: 'pointer' }}>Units{sortArrow('drr', 'total_units')}</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, index) => (
                <tr key={index}>
                  <td>{item.platform_item_id}</td>
                  <td>{item.title}</td>
                  <td>{item.platform}</td>
                  <td>{formatNumber(item.drr || 0)}</td>
                  <td>{formatNumber(item.last_7_days_drr || 0)}</td>
                  <td>{formatNumber(item.total_gmv || 0)}</td>
                  <td>{formatNumber(item.total_units || 0)}</td>
                  <td>{item.last_7_days_drr > item.drr ? 'Growing' : 'Need Attention'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((pagination.current_page - 1) * pagination.page_size) + 1} to {Math.min(pagination.current_page * pagination.page_size, pagination.total_count)} of {pagination.total_count} entries
          </div>
          
          <div className="pagination-controls">
            <div className="page-size-selector">
              <label htmlFor="page-size">Show:</label>
              <select 
                id="page-size"
                value={pageSize} 
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="page-size-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>per page</span>
            </div>
            
            <div className="pagination-buttons">
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={!pagination.has_previous}
                className="pagination-btn"
              >
                First
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={!pagination.has_previous}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={!pagination.has_next}
                className="pagination-btn"
              >
                Next
              </button>
              <button 
                onClick={() => setCurrentPage(pagination.total_pages)} 
                disabled={!pagination.has_next}
                className="pagination-btn"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlatformSummaryTable = () => {
    if (platformSummaryData.length === 0) return <p>No data available</p>;

    const s = sortState.platformSummary;
    const sorted = Array.isArray(platformSummaryData) ? [...platformSummaryData] : [];
    if (s && s.key) {
      sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
    }

    return (
      <div className="table-container">
        {/* Sorting controls removed as requested */}
        <table className="platform-summary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('platformSummary', 'category')} style={{ cursor: 'pointer' }}>Category{sortArrow('platformSummary', 'category')}</th>
              <th onClick={() => handleSort('platformSummary', 'drr')} style={{ cursor: 'pointer' }}>DRR{sortArrow('platformSummary', 'drr')}</th>
              <th onClick={() => handleSort('platformSummary', 'last_7_days_avg')} style={{ cursor: 'pointer' }}>Last 7 days Avg{sortArrow('platformSummary', 'last_7_days_avg')}</th>
              <th onClick={() => handleSort('platformSummary', 'total_gmv')} style={{ cursor: 'pointer' }}>GMV{sortArrow('platformSummary', 'total_gmv')}</th>
              <th onClick={() => handleSort('platformSummary', 'total_units')} style={{ cursor: 'pointer' }}>Units{sortArrow('platformSummary', 'total_units')}</th>
              <th onClick={() => handleSort('platformSummary', 'asp')} style={{ cursor: 'pointer' }}>ASP{sortArrow('platformSummary', 'asp')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => (
              <tr key={index}>
                <td className="category-cell">{item.category}</td>
                <td>{formatNumber(item.drr || 0)}</td>
                <td>{formatNumber(item.last_7_days_avg || 0)}</td>
                <td>{formatNumber(item.total_gmv || 0)}</td>
                <td>{formatNumber(item.total_units || 0)}</td>
                <td>{formatNumber(item.asp || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPlatformReportTable = () => {
    if (platformReportData.length === 0) return <p>No data available</p>;

    const s = sortState.platformReport;
    const sorted = Array.isArray(platformReportData) ? [...platformReportData] : [];
    if (s && s.key) {
      sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
    }

    const formatPercent = (num) => {
      if (num === null || num === undefined) return '—';
      return `${Number(num).toFixed(2)}%`;
    };

    return (
      <div className="table-container">
        {/* Sorting controls removed as requested */}
        <table className="platform-summary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('platformReport', 'category')} style={{ cursor: 'pointer' }}>Category{sortArrow('platformReport', 'category')}</th>
              <th onClick={() => handleSort('platformReport', 'current')} style={{ cursor: 'pointer' }}>Current{sortArrow('platformReport', 'current')}</th>
              <th onClick={() => handleSort('platformReport', 'target')} style={{ cursor: 'pointer' }}>Target{sortArrow('platformReport', 'target')}</th>
              <th onClick={() => handleSort('platformReport', 'projected')} style={{ cursor: 'pointer' }}>Projected{sortArrow('platformReport', 'projected')}</th>
              <th onClick={() => handleSort('platformReport', 'attainment')} style={{ cursor: 'pointer' }}>Attainment{sortArrow('platformReport', 'attainment')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => (
              <tr key={index}>
                <td className="category-cell">{item.category}</td>
                <td>{formatNumber(item.current)}</td>
                <td>{formatNumber(item.target)}</td>
                <td>{formatNumber(item.projected)}</td>
                <td>{formatPercent(item.attainment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderWeeklyTable = () => {
    if (weeklyData.length === 0) return <p>No data available</p>;

    const s = sortState.weekly;
    const sorted = Array.isArray(weeklyData) ? [...weeklyData] : [];
    if (s && s.key) {
      sorted.sort((a, b) => compareValues(a[s.key], b[s.key], s.direction));
    }

    return (
      <div className="table-container">
        {/* Sorting controls removed as requested */}
        <table className="platform-summary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('weekly', 'category')} style={{ cursor: 'pointer' }}>Category{sortArrow('weekly', 'category')}</th>
              <th onClick={() => handleSort('weekly', 'w1')} style={{ cursor: 'pointer' }}>W1{sortArrow('weekly', 'w1')}</th>
              <th onClick={() => handleSort('weekly', 'w2')} style={{ cursor: 'pointer' }}>W2{sortArrow('weekly', 'w2')}</th>
              <th onClick={() => handleSort('weekly', 'w3')} style={{ cursor: 'pointer' }}>W3{sortArrow('weekly', 'w3')}</th>
              <th onClick={() => handleSort('weekly', 'w4')} style={{ cursor: 'pointer' }}>W4{sortArrow('weekly', 'w4')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => (
              <tr key={index}>
                <td className="category-cell">{item.category}</td>
                <td>{formatNumber(item.w1)}</td>
                <td>{formatNumber(item.w2)}</td>
                <td>{formatNumber(item.w3)}</td>
                <td>{formatNumber(item.w4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDailyReportTable = () => {
    if (dailyReportData.length === 0) return <p>No data available</p>;

    // Client-side pagination
    const { current_page, page_size } = dailyReportPagination;
    const startIdx = (current_page - 1) * page_size;
    const endIdx = startIdx + page_size;
    const pageItems = dailyReportData.slice(startIdx, endIdx);

    // Set CSS custom property for date count
    const dateCount = dailyReportDates.length;
    const tableStyle = {
      '--date-count': dateCount
    };

    // Determine the identifier column based on view
    const identifierColumn = dailyReportView === 'supply_source' ? 'Supply Source' : (dailyReportView === 'supply_city' ? 'Supply City' : 'Platform Item ID');
    const identifierKey = dailyReportView === 'supply_source' ? 'supply_source' : (dailyReportView === 'supply_city' ? 'supply_city' : 'platform_item_id');

    return (
      <div className="table-container">
        <div className="daily-report-table-wrapper">
          <h3 className="metric-title">
            Showing {selectedDailyReportMetric.toUpperCase()} Data by {identifierColumn}
          </h3>
          <table className="daily-report-table" style={tableStyle}>
            <thead>
              <tr>
                <th className="sticky-column">{identifierColumn}</th>
                {dailyReportDates.map((date, index) => (
                  <th key={index} className="date-column">
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, idx) => (
                <tr key={idx}>
                  <td 
                    className="sticky-column platform-item-cell"
                    title={item[identifierKey]}
                  >
                    {item[identifierKey]}
                  </td>
                  {dailyReportDates.map((date, dateIndex) => {
                    const value = item.dates[date] || 0;
                    return (
                      <td key={dateIndex} className="metric-cell">
                        {formatNumber(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const onAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const doLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await axios.post(`${apiBaseURL}auth/login/`, {
        username: authForm.username,
        password: authForm.password,
      });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      } else {
        setAuthError(res.data.error || 'Login failed');
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const doSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await axios.post(`${apiBaseURL}auth/signup/`, {
        username: authForm.username,
        password: authForm.password,
        email: authForm.email,
        full_name: authForm.full_name,
      });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      } else {
        setAuthError(res.data.error || 'Signup failed');
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken('');
  };

  if (!authToken) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Nuvr Analytics Portal</h1>
          <p>Please {authView === 'login' ? 'sign in' : 'sign up'} to continue</p>
        </header>
        <main className="App-main">
          <div className="auth-card">
            <div className="auth-toggle">
              <button className={authView === 'login' ? 'active' : ''} onClick={() => setAuthView('login')}>Sign In</button>
              <button className={authView === 'signup' ? 'active' : ''} onClick={() => setAuthView('signup')}>Sign Up</button>
            </div>
            {authError && <div className="error">{authError}</div>}
            {authView === 'login' ? (
              <form onSubmit={doLogin} className="auth-form">
                <label>
                  Username
                  <input name="username" value={authForm.username} onChange={onAuthChange} required />
                </label>
                <label>
                  Password
                  <input type="password" name="password" value={authForm.password} onChange={onAuthChange} required />
                </label>
                <button type="submit" disabled={authLoading} className="refresh-btn">{authLoading ? 'Signing in...' : 'Sign In'}</button>
              </form>
            ) : (
              <form onSubmit={doSignup} className="auth-form">
                <label>
                  Username
                  <input name="username" value={authForm.username} onChange={onAuthChange} required />
                </label>
                <label>
                  Email
                  <input type="email" name="email" value={authForm.email} onChange={onAuthChange} />
                </label>
                <label>
                  Full name
                  <input name="full_name" value={authForm.full_name} onChange={onAuthChange} />
                </label>
                <label>
                  Password
                  <input type="password" name="password" value={authForm.password} onChange={onAuthChange} required />
                </label>
                <button type="submit" disabled={authLoading} className="refresh-btn">{authLoading ? 'Creating...' : 'Create Account'}</button>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Nuvr Analytics Portal</h1>
        <p>Consolidated Data Dashboard</p>
        {tokenRefreshed && (
          <div className="token-refresh-notification">
            ✅ Session refreshed successfully
          </div>
        )}
        <button onClick={logout} className="refresh-btn logout-btn">Logout</button>
      </header>
      
      <main className="App-main">
        <div className="layout">
          <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
              <button 
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? '→' : '←'}
              </button>
            </div>
            <div className="sidebar-content">
              {modules.map(module => (
                <div key={module.key} className="module-section">
                  <div 
                    className={`module-header ${activeModule === module.key ? 'active' : ''}`}
                    onClick={() => {
                      if (activeModule === module.key) {
                        // If clicking on the same module, toggle expansion
                        toggleModuleExpansion(module.key);
                      } else {
                        // If clicking on a different module, switch to it and expand
                        setActiveModule(module.key);
                        setExpandedModules(prev => ({
                          ...prev,
                          [module.key]: true
                        }));
                        // Set first tab of the module as active
                        if (module.tabs.length > 0) {
                          setActiveTab(module.tabs[0].key);
                        }
                      }
                    }}
                  >
                    <span className="module-icon">{module.icon}</span>
                    {!sidebarCollapsed && <span className="module-label">{module.label}</span>}
                    {!sidebarCollapsed && (
                      <span className={`module-chevron ${expandedModules[module.key] ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && activeModule === module.key && expandedModules[module.key] && (
                    <ul className="module-tabs">
                      {module.tabs.map(tab => (
                        <li
                          key={tab.key}
                          className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab.key)}
                        >
                          {tab.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </nav>
          <div className="content">
            {activeTab === 'overall' ? (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>Overall Sales Summary</h2>
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label htmlFor="start-date">Start Date:</label>
                      <input 
                        id="start-date"
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="end-date">End Date:</label>
                      <input 
                        id="end-date"
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="brand-filter">Brand:</label>
                      <select
                        id="brand-filter"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Brands</option>
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={fetchData} className="refresh-btn">
                      Refresh Data
                    </button>
                    <button onClick={handleDownloadSalesSummary} className="btn-ghost" disabled={downloadLoading.salesSummary}>
                      {downloadLoading.salesSummary ? 'Downloading...' : 'Download XLSX'}
                    </button>
                  </div>
                </div>

                {loading && <div className="loading">Loading data...</div>}

                {error && (
                  <div className="error">
                    <p>Error: {error}</p>
                    <button onClick={fetchData} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}

                {!loading && !error && (
                  <div>
                    <div className="table-section">
                      <h3 className="table-section-header">Actuals</h3>
                      {renderSalesSummaryTable()}
                    </div>
                    
                    <div className="table-section">
                      <h3 className="table-section-header">Targets</h3>
                      {targetLoading && <div className="loading">Loading target data...</div>}
                      {targetError && (
                        <div className="error">
                          <p>Error: {targetError}</p>
                          <button onClick={fetchTargetData} className="retry-btn">
                            Retry
                          </button>
                        </div>
                      )}
                      {!targetLoading && !targetError && renderTargetSummaryTable()}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'drr' ? (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>DRR Report</h2>
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label htmlFor="drr-start-date">Start Date:</label>
                      <input 
                        id="drr-start-date"
                        type="date" 
                        value={drrStartDate} 
                        onChange={(e) => setDrrStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="drr-end-date">End Date:</label>
                      <input 
                        id="drr-end-date"
                        type="date" 
                        value={drrEndDate} 
                        onChange={(e) => setDrrEndDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="platform-filter">Platform:</label>
                      <select 
                        id="platform-filter"
                        value={selectedPlatform} 
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Platforms</option>
                        {availablePlatforms.map((platform, index) => (
                          <option key={index} value={platform}>{platform}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="city-filter">Sales City:</label>
                      <select 
                        id="city-filter"
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Cities</option>
                        {availableCities.map((c, index) => (
                          <option key={index} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="supply-filter">Manufacturing Source:</label>
                      <select 
                        id="supply-filter"
                        value={selectedSupplySource} 
                        onChange={(e) => setSelectedSupplySource(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Sources</option>
                        {availableSupplySources.map((s, index) => (
                          <option key={index} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="category-filter">Category:</label>
                      <select 
                        id="category-filter"
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Categories</option>
                        {availableCategories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="sub-category-filter">Sub-Category:</label>
                      <select 
                        id="sub-category-filter"
                        value={selectedSubCategory} 
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Sub-Categories</option>
                        {availableSubCategories.map((subCat, index) => (
                          <option key={index} value={subCat}>{subCat}</option>
                        ))}
                      </select>
                    </div>
                    {/* Brand filter for DRR */}
                    <div className="date-input-group">
                      <label htmlFor="drr-brand-filter">Brand:</label>
                      <select
                        id="drr-brand-filter"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Brands</option>
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={fetchDrrData} className="refresh-btn">
                      Refresh Data
                    </button>
                    <button onClick={handleDownloadDrr} className="btn-ghost" disabled={downloadLoading.drr}>
                      {downloadLoading.drr ? 'Downloading...' : 'Download XLSX'}
                    </button>
                  </div>
                </div>

                {drrLoading && <div className="loading">Loading DRR data...</div>}

                {drrError && (
                  <div className="error">
                    <p>Error: {drrError}</p>
                    <button onClick={fetchDrrData} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}

                {!drrLoading && !drrError && renderDrrTable()}
              </div>
            ) : activeTab === 'platformSummary' ? (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>Platform Sales Summary</h2>
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label htmlFor="platform-summary-start-date">Start Date:</label>
                      <input 
                        id="platform-summary-start-date"
                        type="date" 
                        value={platformSummaryStartDate} 
                        onChange={(e) => setPlatformSummaryStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="platform-summary-end-date">End Date:</label>
                      <input 
                        id="platform-summary-end-date"
                        type="date" 
                        value={platformSummaryEndDate} 
                        onChange={(e) => setPlatformSummaryEndDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="platform-summary-filter">Platform:</label>
                      <select 
                        id="platform-summary-filter"
                        value={selectedPlatformSummary} 
                        onChange={(e) => setSelectedPlatformSummary(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Platforms</option>
                        {availablePlatformsSummary.map((platform, index) => (
                          <option key={index} value={platform}>{platform}</option>
                        ))}
                      </select>
                    </div>
                    {/* Brand filter for Platform Summary */}
                    <div className="date-input-group">
                      <label htmlFor="platform-summary-brand-filter">Brand:</label>
                      <select
                        id="platform-summary-brand-filter"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Brands</option>
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={fetchPlatformSummaryData} className="refresh-btn">
                      Refresh Data
                    </button>
                    <button onClick={handleDownloadPlatformSummary} className="btn-ghost" disabled={downloadLoading.platformSummary}>
                      {downloadLoading.platformSummary ? 'Downloading...' : 'Download XLSX'}
                    </button>
                  </div>
                </div>

                {platformSummaryLoading && <div className="loading">Loading Platform Sales Summary data...</div>}

                {platformSummaryError && (
                  <div className="error">
                    <p>Error: {platformSummaryError}</p>
                    <button onClick={fetchPlatformSummaryData} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}

                {!platformSummaryLoading && !platformSummaryError && renderPlatformSummaryTable()}
              </div>
            ) : activeTab === 'platformReport' ? (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>Sales Performance</h2>
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label htmlFor="platform-report-month">Month:</label>
                      <input
                        id="platform-report-month"
                        type="month"
                        value={platformReportMonth}
                        onChange={(e) => setPlatformReportMonth(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="platform-report-platform">Platform:</label>
                      <select
                        id="platform-report-platform"
                        value={selectedPlatformReport}
                        onChange={(e) => setSelectedPlatformReport(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Platforms</option>
                        {availablePlatformsReport.map((platform, index) => (
                          <option key={index} value={platform}>{platform}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="platform-report-metric">Metric:</label>
                      <select
                        id="platform-report-metric"
                        value={selectedMetricReport}
                        onChange={(e) => setSelectedMetricReport(e.target.value)}
                        className="platform-select"
                      >
                        <option value="gmv">GMV</option>
                        <option value="units">Units</option>
                        <option value="asp">ASP</option>
                      </select>
                    </div>
                    {/* Brand filter for Sales Performance */}
                    <div className="date-input-group">
                      <label htmlFor="performance-brand-filter">Brand:</label>
                      <select
                        id="performance-brand-filter"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Brands</option>
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label>View:</label>
                      <div className="toggle-group">
                        <button 
                          className={`toggle-btn ${salesPerfView === 'target' ? 'active' : ''}`}
                          onClick={() => setSalesPerfView('target')}
                        >Target</button>
                        <button 
                          className={`toggle-btn ${salesPerfView === 'weekly' ? 'active' : ''}`}
                          onClick={() => setSalesPerfView('weekly')}
                        >Weekly</button>
                      </div>
                    </div>
                    <button onClick={() => (salesPerfView === 'target' ? fetchPlatformReportData() : fetchWeeklyData())} className="refresh-btn">Refresh Data</button>
                    {salesPerfView === 'target' ? (
                      <button onClick={handleDownloadPlatformReport} className="btn-ghost" disabled={downloadLoading.platformReport}>
                        {downloadLoading.platformReport ? 'Downloading...' : 'Download XLSX'}
                      </button>
                    ) : (
                      <button onClick={handleDownloadWeekly} className="btn-ghost" disabled={downloadLoading.weekly}>
                        {downloadLoading.weekly ? 'Downloading...' : 'Download XLSX'}
                      </button>
                    )}
                  </div>
                </div>

                {salesPerfView === 'target' && platformReportLoading && <div className="loading">Loading Sales Performance data...</div>}
                {salesPerfView === 'weekly' && weeklyLoading && <div className="loading">Loading Weekly data...</div>}

                {(salesPerfView === 'target' ? platformReportError : weeklyError) && (
                  <div className="error">
                    <p>Error: {salesPerfView === 'target' ? platformReportError : weeklyError}</p>
                    <button onClick={() => (salesPerfView === 'target' ? fetchPlatformReportData() : fetchWeeklyData())} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}

                {salesPerfView === 'target' && !platformReportLoading && !platformReportError && renderPlatformReportTable()}
                {salesPerfView === 'weekly' && !weeklyLoading && !weeklyError && renderWeeklyTable()}
              </div>
            ) : activeTab === 'salesContribution' ? (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>Sales Contribution</h2>
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label htmlFor="contrib-start-date">Start Date:</label>
                      <input
                        id="contrib-start-date"
                        type="date"
                        value={contribStartDate}
                        onChange={(e) => setContribStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="contrib-end-date">End Date:</label>
                      <input
                        id="contrib-end-date"
                        type="date"
                        value={contribEndDate}
                        onChange={(e) => setContribEndDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label>Platforms:</label>
                      <div className="multi-select">
                        <button type="button" className={`multi-select-trigger ${contribDropdownOpen ? 'open' : ''}`} onClick={() => setContribDropdownOpen(v => !v)}>
                          {isAllPlatformsSelected ? 'All Platforms' : `${selectedContribPlatforms.length} selected`}
                        </button>
                        {contribDropdownOpen && (
                          <div className="multi-select-panel">
                            <div className="multi-select-actions">
                              <button type="button" onClick={() => toggleAllContribPlatforms(true)}>Select All</button>
                              <button type="button" onClick={() => toggleAllContribPlatforms(false)}>Clear</button>
                            </div>
                            <input
                              type="text"
                              placeholder="Search platforms..."
                              value={contribSearch}
                              onChange={(e) => setContribSearch(e.target.value)}
                              className="multi-select-search"
                            />
                            <div className="multi-select-options">
                              {filteredContribPlatforms.map((p, idx) => {
                                const checked = selectedContribPlatforms.includes(p) || (selectedContribPlatforms.length === 0 && false);
                                return (
                                  <label key={idx} className="multi-select-option">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedContribPlatforms(prev => Array.from(new Set([...prev, p])));
                                        } else {
                                          setSelectedContribPlatforms(prev => prev.filter(x => x !== p));
                                        }
                                      }}
                                    />
                                    <span>{p}</span>
                                  </label>
                                );
                              })}
                              {filteredContribPlatforms.length === 0 && (
                                <div className="multi-select-empty">No results</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={fetchSalesContribution} className="refresh-btn">Refresh Data</button>
                    <button onClick={handleDownloadSalesContribution} className="btn-ghost" disabled={downloadLoading.salesContribution}>
                      {downloadLoading.salesContribution ? 'Downloading...' : 'Download XLSX'}
                    </button>
                  </div>
                </div>

                {contribLoading && <div className="loading">Loading Sales Contribution...</div>}
                {contribError && (
                  <div className="error">
                    <p>Error: {contribError}</p>
                    <button onClick={fetchSalesContribution} className="retry-btn">Retry</button>
                  </div>
                )}

                {!contribLoading && !contribError && (
                  <>
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort('salesContribution', 'title')} style={{ cursor: 'pointer' }}>Title{sortArrow('salesContribution', 'title')}</th>
                            <th onClick={() => handleSort('salesContribution', 'platform_item_id')} style={{ cursor: 'pointer' }}>Platform Item ID{sortArrow('salesContribution', 'platform_item_id')}</th>
                            <th onClick={() => handleSort('salesContribution', 'gmv')} style={{ cursor: 'pointer' }}>GMV{sortArrow('salesContribution', 'gmv')}</th>
                            <th onClick={() => handleSort('salesContribution', 'units')} style={{ cursor: 'pointer' }}>Units{sortArrow('salesContribution', 'units')}</th>
                            <th onClick={() => handleSort('salesContribution', 'contribution')} style={{ cursor: 'pointer' }}>Contribution{sortArrow('salesContribution', 'contribution')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(contribData) ? [...contribData] : []).sort((a, b) => {
                            const s = sortState.salesContribution;
                            if (!s || !s.key) return 0;
                            return compareValues(a[s.key], b[s.key], s.direction);
                          }).map((row, idx) => (
                            <tr key={idx}>
                              <td className="category-cell">{row.title}</td>
                              <td>{row.platform_item_id}</td>
                              <td>{formatNumber(row.gmv)}</td>
                              <td>{formatNumber(row.units)}</td>
                              <td>{`${Number((row.contribution || 0) * 100).toFixed(2)}%`}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="pagination-container">
                      <div className="pagination-info">
                        Showing {((contribPagination.current_page - 1) * contribPagination.page_size) + 1} to {Math.min(contribPagination.current_page * contribPagination.page_size, contribPagination.total_count)} of {contribPagination.total_count} entries
                      </div>
                      
                      <div className="pagination-controls">
                        <div className="page-size-selector">
                          <label htmlFor="contrib-page-size">Show:</label>
                          <select 
                            id="contrib-page-size"
                            value={contribPageSize} 
                            onChange={(e) => setContribPageSize(parseInt(e.target.value))}
                            className="page-size-select"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <span>per page</span>
                        </div>
                        
                        <div className="pagination-buttons">
                          <button 
                            onClick={() => setContribCurrentPage(1)} 
                            disabled={!contribPagination.has_previous}
                            className="pagination-btn"
                          >
                            First
                          </button>
                          <button 
                            onClick={() => setContribCurrentPage(contribCurrentPage - 1)} 
                            disabled={!contribPagination.has_previous}
                            className="pagination-btn"
                          >
                            Previous
                          </button>
                          
                          <span className="page-info">
                            Page {contribPagination.current_page} of {contribPagination.total_pages}
                          </span>
                          
                          <button 
                            onClick={() => setContribCurrentPage(contribCurrentPage + 1)} 
                            disabled={!contribPagination.has_next}
                            className="pagination-btn"
                          >
                            Next
                          </button>
                          <button 
                            onClick={() => setContribCurrentPage(contribPagination.total_pages)} 
                            disabled={!contribPagination.has_next}
                            className="pagination-btn"
                          >
                            Last
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : activeTab === 'dailyReport' ? (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>Daily Report</h2>
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label htmlFor="daily-report-start-date">Start Date:</label>
                      <input 
                        id="daily-report-start-date"
                        type="date" 
                        value={dailyReportStartDate} 
                        onChange={(e) => setDailyReportStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="daily-report-end-date">End Date:</label>
                      <input 
                        id="daily-report-end-date"
                        type="date" 
                        value={dailyReportEndDate} 
                        onChange={(e) => setDailyReportEndDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="daily-report-platform">Platform:</label>
                      <select 
                        id="daily-report-platform"
                        value={selectedDailyReportPlatform} 
                        onChange={(e) => setSelectedDailyReportPlatform(e.target.value)}
                        className="platform-select"
                      >
                        <option value="">All Platforms</option>
                        {availableDailyReportPlatforms.map((platform, index) => (
                          <option key={index} value={platform}>{platform}</option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label htmlFor="daily-report-metric">Metric:</label>
                      <select
                        id="daily-report-metric"
                        value={selectedDailyReportMetric}
                        onChange={(e) => setSelectedDailyReportMetric(e.target.value)}
                        className="platform-select"
                      >
                        <option value="gmv">GMV</option>
                        <option value="units">Units</option>
                      </select>
                    </div>
                    <div className="date-input-group">
                      <label>View:</label>
                      <div className="toggle-group">
                        <button 
                          className={`toggle-btn ${dailyReportView === 'platform_item_id' ? 'active' : ''}`}
                          onClick={() => setDailyReportView('platform_item_id')}
                        >Platform Item ID</button>
                        <button 
                          className={`toggle-btn ${dailyReportView === 'supply_source' ? 'active' : ''}`}
                          onClick={() => setDailyReportView('supply_source')}
                        >Manufacturing Source</button>
                        <button 
                          className={`toggle-btn ${dailyReportView === 'supply_city' ? 'active' : ''}`}
                          onClick={() => setDailyReportView('supply_city')}
                        >Sales City</button>
                      </div>
                    </div>
                    <button onClick={fetchDailyReport} className="refresh-btn">
                      Refresh Data
                    </button>
                    <button onClick={handleDownloadDailyReport} className="btn-ghost" disabled={downloadLoading.dailyReport}>
                      {downloadLoading.dailyReport ? 'Downloading...' : 'Download XLSX'}
                    </button>
                  </div>
                </div>

                {dailyReportLoading && <div className="loading">Loading Daily Report...</div>}

                {dailyReportError && (
                  <div className="error">
                    <p>Error: {dailyReportError}</p>
                    <button onClick={fetchDailyReport} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}

                {!dailyReportLoading && !dailyReportError && renderDailyReportTable()}
                {/* Daily Report Pagination Controls */}
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {((dailyReportPagination.current_page - 1) * dailyReportPagination.page_size) + 1} to {Math.min(dailyReportPagination.current_page * dailyReportPagination.page_size, dailyReportPagination.total_count)} of {dailyReportPagination.total_count} entries
                  </div>
                  <div className="pagination-controls">
                    <div className="page-size-selector">
                      <label htmlFor="daily-report-page-size">Show:</label>
                      <select
                        id="daily-report-page-size"
                        value={dailyReportPageSize}
                        onChange={(e) => {
                          const ps = parseInt(e.target.value);
                          const totalCount = dailyReportData.length;
                          const totalPages = Math.ceil(totalCount / ps) || 1;
                          setDailyReportPageSize(ps);
                          setDailyReportPagination({
                            current_page: 1,
                            page_size: ps,
                            total_count: totalCount,
                            total_pages: totalPages,
                            has_previous: false,
                            has_next: totalPages > 1,
                          });
                        }}
                        className="page-size-select"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span>per page</span>
                    </div>
                    <button
                      onClick={() => {
                        const newPage = 1;
                        setDailyReportCurrentPage(newPage);
                        setDailyReportPagination(prev => ({
                          ...prev,
                          current_page: newPage,
                          has_previous: newPage > 1,
                          has_next: newPage < prev.total_pages
                        }));
                      }}
                      disabled={!dailyReportPagination.has_previous}
                      className="pagination-btn"
                    >
                      First
                    </button>
                    <button
                      onClick={() => {
                        const newPage = dailyReportPagination.current_page - 1;
                        setDailyReportCurrentPage(newPage);
                        setDailyReportPagination(prev => ({
                          ...prev,
                          current_page: newPage,
                          has_previous: newPage > 1,
                          has_next: newPage < prev.total_pages
                        }));
                      }}
                      disabled={!dailyReportPagination.has_previous}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {dailyReportPagination.current_page} of {dailyReportPagination.total_pages}
                    </span>
                    <button
                      onClick={() => {
                        const newPage = dailyReportPagination.current_page + 1;
                        setDailyReportCurrentPage(newPage);
                        setDailyReportPagination(prev => ({
                          ...prev,
                          current_page: newPage,
                          has_previous: newPage > 1,
                          has_next: newPage < prev.total_pages
                        }));
                      }}
                      disabled={!dailyReportPagination.has_next}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => {
                        const newPage = dailyReportPagination.total_pages;
                        setDailyReportCurrentPage(newPage);
                        setDailyReportPagination(prev => ({
                          ...prev,
                          current_page: newPage,
                          has_previous: newPage > 1,
                          has_next: newPage < prev.total_pages
                        }));
                      }}
                      disabled={!dailyReportPagination.has_next}
                      className="pagination-btn"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dashboard-container">
                <div className="dashboard-header">
                  <h2>{getCurrentTab()?.label || 'Module'}</h2>
                  <p>Coming soon - This module is under development</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;