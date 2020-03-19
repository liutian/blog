import { resolveSize, resolveColor } from './tool.js';
import { getAnchors } from './util.js';

export default class CanvasRender {
  draw(ctx, graphInfoList) {
    ctx.save();
    ctx.clearRect(0, 0, 10000, 10000);
    for (let i = 0; i < graphInfoList.length; i++) {
      const graphInfo = graphInfoList[i];

      ctx.save();
      const width = graphInfo.width || (graphInfo.endX - graphInfo.startX);
      const height = graphInfo.height || (graphInfo.endY - graphInfo.startY);
      const size = resolveSize(graphInfo.type, graphInfo.size);
      const color = resolveColor(graphInfo.color);
      const diff = size % 2 === 0 ? 0 : 0.5;
      const posX = graphInfo.startX + diff;
      const posY = graphInfo.startY + diff;

      ctx.beginPath();
      if (graphInfo.type === 'rect') {

        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineJoin = 'round';

        ctx.strokeRect(posX, posY, width, height);
      } else if (graphInfo.type === 'circular') {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineJoin = 'round';

        ctx.ellipse(posX + width / 2, posY + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();


      ctx.save();
      if (graphInfo.select) {
        ctx.strokeStyle = color
        ctx.lineWidth = 1;
        ctx.strokeRect(posX, posY, width, height);

        getAnchors(posX, posY, width, height).forEach((posInfo) => {
          ctx.beginPath();
          ctx.moveTo(posInfo[0] + 4, posInfo[1]);
          ctx.arc(posInfo[0], posInfo[1], 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(posInfo[0] + 4, posInfo[1]);
          ctx.arc(posInfo[0], posInfo[1], 3.5, 0, 2 * Math.PI);
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }
      ctx.restore();

    }
    ctx.restore();
  }

}