import { el, El } from './el';

export function styled<T extends keyof HTMLElementTagNameMap>(tag: T) {
  return (className: string): ((...p: Parameters<El[T]>) => HTMLElementTagNameMap[T]) => {
    type ElParams = Parameters<El[T]>;
    return (...params: ElParams) => {
      const [attributes, ...children] = params;

      return el[tag]({ className, ...attributes }, ...children);
    };
  };
}
