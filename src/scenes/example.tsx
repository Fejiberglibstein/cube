import {Rect, SVG, makeScene2D} from '@motion-canvas/2d';
import {createRef, createRefMap, debug, waitFor} from '@motion-canvas/core';
import src from "../images/cubies.svg"

export default makeScene2D(function* (view) {
  const svg = createRef<SVG>();

  debug(src.);
  view.add(
    <SVG svg={src}></SVG>
  );

  yield* waitFor(5);
});
