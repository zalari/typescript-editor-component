import monaco from 'monaco-editor';

declare global {
  interface Window {
    monaco: typeof monaco;
    _TSisInitialized: Promise<number>;
  }
}
