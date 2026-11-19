import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadReceiptAsPDF = async (elementId: string, receiptNumber: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`EduPay_Receipt_${receiptNumber}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Fallback: standard window print
    window.print();
  }
};
