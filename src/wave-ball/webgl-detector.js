function isWebglSupported() {
  let isSupported;

  try {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (e) {
    console.log(e);
    return;
  }

  isSupported = (ctx !== undefined);
  canvas = undefined;
  return isSupported;
}
