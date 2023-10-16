import {Layout, Path, Rect, SVG, makeScene2D} from '@motion-canvas/2d';
import {
  Signal,
  SimpleSignal,
  all,
  chain,
  createRef,
  createRefArray,
  createSignal,
  debug,
  easeInOutSine,
  easeOutBack,
  linear,
  range,
  tween,
  useRandom,
  waitFor,
} from '@motion-canvas/core';
import {data} from '../images/cubies';

export default makeScene2D(function* (view) {
  const random = useRandom(13);
  const wrapper = createRef<SVG>();
  const cubies = createRefArray<Path>();
  const initialY: number[] = [];
  const heightSignals: SimpleSignal<number>[] = [];
  const lines = createRef<Layout>();
  const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
  view.add(
    <Layout ref={wrapper} layout={false} y={200}>
      {data.map(v => (
        <Path
          data={v}
          stroke={'white'}
          lineWidth={3}
          lineJoin={'round'}
          ref={cubies}
					layout={true}
        ></Path>
      ))}
    </Layout>,
  );
	const bbox = wrapper().cacheBBox
  const faceHeight = Math.sqrt(
    bbox().height * bbox().height +
      bbox().width * bbox().width
  ) / 1.5;
  yield* all(
    waitFor(1),
    ...cubies.map((cubie, i) => {
      const delay = random.nextFloat(0, 0.3);
      const duration = random.nextFloat(0.25, 0.6);
      return all(
        chain(
          waitFor(linear(delay)),
          cubie.y(-cubie.y() - faceHeight, duration, easeOutBack),
        ),
        chain(),
        // heightSignals[i](faceHeight, duration / 2)
        // heightSignals[i](0, duration /2)
      );
    }),
  );
});

function getCubieLocation(index: number) {
  const x = (index % 3) - 1;
  const y = Math.floor(index / 3) - 1;
  return [x, y];
}
