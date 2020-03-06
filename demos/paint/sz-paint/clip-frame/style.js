const HOST_STYLE = `
  :host {
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

  .detect {
    position: absolute;
    left: 10000px;
    top: 10000px;
    opacity: 0;
  }

  .bg-empty{
    width: 100%;
    height: 100%;
  }
`;

export default HOST_STYLE;