// if no types are provided by tbe library, have the compiler still accept our import

declare module "saxonjs-he" {
  export function transform(options: any, type: "sync"): any;
  export function transform(options: any, type: "async"): Promise<any>;
  export function getResource(options: any): Promise<any>;
  // You can add more as you go, but this stops the error
}

// pdfkit 0.19 writes the table cell Scope attribute; @types/pdfkit 0.17 does not know the option yet
declare namespace PDFKit.Mixins {
  interface StructureElementOptions {
    scope?: "Row" | "Column" | "Both";
  }
}
