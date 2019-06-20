import { Component, Element, h, Listen, Prop } from '@stencil/core';
import { scriptLoader } from '../../utils/utils';
import { languages } from 'monaco-editor';
import CompilerOptions = languages.typescript.CompilerOptions;

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
    // and typescript as wellz
    scriptLoader(body, this.baseUrl + 'vendor/typescript/typescript.js');

  }

  private _editorHost: HTMLDivElement;
  private _logHost: HTMLDivElement;

  @Element() private _elementRef: HTMLElement;

  private _editorInstance: any;

  private _currentEditorContent = '';
  private _initialCode = [
    'function x() {',
    '\tconsole.log("Hello world!");',
    '}'
  ].join('\n');

  private _initializeMonaco() {
    console.info('Initialize Monaco...');
    require.config({ paths: { 'vs': this.baseUrl + 'vendor/monaco-editor/min/vs' } });
  }

  private _attachEditorToHostElement(hostElement: HTMLElement) {
    console.log('Attach!');
    require(['vs/editor/editor.main'], () => {
      // creatting the monaco editor and save the instance for it
      this._editorInstance = monaco.editor.create(hostElement, {
        value: this._initialCode,
        language: 'typescript'
      });

      // we want to get notified for changes
      const model = this._editorInstance.getModel();
      model.onDidChangeContent(() => {
        const value = model.getValue();
        this.onEditorChange(value);
      });


    });
  }

  private _attachLog() {
    // monkey patch console.log because that is how we program
    const orgConsoleLog = console.log;
    console.log = (...args) => {
      // attach the logs to the logHost
      // by naively assuming all our arguments will be easily coerced into strings...
      const logOutput = args.map(arg => arg + '').join(' ');
      this._logHost.innerHTML += logOutput + '<br/>';
      // and call the original one...
      orgConsoleLog.apply(window, args);
    }

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
    eval(transpiledJs);
  }

  private _fetchInitialCodeFromElement() {
    // try to fetch initialCode, if there is a code tag there...
    if (this._elementRef.querySelector('code')) {
      this._initialCode = this._elementRef.querySelector('code').innerText;
      console.info('Got me initialCode', this._initialCode);
    }

  }

  onEditorChange(content) {
    // console.log('Editor changed content to', content);
    this._currentEditorContent = content;
  }

  componentWillLoad() {
  }

  componentDidLoad() {
    this._fetchInitialCodeFromElement();
    // we need some time...
    setTimeout(() => {
      // initialize monaco
      this._initializeMonaco();
      this._attachEditor();
      this._attachLog();
    }, 1000);
  }

  @Listen('keydown')
  handleKeyInput(ev: KeyboardEvent) {
    // ALT_RIGHTTTZZZZZ or the right option key on MäckOHS
    if (ev.code === 'AltRight') {
      this._ev0lTypeScript(this._currentEditorContent);
    }
  }

  render() {
    return <div>
      <div ref={ el => this._editorHost = el }
           class="editor"
      ></div>
      <div ref={ el => this._logHost = el } class="log">&nbsp;</div>
      <div class="code">
        <slot/>
      </div>
    </div>;
  }
}
