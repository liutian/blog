
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


export function setHandlePoints(points) {
  points[0].style.cssText = `
    left: -5px;
    top: -5px;
    cursor: nwse-resize;
  `;

  points[1].style.cssText = `
    left: calc(50% - 4px);
    top: -5px;
    cursor: ns-resize;
  `;

  points[2].style.cssText = `
    left: calc(100% - 3px);
    top: -5px;
    cursor: nesw-resize;
  `;

  points[3].style.cssText = `
    left: calc(100% - 3px);
    top: calc(50% - 4px);
    cursor: ew-resize;
  `;

  points[4].style.cssText = `
    left: calc(100% - 3px);
    top: calc(100% - 3px);
    cursor: nwse-resize;
  `;

  points[5].style.cssText = `
    left: calc(50% - 4px);
    top: calc(100% - 3px);
    cursor: ns-resize;
  `;

  points[6].style.cssText = `
    left: -5px;
    top: calc(100% - 3px);
    cursor: nesw-resize;
  `;

  points[7].style.cssText = `
    left: -5px;
    top: calc(50% - 4px);
    cursor: ew-resize;
  `;
}