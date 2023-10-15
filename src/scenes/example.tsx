import {Path, Rect, SVG, makeScene2D} from '@motion-canvas/2d';
import {createRef, createRefMap, debug, waitFor} from '@motion-canvas/core';
import {src} from "../images/cubies"

export default makeScene2D(function* (view) {
  const svg = createRef<SVG>();

  view.add(
    <SVG svg={src} ref={svg} rotation={-60}></SVG>
  );
  svg().children()[0].children().forEach((child) => {
    debug("Graaa")
    if (child instanceof Path) {
      child.stroke("white")
      child.lineWidth(3)
      child.lineJoin("round")

    }
  })

  yield* waitFor(5);
});
