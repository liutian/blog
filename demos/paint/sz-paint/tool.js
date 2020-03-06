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

const colorObj = {
  red: 'rgba(255,0,0,1)',
  yellow: 'rgba(255,255,0,1)',
  blue: 'rgba(0,0,255,1)',
  green: 'rgba(0,255,0,1)',
  gray: 'rgba(128,128,128,1)',
  white: 'rgba(255,255,255,1)'
};

const r_colorObj = {
  '255,0,0': 'red',
  '255,255,0': 'yellow',
  '0,0,255': 'blue',
  '0,255,0': 'green',
  '128,128,128': 'gray',
  '255,255,255': 'white'
}

export function resolveColor(color) {
  return colorObj[color];
}

export function reverseColor(colors) {
  return r_colorObj[colors.slice(0, 3).join(',')];
}

const sizeObj = {
  rect: {
    small: 1,
    normal: 3,
    large: 6
  },
  circular: {
    small: 1,
    normal: 3,
    large: 4
  },
  arrow: {
    small: 1,
    normal: 3,
    large: 4
  },
  paint: {
    small: 1,
    normal: 3,
    large: 4
  },
  mosaic: {
    small: 1,
    normal: 3,
    large: 4
  }
}
export function resolveSize(type, size) {
  return sizeObj[type][size];
}