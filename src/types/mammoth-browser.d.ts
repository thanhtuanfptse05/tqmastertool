// Type declaration for mammoth browser bundle
// Used in LabDocViewer to render DOCX files in-browser without server-side Node.js APIs

declare module "mammoth/mammoth.browser" {
  interface ConversionResult {
    value: string;
    messages: Array<{
      type: "error" | "warning";
      message: string;
      paragraph?: unknown;
    }>;
  }

  interface ConvertOptions {
    arrayBuffer: ArrayBuffer;
  }

  export function convertToHtml(options: ConvertOptions): Promise<ConversionResult>;
  export function convertToMarkdown(options: ConvertOptions): Promise<ConversionResult>;
  export function extractRawText(options: ConvertOptions): Promise<ConversionResult>;
}
