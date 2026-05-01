// ── PDF text extraction using pdf.js ──
import * as pdfjsLib from "pdfjs-dist";

// Use Vite's asset handling to load the worker correctly from the package
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: true,
      isEvalSupported: false,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = "";

    // Limit to first 20 pages to avoid crashing on huge PDFs
    const maxPages = Math.min(pdf.numPages, 20);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += `\n[Page ${pageNum}]\n${pageText}\n`;
    }

    return fullText.trim();
  } catch (err) {
    console.error("PDF Extraction Error:", err);
    throw new Error(`Failed to read PDF: ${err.message}`);
  }
}
