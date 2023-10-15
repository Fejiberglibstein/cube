import { Layout, Path, Rect, SVG, makeScene2D } from "@motion-canvas/2d";
import {
	Signal,
	SimpleSignal,
	all,
	chain,
	createRef,
	createSignal,
	debug,
	easeInOutSine,
	easeOutBack,
	linear,
	range,
	tween,
	useRandom,
	waitFor,
} from "@motion-canvas/core";
import { data } from "../images/cubies";

export default makeScene2D(function* (view) {
	const random = useRandom(13);
	const svg = createRef<SVG>();
	const cubies: Path[] = [];
	const initialY: number[] = [];
	const heightSignals: SimpleSignal<number>[] = [];
	const lines = createRef<Layout>();
	const colors = ["purple", "blue", "green", "yellow", "orange", "red"];
	view.add(
		<>
			{data.map((v) => (
				<Path data={v} stroke={"white"} lineWidth={3} lineJoin={"round"} ></Path>
			))}
		</>
	);
	// svg().y(view.height() / 2 - (svg().height() * svg().scale().y) / 2 - 20);

	// const wrapper = svg().children()[0];
	// const faceHeight = Math.sqrt(
	// 	svg().height() * svg().height() + svg().width() * svg().width()
	// );

	// wrapper.children().forEach((child, i) => {
	// 	heightSignals.push(createSignal<number>(1));
	// 	if (child instanceof Path) {
	// 		child.stroke("white");
	// 		child.lineWidth(3);
	// 		child.lineJoin("round");
	// 		lines().add(
	// 			<Layout
	// 				spawner={range(heightSignals[i]()).map((v) => (
	// 					<Path
	// 						data={child.data}
	// 						fill={"green"}
	// 						layout
	// 						></Path>
	// 						))}
	// 						position={[0, initialY[i] - linear(0.8, 0, faceHeight)]}
	// 				scale={2}
	// 				layout={false}
	// 			></Layout>
	// 		);

	// 		cubies.push(child);
	// 		initialY.push(child.y());
	// 	}
	// });
	// yield* all(
	// 	waitFor(1),
	// 	...wrapper.children().map((path, i) => {
	// 		const delay = random.nextFloat(0, 0.3);
	// 		const duration = random.nextFloat(0.25, 0.6);
	// 		return all(
	// 			chain(
	// 				waitFor(linear(delay)),
	// 				path.y(-path.y() - faceHeight, duration, easeOutBack)
	// 			),
	// 			chain(
	// 				heightSignals[i](faceHeight, duration / 2)
	// 				// heightSignals[i](0, duration /2)
	// 			)
	// 		);
	// 	})
	// );
});

function getCubieLocation(index: number) {
	const x = (index % 3) - 1;
	const y = Math.floor(index / 3) - 1;
	return [x, y];
}
