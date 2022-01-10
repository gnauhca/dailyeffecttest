export function setStyles(elem, styles) {
  for (const item in styles) {
    let value = styles[item];

    if (typeof value === 'number') {
      value += 'px';
    }

    elem.style[item] = value;
  }
}
