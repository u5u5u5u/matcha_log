declare module 'heic-convert' {
  interface ConvertOptions {
    buffer: ArrayBuffer;
    format: 'JPEG' | 'PNG';
    quality?: number;
  }
  
  interface ConvertResult {
    buffer: ArrayBuffer;
    width: number;
    height: number;
  }
  
  function convert(options: ConvertOptions): Promise<ConvertResult>;
  export { convert };
}
