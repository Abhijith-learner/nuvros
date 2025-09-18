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


