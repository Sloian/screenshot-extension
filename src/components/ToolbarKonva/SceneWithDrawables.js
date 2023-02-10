import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';

import {
  TextDrawable,
  ArrowDrawable,
  CircleDrawable,
  FreePathDrawable,
  RectangleDrawable,
} from './DrawableElements';

const DRAWABLE_TYPES = {
  TEXT_DRAWABLE: 'TextDrawable',
  ARROW_DRAWABLE: 'ArrowDrawable',
  CIRCLE_DRAWABLE: 'CircleDrawable',
  FREE_PATH_DRAWABLE: 'FreePathDrawable',
  RECTANGLE_DRAWABLE: 'RectangleDrawable',
};

const DRAWABLE_ELEMENTS = {
  [DRAWABLE_TYPES.TEXT_DRAWABLE]: TextDrawable,
  [DRAWABLE_TYPES.ARROW_DRAWABLE]: ArrowDrawable,
  [DRAWABLE_TYPES.CIRCLE_DRAWABLE]: CircleDrawable,
  [DRAWABLE_TYPES.FREE_PATH_DRAWABLE]: FreePathDrawable,
  [DRAWABLE_TYPES.RECTANGLE_DRAWABLE]: RectangleDrawable,
};

export const SceneWithDrawables = () => {
  const [drawables, setDrawables] = useState([]);
  const [newDrawable, setNewDrawable] = useState(null);
  const [newDrawableType, setNewDrawableType] = useState([]);

  const handleMouseDown = (e) => {
    if (!newDrawable) {
      const { x, y } = e.target.getStage().getPointerPosition();

      setNewDrawable(new DRAWABLE_ELEMENTS[newDrawableType](x, y));
    }
  };

  const handleMouseMove = (e) => {
    if (newDrawable) {
      const { x, y } = e.target.getStage().getPointerPosition();

      newDrawable.registerMovement(x, y);
    }
  };

  const handleMouseUp = (e) => {
    if (newDrawable) {
      setDrawables([...drawables, newDrawable]);
      setNewDrawable(null);
    }
  };

  const allDrawables = newDrawable ? [...drawables, newDrawable] : drawables;

  return (
    <div style={{ position: 'absolute' }}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {allDrawables.map((drawable) => {
            return drawable.render();
          })}
        </Layer>
      </Stage>

      <button
        className="button-class"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        onClick={() => setNewDrawableType(DRAWABLE_TYPES.ARROW_DRAWABLE)}
      >
        Draw Arrows
      </button>
      <button
        className="button-class"
        style={{ position: 'absolute', top: 0, left: 100, zIndex: 1 }}
        onClick={() => setNewDrawableType(DRAWABLE_TYPES.CIRCLE_DRAWABLE)}
      >
        Draw Circles
      </button>
      <button
        className="button-class"
        style={{ position: 'absolute', top: 0, left: 200, zIndex: 1 }}
        onClick={() => setNewDrawableType(DRAWABLE_TYPES.FREE_PATH_DRAWABLE)}
      >
        Draw FreeHand!
      </button>
      <button
        className="button-class"
        style={{ position: 'absolute', top: 0, left: 330, zIndex: 1 }}
        onClick={() => setNewDrawableType(DRAWABLE_TYPES.RECTANGLE_DRAWABLE)}
      >
        Rectangle
      </button>
      <button
        className="button-class"
        style={{ position: 'absolute', top: 0, left: 420, zIndex: 1 }}
        onClick={() => setNewDrawableType(DRAWABLE_TYPES.TEXT_DRAWABLE)}
      >
        Text
      </button>
      <button
        className="button-class"
        style={{ position: 'absolute', top: 0, left: 480, zIndex: 1 }}
        onClick={(e) => {
          console.log(drawables);
          console.log(drawableForRender);
          drawables.pop();
          // setDrawables(a)
          setTestUndo((prev) => prev + 1);
        }}
      >
        undo
      </button>
    </div>
  );
};
