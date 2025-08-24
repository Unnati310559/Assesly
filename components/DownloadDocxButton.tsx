
import React from 'react';
import { Document, Packer, Paragraph } from 'docx';
import saveAs from 'file-saver';
import { DownloadIcon } from './icons';

interface DownloadDocxButtonProps {
  textToDownload: string;
  filename: string;
}

export const DownloadDocxButton: React.FC<DownloadDocxButtonProps> = ({ textToDownload, filename }) => {
  const handleDownload = async () => {
    if (!textToDownload) return;
    
    try {
      // Split text by newlines to create multiple paragraphs, preserving formatting.
      const paragraphs = textToDownload.split('\n').map(line => new Paragraph({ text: line }));

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${filename}.docx`);
    } catch (e) {
      console.error("Failed to generate DOCX:", e);
      alert("Sorry, there was an error generating the DOCX file.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:bg-slate-800 disabled:cursor-not-allowed"
      disabled={!textToDownload}
      aria-label={`Download ${filename} as DOCX`}
    >
      <DownloadIcon className="w-4 h-4" />
      <span>DOCX</span>
    </button>
  );
};
