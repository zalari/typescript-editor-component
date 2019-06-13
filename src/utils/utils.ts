
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}

/**
 * loads a js-file dynamically and inserts script tag
 * @param hostElement
 * @param url
 */
export function scriptLoader(hostElement: HTMLElement, url: string): void {

  console.log('Should load from ', url);

  const scriptElement: HTMLScriptElement = document.createElement('script');
  scriptElement.src = url;

  hostElement.append(scriptElement);



}
