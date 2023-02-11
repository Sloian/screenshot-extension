import React from 'react';
import { Arrow, Circle, Line, Text, Rect } from 'react-konva';

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

    return (
      <Circle
        stroke="red"
        strokeWidth={3}
        radius={radius}
        x={this.startx}
        y={this.starty}
      />
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
    return (
      <Line points={this.points} strokeWidth={5} fill="red" stroke="red" />
    );
  }
}

class RectangleDrawable extends ArrowDrawable {
  constructor(startx, starty) {
    super(startx, starty);
    this.x = startx;
    this.y = starty;
  }

  render() {
    const width = this.startx - this.x;
    const height = this.starty - this.y;

    return (
      <Rect
        x={x}
        y={y}
        draggable
        width={width}
        stroke={'red'}
        height={height}
        strokeWidth={4}
      />
    );
  }
}

class TextDrawable {
  constructor(startx, starty) {
    this.x = startx;
    this.y = starty;
  }

  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }

  render() {
    return (
      <Text
        fill="red"
        x={this.x}
        y={this.y}
        fontSize={30}
        draggable={true}
        text="Simple Text"
        fontFamily="Calibri"
      />
    );
  }
}

export {
  TextDrawable,
  ArrowDrawable,
  CircleDrawable,
  FreePathDrawable,
  RectangleDrawable,
};
