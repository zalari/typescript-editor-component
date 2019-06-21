/**
 * loads a js-file dynamically and inserts script tag
 * @param hostElement
 * @param url
 */
export async function scriptLoader(hostElement: HTMLElement = document.head, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Should load from ', url);
    const scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.onload = () => resolve();
    scriptElement.onerror = () => reject();
    scriptElement.src = url;
    hostElement.append(scriptElement);
  });
}
