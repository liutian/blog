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
`;

export default HOST_STYLE;