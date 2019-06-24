import { default as monacoNamespace } from 'monaco-editor';
export {}
declare global {
  const require: any;
  const ts: any;
  const monaco: typeof monacoNamespace;
}
