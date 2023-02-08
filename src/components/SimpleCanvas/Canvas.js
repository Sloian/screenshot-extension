import { useOnDraw } from './Hooks';
import React from 'react';

const Canvas = ({ width, height, style, }) => {

  const {
    setCanvasRef,
    onCanvasMouseDown
  } = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, '#ff3333', 5);
  }

  function drawLine(
    start,
    end,
    ctx,
    color,
    width
  ) {

    console.log({ width })
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <canvas
      width={width}
      height={height}
      onMouseDown={onCanvasMouseDown}
      style={style}
      ref={setCanvasRef}
    />
  );
}

export default Canvas;

