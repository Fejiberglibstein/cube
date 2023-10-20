import {
	Gradient,
	NodeProps,
	Path,
	PathProps,
	colorSignal,
	initial,
	parser,
	signal,
} from "@motion-canvas/2d";
import {
	ColorSignal,
	PossibleColor,
	SimpleSignal,
	clamp,
} from "@motion-canvas/core";

const paths = [
	"m -46.198746,-53.830148 -48.878932,-28.16987 -48.922552,28.24545 48.878932,28.16976 z",
	"m -46.198746,-53.830148 -48.87892,-28.16989 c -48.922564,28.24546 -48.922924,28.24618 -24.483104,42.33035 24.439104,14.08566 24.439484,14.08488 73.362024,-14.16046 z",
	"m -46.198752,-53.830158 -48.87893,-28.16987 -48.922568,28.24546 48.878958,28.16977 z",
	"m -46.242378,-53.754697 -48.87892,28.169889 c -48.922562,-28.245459 -48.922922,-28.246179 -24.483102,-42.33035 24.439102,-14.085659 24.439482,-14.084879 73.362022,14.160461 z",
	"m -70.638212,-67.915138 c -24.439469,-14.08495 -48.900748,0.0378 -48.900748,0.0378 -24.46126,14.12273 -0.0218,28.20762 -0.0218,28.20762 24.439469,14.08502 48.900748,-0.0378 48.900748,-0.0378 24.46126,-14.12268 0.0218,-28.20762 0.0218,-28.20762 z",
	"m -95.077678,-82.000018 -48.922512,28.24542 c 48.878912,28.169769 48.878892,28.169869 73.340173,14.047129 24.461269,-14.122709 24.461269,-14.122709 -24.417661,-42.292549 z",
	"m -46.198762,-53.830138 -48.8789,-28.16989 -48.922518,28.24544 48.878918,28.16977 z",
	"m -70.638249,-67.915078 c -24.439439,-14.08492 -24.439439,-14.08492 -73.361981,14.160521 l 48.878932,28.169749 c 49.597059,-28.634879 49.377749,-28.508179 24.483049,-42.33027 z",
	"m -46.198746,-53.830148 -48.87888,-28.16988 -48.922574,28.24545 48.878954,28.16977 z",
];

const bbox = new Path({ data: paths[0] }).cacheBBox();
const SIDE_LENGTH = Math.sqrt(
	((bbox.height / 2) * bbox.height) / 2 + ((bbox.width / 2) * bbox.width) / 2
);

export interface cubieProps extends NodeProps {
	cubie: number
	maxHeight?: number;
	height?: number;
	color?: Gradient | PossibleColor;
}

export class Cubie extends Node {
	public readonly maxHeight: number;
	public readonly 

	@parser((v) => clamp(0, 1, v))
	@signal()
	public declare readonly height: SimpleSignal<number, this>;

	@colorSignal()
	public declare readonly color: ColorSignal<this>;

	public constructor(props: cubieProps) {
		super();
		this.maxHeight = props.maxHeight ?? SIDE_LENGTH;

	}
}

function getCubieLocation(index: number) {
	const x = (index % 3) - 1;
	const y = Math.floor(index / 3) - 1;
	return { x: x, y: y };
}
