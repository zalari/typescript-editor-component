import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'typescript-editor-component',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  copy: [
    {
      src: '../node_modules/monaco-editor/', dest: 'vendor/monaco-editor/'
    }
  ]
};
