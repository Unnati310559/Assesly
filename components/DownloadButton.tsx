
import React from 'react';
import { jsPDF } from 'jspdf';
import { DownloadIcon } from './icons';

interface DownloadButtonProps {
  textToDownload: string;
  filename: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ textToDownload, filename }) => {
  const handleDownload = () => {
    if (!textToDownload) return;
    
    try {
        const doc = new jsPDF();
        
        // Add the text to the PDF. The 'splitTextToSize' method handles line breaks.
        const textLines = doc.splitTextToSize(textToDownload, 180); // 180 is the max width in mm
        doc.text(textLines, 15, 15);
        
        doc.save(`${filename}.pdf`);
    } catch (e) {
        console.error("Failed to generate PDF:", e);
        alert("Sorry, there was an error generating the PDF.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:bg-slate-800 disabled:cursor-not-allowed"
      disabled={!textToDownload}
      aria-label={`Download ${filename} as PDF`}
    >
      <DownloadIcon className="w-4 h-4" />
      <span>PDF</span>
    </button>
  );
};