import {Rect, makeScene2D} from '@motion-canvas/2d';
import {createRefMap, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const cubies = createRefMap<Rect>();

  view.add(
    <Rect
      stroke={'white'}
      width={100}
      height={100}
      lineWidth={3}
      rotation={-45}
      // scaleX={0.5}
    ></Rect>,
  );

  yield* waitFor(5);
});
