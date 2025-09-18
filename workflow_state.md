# workflow_state.md

## Plan

### Indian Number Formatting (Lakhs/Crores) - COMPLETED ✅

1. Frontend
   - Added centralized `formatNumber` in `frontend/src/App.js` using Indian system:
     - Up to 5 digits: full number without suffix
     - 1 Lakh to < 1 Crore: value in Lakhs with ' L' (e.g., 1.2 L)
     - ≥ 1 Crore: value in Crores with ' Cr' (e.g., 3.67 Cr)
   - Replaced all K/M formatting usages across tables to use this formatter
   - Kept DB and API values unchanged; only display formatting adjusted

2. Validation
   - Ensured formatting matches examples:
     - 1.23k → 1230; 12.3k → 12300; 123000 → 1.2 L; 36700000 → 3.67 Cr
   - Confirmed linter passes for modified files

### DRR Report Implementation - COMPLETED ✅

1. **Backend: DRR Report API Endpoint** ✅
   - Created `get_drr_report` view in `api/views.py`:
     - Accepts `start_date`, `end_date`, and `platform` filters
     - Calculates DRR: `total_units / (end_date - start_date + 1)` 
     - Calculates Last 7 Days DRR from the last 7 days of the selected period
     - Returns data with columns: `platform_item_id`, `title`, `platform`, `drr`, `last_7_days_drr`
     - Also returns available platforms for dropdown
   - Added URL mapping in `api/urls.py` for `/api/drr-report/`

2. **Frontend: DRR Report Component** ✅
   - Added state management for DRR data, filters, and loading states
   - Created `fetchDrrData` function with date and platform filtering
   - Implemented `renderDrrTable` function displaying:
     - Platform Item ID
     - Title  
     - Platform
     - DRR (formatted with K/M suffixes)
     - Last 7 Days DRR (formatted with K/M suffixes)
   - Added date filters (start/end date) and platform dropdown
   - Integrated with existing tab navigation

3. **Frontend: UI Filters** ✅
   - Start Date and End Date input fields
   - Platform dropdown populated from backend data
   - "All Platforms" option for no platform filter
   - Refresh button to manually reload data
   - Auto-refresh when filters change

4. **Styling** ✅
   - Added CSS for platform select dropdown
   - Used existing table styling for consistent look
   - Responsive design maintained

5. **Pagination Implementation** ✅
   - Added pagination parameters to backend API (`page`, `page_size`)
   - Modified SQL query with LIMIT/OFFSET for performance
   - Added total count query for pagination metadata
   - DRR calculations now performed only on current page rows
   - Frontend pagination controls with:
     - Page size selector (10, 20, 50, 100 entries per page)
     - First/Previous/Next/Last navigation buttons
     - Current page and total pages display
     - Entry count information
   - Responsive pagination design for mobile devices
   - Auto-reset to page 1 when filters change

## Current Status

The DRR Report tab has been fully implemented with:
- ✅ Backend API endpoint with filtering and pagination
- ✅ Frontend component with table display  
- ✅ Date range filtering (start date, end date)
- ✅ Platform filtering
- ✅ DRR calculation (total units / days in period)
- ✅ Last 7 Days DRR calculation
- ✅ Pagination for improved performance (20 items per page default)
- ✅ Page size selection (10/20/50/100 entries)
- ✅ Proper error handling and loading states
- ✅ Responsive design with mobile-friendly pagination

## Performance Benefits

With pagination implemented:
- **Faster Page Loads**: Only loads 20 records at a time by default
- **Efficient DRR Calculations**: Calculations performed only on visible rows
- **Better Database Performance**: Uses LIMIT/OFFSET to reduce data transfer
- **Improved User Experience**: Easy navigation through large datasets
- **Scalable Architecture**: Can handle datasets with thousands of records

Ready for testing and deployment!


## Plan

### Table Sorting - COMPLETED ✅

1. Frontend
   - Added shared sorting state and helpers (`compareValues`, `handleSort`, `sortArrow`, `toggleSalesSummarySort`) in `frontend/src/App.js`
   - DRR table: Clickable headers to sort by ID, Title, Platform, DRR, Last 7 Days DRR, GMV, Units
   - Platform Sales Summary: Clickable headers to sort by Category, DRR, Last 7 days Avg, GMV, Units, ASP
   - Sales Performance (Target): Clickable headers to sort by Category, Current, Target, Projected, Attainment
   - Sales Performance (Weekly): Clickable headers to sort by Category, W1, W2, W3, W4
   - Sales Summary: Added toggle to sort platform columns by Sales GMV (asc/desc/none) and render columns in that order
   - Preserved centralized Lakhs/Crores number formatting for all tables

### Authentication & Access Control

1. Backend
   - Map existing `users` table to Django model (`AppUser`, unmanaged) ✅
   - Add JWT utilities and auth decorator ✅
   - Implement endpoints: `/api/auth/signup/`, `/api/auth/login/`, `/api/auth/me/` ✅
   - Protect data APIs (`consolidated-data`, `drr-report`, `platform-sales-summary`, `platform-sales-report`, `sales-performance-weekly`) with JWT ✅
   - Add dependency `PyJWT` ✅

2. Frontend
   - Create gated auth screen with Sign In / Sign Up toggle ✅
   - Store token in `localStorage` and add `Authorization` header to all API calls ✅
   - Show Logout in header ✅

3. Notes
   - Passwords are hashed using PBKDF2 with per-user random salt; stored as `salt_hex:hash_hex` in `password_hash`.
   - Tokens expire in 24 hours.

### Frontend Modular Restructure — IN PROGRESS

1. Goals
   - Split monolithic `src/App.js` into modular, testable units.
   - Establish clear directories: components, features, hooks, services, utils, constants, styles.
   - Preserve existing behavior (auth, data fetching, sorting, downloads, pagination).

2. Target Folder Structure
   - `src/components/`
     - `layout/Header.jsx`, `layout/Sidebar.jsx`
     - `auth/AuthCard.jsx`
     - `common/Pagination.jsx`
   - `src/features/sales/`
     - `OverallSummary.jsx`, `DRRReport.jsx`, `PlatformSummary.jsx`, `SalesPerformance.jsx`, `SalesContribution.jsx`, `DailyReport.jsx`
   - `src/hooks/`
     - `useProactiveTokenRefresh.js`
   - `src/services/`
     - `api.js`
   - `src/utils/`
     - `format.js`, `export.js`, `sort.js`
   - `src/constants/`
     - `modules.js`

3. Key Extractions
   - API config + interceptors → `services/api.js` with `initApiHandlers`.
   - Number formatting, XLSX export, sort helpers → `utils/`.
   - Auth UI → `components/auth/AuthCard.jsx`.
   - Layout (header, sidebar) → `components/layout/`.
   - Feature tabs → `src/features/sales/*` components encapsulating state/effects.

4. Orchestration
   - `App.js` manages auth token, module/tab routing, and brand selection; delegates to feature components.
   - Shared brand state passed as prop to features.

5. Acceptance
   - App starts, auth works, data loads across all tabs, downloads function, sorting/pagination preserved.
   - Lint passes for new files.

### Inventory Stock Levels Implementation - COMPLETED ✅

1. **Backend API Endpoint** ✅
   - Created `get_inventory_stock_levels` view in `api/views.py`:
     - Fetches data from `inventory_master_consolidated` table
     - Supports filtering by brand, platform, category, sub_category, warehouse_city, min_stock, max_stock
     - Includes pagination with configurable page sizes (10, 20, 50, 100)
     - Returns analytics summary with total SKUs, stock levels, inventory value, and stock status counts
     - Provides filter options for dropdowns (brands, platforms, categories, etc.)
   - Added URL mapping in `api/urls.py` for `/api/inventory-stock-levels/`

2. **Frontend Stock Levels Component** ✅
   - Created `StockLevels.jsx` in `src/features/inventory/` directory:
     - Comprehensive table displaying all inventory data fields
     - Multiple filter options with dropdowns and number inputs
     - Analytics summary cards showing key inventory metrics
     - Sortable columns for all data fields
     - Pagination with page size selection
     - Download to XLSX functionality
     - Color-coded stock status indicators
     - Responsive design for mobile and tablet devices

3. **Integration & Styling** ✅
   - Integrated inventory functionality into main `App.js`:
     - Added state management for inventory data, filters, and pagination
     - Created fetch function for inventory API calls
     - Added useEffect hooks for data loading and filter changes
     - Implemented download handler for inventory data export
     - Added tab handling for 'stock-levels' tab
   - Added comprehensive CSS styling in `App.css`:
     - Inventory table styling with proper spacing and typography
     - Stock status color coding (In Stock, Low Stock, Out of Stock, Overstock)
     - Analytics summary cards with grid layout
     - Dark mode support for all inventory components
     - Responsive design breakpoints for different screen sizes
     - Consistent styling with existing application components

4. **Features** ✅
   - **Filtering**: Brand, Platform, Category, Sub Category, Warehouse City, Min/Max Stock
   - **Analytics**: Total SKUs, Total Stock, Available/Reserved Stock, Inventory Value, Days of Stock, Stock Alerts
   - **Sorting**: All columns sortable with visual indicators
   - **Pagination**: Configurable page sizes with navigation controls
   - **Export**: XLSX download with all current data and applied filters
   - **Status Indicators**: Visual stock status with color coding
   - **Responsive**: Mobile-friendly design with adaptive layouts

5. **Data Fields Displayed** ✅
   - SKU, Title, Brand, Platform, Category, Sub Category
   - Warehouse City, Stock Quantity, Available Quantity, Reserved Quantity
   - Unit Cost, Total Value, Days of Stock, Stock Status, Last Updated

The inventory stock levels feature is fully functional and ready for use!

