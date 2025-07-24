import { useRef } from 'react';
import { CalendarDay } from '@/types/market-data';
import { exportToCSV, exportToPDF, exportToImage } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileImage, FileDown } from 'lucide-react';

/**
 * Props for ExportMenu component.
 * @property calendarDays - The calendar data to be exported
 * @property exportElementId - The DOM element id to export as PDF/image (default: 'calendar-export-root')
 */
interface ExportMenuProps {
  calendarDays: CalendarDay[];
  exportElementId?: string; // id of the element to export as PDF/image
}

/**
 * ExportMenu provides export options for calendar data: CSV (reliable), PDF, and Image (may not work if exportElementId is missing in DOM).
 * - CSV export is always available and reliable.
 * - PDF/Image export depends on a DOM element with id exportElementId; if missing, export will fail silently.
 */
export default function ExportMenu({ calendarDays, exportElementId = 'calendar-export-root' }: ExportMenuProps) {
  const exporting = useRef(false);

  /**
   * Handles exporting calendar data as CSV.
   * Uses exportToCSV utility. Always works reliably.
   */
  const handleExportCSV = () => {
    if (exporting.current) return;
    exporting.current = true;
    exportToCSV(calendarDays);
    setTimeout(() => { exporting.current = false; }, 1000);
  };

  /**
   * Handles exporting calendar data as PDF.
   * Uses exportToPDF utility. Will silently fail if exportElementId is not present in the DOM.
   */
  const handleExportPDF = async () => {
    if (exporting.current) return;
    exporting.current = true;
    await exportToPDF(exportElementId);
    exporting.current = false;
  };

  /**
   * Handles exporting calendar data as an image (PNG).
   * Uses exportToImage utility. Will silently fail if exportElementId is not present in the DOM.
   */
  const handleExportImage = async () => {
    if (exporting.current) return;
    exporting.current = true;
    await exportToImage(exportElementId);
    exporting.current = false;
  };

  return (
    <div className="flex flex-col space-y-2 min-w-[160px] bg-slate-800 rounded-lg shadow-lg p-3 border border-slate-700">
      <Button onClick={handleExportCSV} variant="ghost" className="justify-start w-full">
        <FileText className="mr-2 w-4 h-4" /> Export CSV
      </Button>
      <Button onClick={handleExportPDF} variant="ghost" className="justify-start w-full">
        <FileDown className="mr-2 w-4 h-4" /> Export PDF
      </Button>
      <Button onClick={handleExportImage} variant="ghost" className="justify-start w-full">
        <FileImage className="mr-2 w-4 h-4" /> Export Image
      </Button>
    </div>
  );
}
