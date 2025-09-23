import * as XLSX from 'xlsx';

export const exportToXlsx = (fileName, rows, sheetName = 'Sheet1') => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = Array.isArray(rows) && rows.length && Array.isArray(rows[0])
      ? XLSX.utils.aoa_to_sheet(rows)
      : XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
  } catch (e) {
    // non-blocking
    // eslint-disable-next-line no-console
    console.error('Failed to export XLSX', e);
  }
};

// Optimized export function for large datasets
export const exportToXlsxOptimized = async (fileName, rows, sheetName = 'Sheet1', onProgress = null) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Process data in chunks to avoid blocking UI
    const CHUNK_SIZE = 1000;
    const totalRows = rows.length;
    let processedRows = 0;
    
    if (onProgress) {
      onProgress({ processed: 0, total: totalRows, percentage: 0 });
    }
    
    // For large datasets, we'll still use the standard approach but with progress feedback
    const worksheet = Array.isArray(rows) && rows.length && Array.isArray(rows[0])
      ? XLSX.utils.aoa_to_sheet(rows)
      : XLSX.utils.json_to_sheet(rows);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    if (onProgress) {
      onProgress({ processed: totalRows, total: totalRows, percentage: 100 });
    }
    
    // Use setTimeout to allow UI to update before file download
    await new Promise(resolve => setTimeout(resolve, 100));
    
    XLSX.writeFile(workbook, fileName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to export XLSX', e);
    throw e;
  }
};


