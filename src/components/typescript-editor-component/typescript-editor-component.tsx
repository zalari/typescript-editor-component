import { Component, h, Prop } from '@stencil/core';
import { scriptLoader } from '../../utils/utils';

@Component({
  tag: 'typescript-editor-component',
  styleUrl: 'typescript-editor-component.css',
  shadow: false
})
export class TypescriptEditorComponent {

  @Prop() baseUrl: string = '';

  constructor() {
    // only load the vs-loader stuff only once
    console.log('Loading vs-loader');
    const body = document.getElementsByTagName('body')[0];
    scriptLoader(body, this.baseUrl + 'vendor/monaco-editor/min/vs/loader.js');
  }

  private _editorHost: HTMLDivElement;

  private _initializeMonaco() {
    console.info('Initialize Monaco...');
    require.config({ paths: { 'vs': this.baseUrl + 'vendor/monaco-editor/min/vs' } });
  }

  private _attachEditorToHostElement(hostElement: HTMLElement) {
    console.log('Attach!');
    require(['vs/editor/editor.main'], function () {
      monaco.editor.create(hostElement, {
        value: [
          'function x() {',
          '\tconsole.log("Hello world!");',
          '}'
        ].join('\n'),
        language: 'typescript'
      });
    });
  }

  private _attachEditor() {
    this._attachEditorToHostElement(this._editorHost);
  }

  componentWillLoad() {
  }

  componentDidLoad() {
    // we need some time...
    setTimeout(() => {
      // initialize monaco
      this._initializeMonaco();
      this._attachEditor();
    }, 1000);
  }

  render() {
    return <div>
      <div ref={ el => this._editorHost = el }
           class="editor"
      > </div>
    </div>;
  }
}
