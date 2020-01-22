import MaLiang from './MaLiang.js';

const img = new Image();
img.addEventListener('load', init);
img.src = './bg.png';

function init() {
  new Paint({
    container: '#container',
    bgImage: img,
    width: img.width,
    height: img.height
  });
}