import type { NextFunction } from "express";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const textExtractor = async (
  buffer: Buffer,
  extension: string,
) => {
  const fileExtension = extension.toLocaleLowerCase();
  if (fileExtension === "pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }
  if (fileExtension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }
  if (fileExtension === "doc") {
    throw new Error(
      "Legacy DOC files are not supported yet. Please upload a PDF or DOCX file.",
    );
  }

  throw new Error("Unsupported resume file format");
};
export default textExtractor