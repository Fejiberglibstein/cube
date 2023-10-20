import {
	Gradient,
	Layout,
	Path,
	Polygon,
	makeScene2D,
} from "@motion-canvas/2d";
import {
	BBox,
	Color,
	PossibleColor,
	SimpleSignal,
	all,
	chain,
	createRef,
	createRefArray,
	createSignal,
	delay,
	easeOutBack,
	range,
	sequence,
	useRandom,
	waitFor,
} from "@motion-canvas/core";

const paths = [
	"M 147.00441,0.11040846 98.12548,-28.059462 49.20293,0.18598846 98.08186,28.355748 Z",
	"m 98.12585,-28.060242 -48.87892,-28.16989 c -48.92256002,28.24546 -48.92292002,28.24618 -24.4831,42.33035 24.4391,14.08566046 24.43948,14.08488046 73.36202,-14.16046 z",
	"m 49.24693,-56.230132 -24.43948,-14.08493 -24.43945002,-14.08494 -24.46127998,14.12272 -24.46129,14.12274 48.87895998,28.16977 z",
	"M 98.08185,28.355748 73.64239,14.270808 C 49.72588,0.42954846 49.72588,0.42954846 24.74166,14.308608 0.80328998,28.674988 0.80328998,28.674988 24.71986,42.516268 l 24.43945,14.08495 24.46129,-14.12273 24.46128,-14.12273",
	"m 24.76347,-13.899022 c -24.43947002,-14.08495 -48.90075,0.0378 -48.90075,0.0378 -24.46126,14.12273046 -0.0218,28.20762 -0.0218,28.20762 24.43946998,14.08502 48.90075,-0.0378 48.90075,-0.0378 24.46126,-14.12267954 0.0218,-28.20762 0.0218,-28.20762 z",
	"m -48.5552,-56.154512 -48.92251,28.24542 c 48.87891,28.16977046 48.87889,28.16987046 73.34017,14.04713 24.46126998,-14.12271 24.46126998,-14.12271 -24.41766,-42.29255 z",
	"M 49.15928,56.601218 0.28037998,28.431328 -48.64214,56.676768 0.23677998,84.846538 Z",
	"M -24.15908,14.346408 C -48.59852,0.26148846 -48.59852,0.26148846 -97.52106,28.506928 l 48.87893,28.16975 C 0.95492998,28.041798 0.73561998,28.168498 -24.15908,14.346408 Z",
	"M -48.59856,0.26158846 -97.47744,-27.908292 -146.40001,0.33715846 -97.52106,28.506928 Z",
];
const lineResolution = 60; // Lower number means you can see each individual square

export default makeScene2D(function* (view) {
	const random = useRandom();

	// Array of numbers for the start and end indices of the list of squares given by `blurs`
	// Each index in the list correpsonds to the index from the list of squares
	const heightsTop: SimpleSignal<SimpleSignal<number>[]> = createSignal(
		new Array<SimpleSignal<number>>()
	);
	const heightsBottom: SimpleSignal<SimpleSignal<number>[]> = createSignal(
		new Array<SimpleSignal<number>>()
	);

	const topSide = createRefArray<Path>();
	const leftSide = createRefArray<Path>();
	const rightSide = createRefArray<Path>();
	const octagon = createRef<Polygon>();

	// Generate 3 Layouts containing all of the paths.
	const [wrapper] = [topSide, leftSide, rightSide].map(
		(ref) =>
			(
				<Layout>
					{paths.map((v, i) => (
						<Path
							data={v}
							stroke={"white"}
							lineWidth={3}
							lineJoin={"round"}
							fill={{ r: 19, g: 19, b: 21, a: 1 }}
							zIndex={getZIndex(i)}
							ref={ref}
						></Path>
					))}
				</Layout>
			) as Layout
	);

	// Get the length of the edge of the entire cube face
	const bbox = wrapper.cacheBBox();
	const faceHeight = Math.sqrt(
		((bbox.height / 2) * bbox.height) / 2 + ((bbox.width / 2) * bbox.width) / 2
	);

	// Create a list of multiple paths containing `lineResolution` amount of paths.
	// Each path has a slightly different y coord so that they are stacked on top of each other
	const blurs = paths.map((v, i) => {
		// Fill the lists heightsTop and heightsBottom with signals of 0.
		heightsTop().push(createSignal(0));
		heightsBottom().push(createSignal(0));

		// Get a bbox for the path
		const bbox = new Path({ data: v }).cacheBBox(); 

		// Generate a "tower" of the paths stacked atop each other spanning from y=0 to y=faceHeight
		return range(lineResolution).map((height, j) => (
			<Path
				zIndex={-1}
				data={v}
				fill={getGradient(
					i,
					bbox,
					Color.lerp("#704cad", "#1C3D80", height / lineResolution, "rgb")
				)}
				lineJoin={"round"}
				y={-faceHeight * (height / lineResolution)}
			></Path>
		));
	});

	view.add(
		<Layout scale={2}>
			<Layout y={faceHeight / 2}>
				{topSide.map((v, i) => v)}
				{paths.map((v, i) => (
					<Path
						zIndex={getZIndex(i) - 1}
						data={v}
						spawner={() =>
							blurs[i].slice(
								heightsBottom()[i](),
								heightsBottom()[i]() + heightsTop()[i]()
							)
						}
					></Path>
				))}
			</Layout>
			<Polygon
				ref={octagon}
				sides={6}
				fill={
					new Gradient({
						type: "linear",
						fromX: -100,
						toX: 100,
						stops: [
							{ offset: 0, color: "#333" },
							{ offset: 0.5, color: "#333" },
							{ offset: 0.5, color: "#222" },
							{ offset: 1, color: "#222" },
						],
					})
				}
				size={faceHeight * 2}
				zIndex={-2}
				opacity={0}
			>
				<Layout position={[-faceHeight / 2.35, faceHeight / 4.2]} rotation={60}>
					{leftSide.map((v, i) => v)}
				</Layout>
				<Layout position={[faceHeight / 2.35, faceHeight / 4.2]} rotation={-60}>
					{rightSide.map((v, i) => v)}
				</Layout>
			</Polygon>
		</Layout>
	);

	yield* waitFor(0.5);
	yield* all(
		delay(0.48, octagon().opacity(1, 0.2)),
		...topSide.map((cubie, i) => {
			// Random delay/duration for each cubie
			let delay = random.nextFloat(0, 0.3);
			let duration = random.nextFloat(0.3, 0.6);

			// Each cubie gets a delay based on its z index
			delay = getZIndex(i) / 24;
			duration = 0.55;
			return chain(
				waitFor(delay),
				all(
					cubie.y(-cubie.y() - faceHeight, duration, easeOutBack),
					cubie
						.fill("#dddddd", duration, easeOutBackVelocity)
						.to({ r: 19, g: 19, b: 21, a: 1 }, 0),
					sequence(
						duration * 0.58,
						heightsTop()[i](lineResolution, duration, easeOutBack),
						heightsBottom()[i](lineResolution, duration * 0.8, easeOutBack)
					)
				)
			);
		})
	);
});

function getZIndex(index: number) {
	return [6, 4, 2, 8, 6, 4, 10, 8, 6][index];
}

function getGradient(index: number, bbox: BBox, color: PossibleColor) {
	const c = new Color(color);
	const c_dark = c.darken(0.8);
	const c_light = c.brighten(0.5);

	const x = bbox.center.x;
	const width = bbox.width / 2;
	let stops;
	switch (index) {
		case 0:
		case 2:
		case 6:
		case 8:
			stops = [
				{ offset: 0, color: c },
				{ offset: 0.49, color: c },
				{ offset: 0.51, color: c_dark },
				{ offset: 1, color: c_dark },
			];
			break;

		case 1:
			stops = [
				{ offset: 0, color: c_light },
				{ offset: 0.15, color: c },
				{ offset: 0.4, color: c },
				{ offset: 0.6, color: c_dark },
				{ offset: 1, color: c_dark },
			];
			break;
		case 3:
			stops = [
				{ offset: 0, color: c_light },
				{ offset: 0.12, color: c },
				{ offset: 0.49, color: c },
				{ offset: 0.51, color: c_dark },
				{ offset: 1, color: c_dark },
			];
			break;
		case 4:
			stops = [
				{ offset: 0, color: c_light },
				{ offset: 0.12, color: c },
				{ offset: 0.88, color: c_dark },
				{ offset: 1, color: c_light },
			];
			break;
		case 7:
			stops = [
				{ offset: 0, color: c },
				{ offset: 0.49, color: c },
				{ offset: 0.51, color: c_dark },
				{ offset: 0.89, color: c_dark },
				{ offset: 1, color: c_light },
			];
			break;
		case 5:
			stops = [
				{ offset: 0.0, color: c },
				{ offset: 0.4, color: c },
				{ offset: 0.6, color: c_dark },
				{ offset: 0.85, color: c_dark },
				{ offset: 1, color: c_light },
			];
			break;
	}
	return new Gradient({
		type: "linear",
		fromX: x - width,
		toX: x + width,
		stops: stops,
	});
}

// Derivative of easeOutBack easing function
function easeOutBackVelocity(x: number): number {
	const c1 = 1.70158;
	const c3 = 1 + c1;

	return Math.abs((1 + c3 * 3 * Math.pow(x - 1, 2) + c1 * 2 * (x - 1)) / 4.702);
}
