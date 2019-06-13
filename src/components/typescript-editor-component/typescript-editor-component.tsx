import { Component, Prop, h } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'typescript-editor-component',
  styleUrl: 'typescript-editor-component.css',
  shadow: false
})
export class TypescriptEditorComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private _editorHost: HTMLDivElement;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  private _initializeMonaco() {
    console.info('Initialize Monaco...');
    require.config({ paths: { 'vs': '/vendor/monaco-editor/min/vs' } });
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
    // initialize monaco
    this._initializeMonaco();
  }

  componentDidLoad() {
    this._attachEditor();
  }

  render() {
    return <div>
      <div>Hello, World! I'm { this.getText() }</div>
      <div ref={el => this._editorHost = el} class="editor"> </div>
    </div>;
  }
}
