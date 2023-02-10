
import React, { useState } from "react";
import { Stage, Layer, Arrow, Circle, Line, Text, Rect } from "react-konva";

let startx, starty
let points = []

function TextDrawable(x, y) {
  return (<Text x={x} y={y} text='Simple Text' fontFamily='Calibri' fill='red' fontSize={30} draggable={true} />);
}

function RectangleDrawable(x, y) {
  const width = startx - x;
  const height = starty - y;

  return (<Rect x={x} y={y} width={width} height={height} stroke={'red'} strokeWidth={4} draggable />);
}

function ArrowDrawable(x, y) {
  points = [startx, starty, x, y]
  return <Arrow points={points} fill="black" stroke="red" strokeWidth={4} />;
}

function LineDrawable(x, y) {
  points = [startx, starty, x, y]
  return <Line points={points} fill="black" stroke="red" strokeWidth={4} />;
}

function CircleDrawable(x, y) {
  const dx = startx - x;
  const dy = starty - y;
  const radius = Math.sqrt(dx * dx + dy * dy);
  return (
    <Circle radius={radius} x={startx} y={starty} strokeWidth={4} stroke="red" />
  );
}

function FreePathDrawable(x, y) {
  points = [...points, x, y]
  return <Line points={points} strokeWidth={4} fill="red" stroke="red" />;
}

const drawableClasses = {
  FreePathDrawable,
  ArrowDrawable,
  CircleDrawable,
  RectangleDrawable,
  TextDrawable,
  LineDrawable
};

const getNewDrawableBasedOnType = (x, y, type) => {
  return new drawableClasses[type](x, y);
};

export const Drawable = (
  { drawables, setNewDrawableType,
    newDrawableType, setDrawables,
    newDrawable, setNewDrawable,
    toolbar_edit, toolbar_actions }) => {

  const handleMouseDown = e => {
    if (newDrawable.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      if (!startx) {
        startx = x
        starty = y
      }
      setNewDrawable([getNewDrawableBasedOnType(
        x,
        y,
        newDrawableType
      )]);
      toolbar_edit.current.style.display = 'none'
      toolbar_actions.current.style.display = 'none'
      console.log(toolbar_edit.current.children)
      console.log(toolbar_edit.current.children)
    }
  };

  const handleMouseMove = e => {
    console.log(newDrawable)
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      setNewDrawable([drawableClasses[newDrawableType](x, y)])
    }
  };

  const handleMouseUp = e => {
    console.log(newDrawable)
    if (newDrawable.length === 1) {
      const drawableToAdd = newDrawable[0];
      drawables.push(drawableToAdd);
      console.log(drawables)
      setNewDrawable([])
      points = []
      startx = 0
      starty = 0
      toolbar_edit.current.style.display = 'flex'
      toolbar_actions.current.style.display = 'flex'

    }
  };



  const SuperSceneWithDrawables = () => {

    const drawableForRender = [...drawables]
    if (newDrawable.length === 1) {
      drawableForRender.push(newDrawable)
    }

    return (
      <div style={{ position: 'absolute' }}>
        <Stage
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer>
            {drawableForRender.map(drawable => {
              return drawable;
            })}
          </Layer>
        </Stage>

      </div>
    );
  }

  return (<SuperSceneWithDrawables />)
}

// export default setNewDrawableType;

export default Drawable;





