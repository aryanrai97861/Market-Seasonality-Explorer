
import { CalendarDay, MarketDataPoint } from '@/types/market-data';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function exportToCSV(data: CalendarDay[], filename: string = 'market-data.csv') {
  const headers = ['Date', 'Symbol', 'Volatility Level', 'Performance %', 'Volume', 'Price Change %'];
  const csvContent = [
    headers.join(','),
    ...data.map(day => [
      day.date,
      day.marketData?.symbol || '',
      day.volatilityLevel,
      day.performance.toFixed(2),
      day.volume.toFixed(0),
      day.marketData?.priceChangePercent?.toFixed(2) || '0'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToPDF(elementId: string, filename: string = 'market-calendar.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: '#0f172a',
    scale: 2,
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'mm', 'a4');
  const imgWidth = 297;
  const pageHeight = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

export function exportToImage(elementId: string, filename: string = 'market-calendar.png') {
  const element = document.getElementById(elementId);
  if (!element) return;

  html2canvas(element, {
    backgroundColor: '#0f172a',
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  });
}
