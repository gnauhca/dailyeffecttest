export function setStyles(elem, styles) {
  for (let item in styles) {
    let value = styles[item];

    if (typeof value === 'number') {
      value += 'px';
    }

    elem.style[item] = value;
  }
}