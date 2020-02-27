
const HOST_STYLE = `
  :host {
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    filter: brightness(0.6);
  }

  .persistence {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }

  .realtime {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }

  .mouse-point {
    position: absolute;
    left: 10000px;
    top: 0;
    width: 120px;
    z-index: 1;
    pointer-events: none;
  }

  .point-info {
    line-height: 1.3;
    padding: 5px 0 5px 5px;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
    user-select: none;
  }

  .clip-frame {
    position: absolute;
    top: 0;
    left: 10000px;
    border: solid 2px #00ccff;
    box-sizing: border-box;
  }

  .resize-anchor {
    position: absolute;
    width: 8px;
    height: 8px;
    border: solid #00ccff 1px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    box-sizing: border-box;
  }

  .clip-info {
    position: absolute;
    left: 5px;
    top: 0;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
    width: 100px;
    user-select: none;
    cursor: auto;
  }

  .primary-tool {
    display: inline-block;
    background-color: #4c4c4c;
    border-radius: 4px;
    text-align: left;
    padding: 5px 20px;
  }

  .secondary-tool {
    position: absolute;
    background-color: #4c4c4c;
    border-radius: 4px;
    text-align: left;
    padding: 5px 10px;
    box-sizing: border-box;
  }

  .location-marker {
    position: absolute;  
    border: solid 5px transparent;
    border-bottom-color: #4c4c4c;
  }
`;

export default HOST_STYLE;