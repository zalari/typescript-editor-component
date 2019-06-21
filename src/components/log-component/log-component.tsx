import { Component, ComponentDidLoad, Element, h, Method, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'log-component',
  styleUrl: 'log-component.scss',
  shadow: true
})
export class LogComponent implements ComponentDidLoad {

  @Element()
  private _elementRef: HTMLLogComponentElement;

  private _logHost: HTMLDivElement;

  @Prop() showTimestamp = true;

  @Watch('showTimestamp')
  toggleTimestamps() {
    this._elementRef.classList.toggle('show-timestamp', this.showTimestamp);
  }

  componentDidLoad() {
    // attach to log method(s)
    this._attachLog();

    // kick start watchers
    this.toggleTimestamps();
  }

  render() {
    return (
      <div ref={ el => this._logHost = el }
           class="log"
      />
    );
  }

  @Method()
  async clear() {
    this._logHost.innerHTML = '';
  }

  private _renderTime(): string {
    const now = new Date();
    const h = now.getHours()
      .toString()
      .padStart(2, '0');
    const m = now.getMinutes()
      .toString()
      .padStart(2, '0');
    const s = now.getSeconds()
      .toString()
      .padStart(2, '0');
    const x = now.getMilliseconds()
      .toString()
      .padStart(3, '0');

    return `${ h }:${ m }:${ s }.${ x }`;
  }

  // TODO: add console.warn, console.error, etc.
  private _attachLog() {
    // monkey patch console.log because that is how we program
    const orgConsoleLog = console.log;
    console.log = (...args) => {
      // attach the logs to the logHost
      // by naively assuming all our arguments will be easily coerced into strings...
      const logOutput = args
        .map(arg => arg + '')
        .join(' ');
      const timestamp = this.showTimestamp ? this._renderTime() : '';
      this._logHost.innerHTML += `<span class="entry"><span class="timestamp">${ timestamp }</span>${ logOutput }</span>`;
      // and call the original one...
      orgConsoleLog.apply(window, args);
      // scroll down
      this._logHost.scrollTop = this._logHost.scrollHeight;
    };
  }

}
