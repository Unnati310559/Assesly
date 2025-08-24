import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import mammoth from 'mammoth';

// Set worker source for pdf.js to a stable CDN URL. This is critical for browser environments.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.mjs';

/**
 * Parses the content of a File object into a text string.
 * Supports PDF, DOCX, and TXT files.
 * @param file The file to parse.
 * @returns A promise that resolves with the extracted text.
 */
export const parseFile = async (file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'pdf' || file.type === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) {
          return reject(new Error("Failed to read file."));
        }
        try {
          const pdf = await pdfjsLib.getDocument(event.target.result as ArrayBuffer).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Ensure item.str exists before joining
            text += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
          }
          resolve(text);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          reject(new Error('Could not parse the PDF file. It might be corrupted or protected.'));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file."));
      reader.readAsArrayBuffer(file);
    });
  } else if (fileExtension === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) {
          return reject(new Error("Failed to read file."));
        }
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
          resolve(result.value);
        } catch (error) {
          console.error('Error parsing DOCX:', error);
          reject(new Error('Could not parse the DOCX file.'));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file."));
      reader.readAsArrayBuffer(file);
    });
  } else if (fileExtension === 'txt' || file.type === 'text/plain') {
    return file.text();
  } else {
    return Promise.reject(new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.'));
  }
};
