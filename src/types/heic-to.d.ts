declare module 'heic-to' {
  interface ConvertOptions {
    blob: Blob;
    type: string;
    quality?: number;
  }
  
  function heicTo(options: ConvertOptions): Promise<Blob>;
  export { heicTo };
}
