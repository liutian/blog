const HOST_STYLE = `
  :host {
    color: #fff;
    user-select: none;
  }

  .primary-tool {
    display: inline-block;
    background-color: #4c4c4c;
    border-radius: 4px;
    text-align: left;
    padding: 5px 20px;
    cursor: default;
  }

  .secondary-tool {
    position: absolute;
    background-color: #4c4c4c;
    border-radius: 4px;
    text-align: left;
    padding: 5px 10px;
    box-sizing: border-box;
    cursor: default;
  }

  .location-marker {
    position: absolute;  
    border: solid 5px transparent;
    border-bottom-color: #4c4c4c;
  }
`;

export default HOST_STYLE;