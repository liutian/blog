export function resizeHighOrder({ index, rectX, rectY, rectWidth, rectHeight }) {
  let oneWayDrag, fixedPointX, fixedPointY, oneWayXLength, oneWayYLength, lastX, lastY;

  if (index === 0) {
    oneWayDrag = false;
    fixedPointX = rectX + rectWidth;
    fixedPointY = rectY + rectHeight;
  } else if (index === 1) {
    oneWayDrag = true;
    fixedPointX = rectX;
    fixedPointY = rectY + rectHeight;
    oneWayXLength = rectWidth;
  } else if (index === 2) {
    oneWayDrag = false;
    fixedPointX = rectX;
    fixedPointY = rectY + rectHeight;
  } else if (index === 3) {
    oneWayDrag = true;
    fixedPointX = rectX;
    fixedPointY = rectY;
    oneWayYLength = rectHeight;
  } else if (index === 4) {
    oneWayDrag = false;
    fixedPointX = rectX;
    fixedPointY = rectY;
  } else if (index === 5) {
    oneWayDrag = true;
    fixedPointX = rectX;
    fixedPointY = rectY;
    oneWayXLength = rectWidth;
  } else if (index === 6) {
    oneWayDrag = false;
    fixedPointX = rectX + rectWidth;
    fixedPointY = rectY;
  } else if (index === 7) {
    oneWayDrag = true;
    fixedPointX = rectX + rectWidth;
    fixedPointY = rectY;
    oneWayYLength = rectHeight;
  }


  return function resize(x, y) {
    if (oneWayDrag) {
      if (oneWayXLength !== undefined) {
        return {
          x: fixedPointX,
          y: Math.min(y, fixedPointY),
          width: oneWayXLength,
          height: Math.abs(fixedPointY - y),
        }
      } else {
        return {
          x: Math.min(x, fixedPointX),
          y: fixedPointY,
          width: Math.abs(x - fixedPointX),
          height: oneWayYLength
        }
      }
    } else {
      return {
        x: Math.min(x, fixedPointX),
        y: Math.min(y, fixedPointY),
        width: Math.abs(x - fixedPointX),
        height: Math.abs(y - fixedPointY)
      }
    }
  }
}

export function moveHighOrder({ offsetX, offsetY, rectWidth, rectHeight, hostWidth, hostHeight }) {
  return function (x, y) {
    let _x = x - offsetX;
    let _y = y - offsetY;

    if (_x <= 0) {
      _x = 0;
    } else if (_x >= hostWidth - rectWidth) {
      _x = hostWidth - rectWidth;
    }

    if (_y <= 0) {
      _y = 0;
    } else if (_y >= hostHeight - rectHeight) {
      _y = hostHeight - rectHeight;
    }

    return {
      x: _x,
      y: _y
    }
  }
}

export function fixedPositionHighOrder(hostWidth, hostHeight, maxWidth, maxHeight, minHeight, offsetY) {
  return function (x, y, width, height) {
    let positionX, positionY, location = 0;

    if (y + height + maxHeight + offsetY > hostHeight) {
      positionY = y - minHeight - offsetY;
      location |= 1;
    } else {
      positionY = y + height + offsetY;
      location |= 2;
    }

    if (x + maxWidth > hostWidth) {
      positionX = x + width - maxWidth;
      location |= 4;
    } else {
      positionX = x;
      location |= 8;
    }

    return {
      x: positionX,
      y: positionY,
      location // 从左到右从高到低 1001 101 110  1010
    }
  }
}

export function installListener(list) {
  const _list = list.filter(item => item);
  _list.forEach(item => {
    item[0].addEventListener(item[1], item[2], item[3]);
  });

  return function () {
    _list.forEach(item => {
      item[0].removeEventListener(item[1], item[2], item[3]);
    })
  }
}


export function getPositionColor(imageData, x, y) {
  if (!imageData || !imageData.data) {
    return [0, 0, 0, 0];
  }
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
    return [0, 0, 0, 0];
  }

  const colorIndex = imageData.width * y * 4 + x * 4;
  return imageData.data.slice(colorIndex, colorIndex + 4)
}

export function getPositionAreaColors(imageData, x, y, offset = 2) {
  let colors = [];
  if (!imageData || !imageData.data) {
    return colors;
  }

  for (let i = x - offset, j = y - offset; ;) {
    const color = getPositionColor(imageData, i, j);
    colors.push(color);
    i++;
    if (i > x + offset) {
      i = x - offset;
      j++;
    }
    if (j > y + offset) {
      break;
    }
  }
  return colors;
}

export function detectPositionAnchor(x, y, width, height, posX, posY, size) {
  return getAnchors(x, y, width, height).findIndex(([anchorX, anchorY]) => {
    return posX >= anchorX - size && posX <= anchorX + size && posY >= anchorY - size && posY <= anchorY + size;
  });
}

export function initCanvas(container, selector, width, height) {
  const canvas = container.querySelector(selector);
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.addEventListener('error', (error) => {
      reject(error);
    });
  });
}

export function getAnchors(x, y, width, height) {
  return [
    [x, y],
    [x + width / 2, y],
    [x + width, y],
    [x + width, y + height / 2],
    [x + width, y + height],
    [x + width / 2, y + height],
    [x, y + height],
    [x, y + height / 2],
  ]
}

const cursor = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
export function parseCursor(index) {
  return cursor[index];
}
