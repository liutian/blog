import { resolveSize, resolveColor } from './tool.js';

export default class CanvasRender {
  draw(ctx, graphInfoList) {
    ctx.save();
    ctx.clearRect(0, 0, 10000, 10000);
    for (let i = 0; i < graphInfoList.length; i++) {
      const graphInfo = graphInfoList[i];
      ctx.save();

      if (graphInfo.type === 'rect') {
        const width = graphInfo.width || (graphInfo.endX - graphInfo.startX);
        const height = graphInfo.height || (graphInfo.endY - graphInfo.startY);
        const size = resolveSize(graphInfo.type, graphInfo.size);
        const diff = size % 2 === 0 ? 0 : 0.5;

        ctx.strokeStyle = resolveColor(graphInfo.color);
        ctx.lineWidth = size;
        ctx.lineJoin = 'round';

        ctx.strokeRect(graphInfo.startX + diff, graphInfo.startY + diff, width, height);
      }

      ctx.restore();
    }
    ctx.restore();
  }
}