
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set worker source for pdf.js. Using a CDN for simplicity.
// This is crucial for the library to work in a web environment.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const numPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Using 'str' property check to satisfy TypeScript's type guard for TextItem
            const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error("Error reading PDF:", error);
        throw new Error("Failed to extract text from PDF. The file may be corrupt or protected.");
    }
};
