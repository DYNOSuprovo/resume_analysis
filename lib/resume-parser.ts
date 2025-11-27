import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF parsing error:", error);
        throw new Error("Failed to parse PDF file");
    }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error("DOCX parsing error:", error);
        throw new Error("Failed to parse DOCX file");
    }
}

export async function extractResumeText(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
        return extractTextFromPDF(buffer);
    } else if (ext === 'docx' || ext === 'doc') {
        return extractTextFromDOCX(buffer);
    } else {
        throw new Error("Unsupported file type. Please upload PDF or DOCX.");
    }
}
