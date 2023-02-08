import React, { Component } from "react";
import { Stage, Layer, Arrow, Circle, Line } from "react-konva";
// import "./styles.css";

class Drawable {
  constructor(startx, starty) {
    this.startx = startx;
    this.starty = starty;
  }
}

class ArrowDrawable extends Drawable {
  constructor(startx, starty) {
    super(startx, starty);
    this.x = startx;
    this.y = starty;
  }
  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }
  render() {
    const points = [this.startx, this.starty, this.x, this.y];
    console.log(points)
    return <Arrow points={points} strokeWidth={3} fill="black" stroke="red" />;
  }
}

class CircleDrawable extends ArrowDrawable {
  constructor(startx, starty) {
    super(startx, starty);
    this.x = startx;
    this.y = starty;
  }
  render() {
    const dx = this.startx - this.x;
    const dy = this.starty - this.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    console.log(radius)
    return (
      <Circle strokeWidth={3} radius={radius} x={this.startx} y={this.starty} stroke="red" />
    );
  }
}

class FreePathDrawable extends Drawable {
  constructor(startx, starty) {
    super(startx, starty);
    this.points = [startx, starty];
  }
  registerMovement(x, y) {
    this.points = [...this.points, x, y];
  }
  render() {
    return <Line points={this.points} strokeWidth={5} fill="red" stroke="red" />;
  }
}

class SceneWithDrawables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 0,
      drawables: [],
      newDrawable: [],
      newDrawableType: "FreePathDrawable"
    };
  }

  getNewDrawableBasedOnType = (x, y, type) => {
    const drawableClasses = {
      FreePathDrawable,
      ArrowDrawable,
      CircleDrawable
    };
    return new drawableClasses[type](x, y);
  };

  handleMouseDown = e => {
    const { newDrawable } = this.state;
    if (newDrawable.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newDrawable = this.getNewDrawableBasedOnType(
        x,
        y,
        this.state.newDrawableType
      );
      this.setState({
        newDrawable: [newDrawable]
      });
    }
  };

  handleMouseMove = e => {
    const { newDrawable } = this.state;
    console.log(newDrawable)
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const updatedNewDrawable = newDrawable[0];
      updatedNewDrawable.registerMovement(x, y);
      this.setState({
        newDrawable: [updatedNewDrawable]
      });
    }
  };

  handleMouseUp = e => {
    const { newDrawable, drawables } = this.state;

    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const drawableToAdd = newDrawable[0];
      drawableToAdd.registerMovement(x, y);
      drawables.push(drawableToAdd);
      this.setState({
        newDrawable: [],
        drawables
      });
    }
  };


  render() {
    const drawables = [...this.state.drawables, ...this.state.newDrawable];
    return (
      <div style={{ position: 'absolute', }}>
        <Stage
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer
            width={window.innerWidth}
            height={window.innerHeight}
          >
            {drawables.map(drawable => {
              return drawable.render();
            })}
          </Layer>
        </Stage>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          onClick={e => {
            this.setState({ newDrawableType: "ArrowDrawable" });
          }}
        >
          Draw Arrows
        </button>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 100, zIndex: 1 }}

          onClick={e => {
            this.setState({ newDrawableType: "CircleDrawable" });
          }}
        >
          Draw Circles
        </button>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 200, zIndex: 1 }}
          onClick={e => {
            this.setState({ newDrawableType: "FreePathDrawable" });
          }}
        >
          Draw FreeHand!
        </button>
        <button
          className="button-class"
          style={{ position: 'absolute', top: 0, left: 300, zIndex: 1 }}
          onClick={e => {
            // console.log(this.state.drawables)
            [...this.state.drawables].pop()
            console.log(this.state.drawables.pop())
          }
          }
        >
          Draw FreeHand!
        </button>
      </div >
    );
  }
}

function App() {
  return <SceneWithDrawables />;
}

export default App;
