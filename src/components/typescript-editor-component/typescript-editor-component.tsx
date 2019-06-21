import { Component, ComponentDidLoad, Element, h, Listen, Prop } from '@stencil/core';
import { languages } from 'monaco-editor';
import { scriptLoader } from '../../utils/utils';
import CompilerOptions = languages.typescript.CompilerOptions;

@Component({
  tag: 'typescript-editor-component',
  styleUrl: 'typescript-editor-component.scss',
  shadow: false
})
export class TypescriptEditorComponent implements ComponentDidLoad {

  @Element() private _elementRef: HTMLTypescriptEditorComponentElement;

  private _editorHost: HTMLDivElement;

  private _logHost: HTMLLogComponentElement;

  private _editorInstance: any;

  private _currentEditorContent = '';

  private _initialCode = [
    'function x() {',
    '\tconsole.log("Hello world!");',
    '}'
  ].join('\n');

  @Prop() baseUrl: string = '';

  constructor() {
    // only load the vs-loader stuff only once
    // because Stencil is calling the constructor for every attachedCallback internally
    // we have to rely on a global promise
    // if it is unset, do the initial stuff and set the promise
    if (!window['_TSisInitialized']) {
      console.log('Loading vs-loader');
      const body = document.getElementsByTagName('body')[0];

      window['_TSisInitialized'] = Promise
        .all([
          scriptLoader(body, this.baseUrl + 'vendor/monaco-editor/min/vs/loader.js'),
          scriptLoader(body, this.baseUrl + 'vendor/typescript/typescript.js')
        ])
        .then(() => setTimeout(() => this._initializeMonaco(), 500));
    }
  }

  onEditorChange(content) {
    // console.log('Editor changed content to', content);
    this._currentEditorContent = content;
  }

  componentDidLoad() {
    // await global initialization
    window['_TSisInitialized'].then(() => {
      this._fetchInitialCodeFromElement();
      // we need some time...
      setTimeout(() => this._attachEditor(), 1000);
    });
  }

  @Listen('keydown')
  handleKeyInput(ev: KeyboardEvent) {
    // ALT_RIGHTTTZZZZZ or the right option key on MäckOHS
    if (ev.code === 'AltRight') {
      this._ev0lTypeScript(this._currentEditorContent);
    }
  }

  render() {
    return [
      <div ref={ el => this._editorHost = el }
           class="editor"
      />,
      <log-component ref={ el => this._logHost = el }
                     class="log"
      />,
      <div class="code">
        <slot/>
      </div>
    ];
  }

  private _initializeMonaco() {
    console.info('Initialize Monaco...');
    // set config and expose monaco globally
    require.config({ paths: { 'vs': this.baseUrl + 'vendor/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], () => {
      // creating the monaco editor and expose monaco
      window['monaco'] = monaco;
    });
  }

  private _attachEditorToHostElement(hostElement: HTMLElement) {
    console.log('Attach!');
    // creating the monaco editor and save the instance for it
    this._editorInstance = monaco.editor.create(hostElement, {
      value: this._initialCode,
      language: 'typescript',
      theme: 'vs-dark',
      minimap: {
        enabled: false
      }
    });

    // we want to get notified for changes
    const model = this._editorInstance.getModel();
    model.onDidChangeContent(() => {
      const value = model.getValue();
      this.onEditorChange(value);
    });
  }

  private _attachEditor() {
    this._attachEditorToHostElement(this._editorHost);
  }

  private _transformTypeScript(inputCode: string, compilerOptions?: CompilerOptions): string {

    let result = ts.transpileModule(inputCode, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS
      }
    });

    return result.outputText;

  }

  private _ev0lTypeScript(inputCode: string, compilerOptions?: CompilerOptions) {
    // now transpile it and ev0l() it!
    const transpiledJs = this._transformTypeScript(inputCode);
    // console.log('transpiled', transpiledJs);
    // clear log before transpiling
    // this._logHost.clear();
    eval(transpiledJs);
  }

  private _fetchInitialCodeFromElement() {
    // try to fetch initialCode, if there is a code tag there...
    if (this._elementRef.querySelector('code')) {
      this._initialCode = this._elementRef.querySelector('code').innerText;
      console.info('Got me initialCode', this._initialCode);
    }

  }

}
