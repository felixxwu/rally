declare const Proxy;

export const el = new Proxy(
  {},
  {
    get(_, tag) {
      return (attributes: any, ...children: (HTMLElement | string)[]) => {
        const element = document.createElement(tag as keyof HTMLElementTagNameMap);
        for (const key in attributes) {
          element[key] = attributes[key];
        }
        attributes.oncreate?.(element);
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else {
            element.appendChild(child);
          }
        });
        return element;
      };
    },
  }
) as El;

export type El = {
  [tag in keyof HTMLElementTagNameMap]: (
    attributes: {
      [key in keyof HTMLElementTagNameMap[tag]]?: string;
    } & {
      oncreate?: (element: HTMLElementTagNameMap[tag]) => void;
    },
    ...children: (HTMLElement | string)[]
  ) => HTMLElementTagNameMap[tag];
};
