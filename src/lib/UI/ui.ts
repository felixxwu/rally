export const ui = document.getElementById('ui');

export const el = <T extends string>(tag: T, props: { [key: string]: string }) => {
  const element = document.createElement(tag);

  for (const key in props) {
    element.setAttribute(key, props[key]);
  }

  return element;
};
