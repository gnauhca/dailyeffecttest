import { prefix } from 'inline-style-prefixer';

export default {
  css (node, style) {
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      const prefixedStyle = prefix(style);
      const autoPxAttrs = ['top', 'left', 'width', 'height'];
      for (const key in prefixedStyle) {
        if (Object.prototype.hasOwnProperty.call(prefixedStyle, key)) {
          if (typeof prefixedStyle[key] === 'number' && autoPxAttrs.indexOf(key) > -1) {
            node.style[key] = prefixedStyle[key] + 'px';
          }
          else {
            node.style[key] = prefixedStyle[key];
          }
        }
      }
    }
  },
  contains (root, n) {
    let node = n;
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  },
};