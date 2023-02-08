
import React, { useState, useEffect } from "react";
import { Stage, Layer, Arrow, Circle, Line, Text } from "react-konva";

let startx, starty
let points = []

function TextDrawable(x, y) {

  return (<Text text='Simple Text' fontFamily='Calibri' fill='green' fontSize={30}

  />
  );
}

function ArrowDrawable(x, y) {
  points = [startx, starty, x, y]
  return <Arrow points={points} fill="black" stroke="red" />;
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
  CircleDrawable
};

const getNewDrawableBasedOnType = (x, y, type) => {
  return new drawableClasses[type](x, y);
};

export const Drawable = () => {
  const [newDrawableType, setNewDrawableType] = useState(`FreePathDrawable`)
  const [drawables, setDrawables] = useState([])
  const [newDrawable, setNewDrawable] = useState([])

  const SuperSceneWithDrawables = () => {
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
        setDrawables([...drawables], newDrawable)
        setNewDrawable([])
        points = []
        startx = 0
        starty = 0
      }
    };


    const drawabless = [...drawables, newDrawable];
    console.log(drawabless)
    return (
      <div style={{ position: 'absolute' }}>
        <Stage
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer
          >
            {drawabless.map(drawable => {
              return drawable;
            })}
          </Layer>
        </Stage>

        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          onClick={e => {
            setNewDrawableType("ArrowDrawable")
          }}
        >
          Draw Arrows
        </button>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 100, zIndex: 1 }}
          onClick={e => {
            setNewDrawableType("CircleDrawable")
          }}
        >
          Draw Circles
        </button>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 200, zIndex: 1 }}
          onClick={e => {
            setNewDrawableType("FreePathDrawable")
          }}
        >
          Draw FreeHand!
        </button>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 330, zIndex: 1 }}
          onClick={e => {
            drawabless.pop()
            console.log(drawabless)
            setNewDrawable([...newDrawable])
          }}
        >
          undo
        </button>
      </div>
    );
  }

  return (<SuperSceneWithDrawables
    setNewDrawableType={setNewDrawableType}
  />)
}

// export default setNewDrawableType;

export default Drawable;





