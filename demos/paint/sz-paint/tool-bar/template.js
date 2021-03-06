const HOST_TEMPLATE = `
  <div class="primary-tool">
    <span class="graph-tool tool-item" data-type="rect" >矩</span>
    <span class="graph-tool tool-item" data-type="circular">圆</span>
    <span class="graph-tool tool-item" data-type="arrow">箭</span>
    <span class="graph-tool tool-item" data-type="paint">笔</span>
    <span class="graph-tool tool-item" data-type="mosaic">糊</span>
    <span class="graph-tool tool-item" data-type="font">字</span>
    <span class="separator"></span>
    <span class="undo-tool tool-item" >消</span>
    <span class="save-tool tool-item" >保</span>
    <span class="separator tool-item"></span>
    <span class="exit-tool tool-item" >退</span>
    <span class="over-tool tool-item" >完</span>
  </div>

  <div class="location-marker"></div>

  <div class="secondary-tool">
    <select class="font-size-tool">
      <option value="small">小</option>
      <option value="normal">中</option>
      <option value="large">大</option>
    </select>

    <span class="size-tool">
      <span class=" tool-item" data-size="small">小</span>
      <span class=" tool-item" data-size="normal">中</span>
      <span class=" tool-item" data-size="large">大</span>
    </span>

    <span class="color-tool">
      <span class=" tool-item" data-color="red">红</span>
      <span class=" tool-item" data-color="yellow">黄</span>
      <span class=" tool-item" data-color="blue">蓝</span>
      <span class=" tool-item" data-color="green">绿</span>
      <span class=" tool-item" data-color="gray">灰</span>
      <span class=" tool-item" data-color="white">白</span>
    </span>
  </div>
`;

export default HOST_TEMPLATE;