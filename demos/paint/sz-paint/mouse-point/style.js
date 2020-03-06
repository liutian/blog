const HOST_STYLE = `
  :host {
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
`;

export default HOST_STYLE;