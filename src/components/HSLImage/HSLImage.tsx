import "./HSLImage.style";

import * as React from "react";
import { HSLColor } from "@typings/color";
import ColorUtils from "@utils/ColorUtils";
import { ImageAdjuster } from "@workers/ImageAdjuster";

export interface HSLImageProps {
	pixels: HSLColor[];
	adjustment: HSLColor;
	adjust: boolean;
	width: number;
	height: number;
}
export interface HSLImageState {
	workerReady: boolean;
	processing: boolean;
}

export default class HSLImage extends React.PureComponent<HSLImageProps, HSLImageState> {
	private cvsRef: React.RefObject<HTMLCanvasElement> = React.createRef();
	private ctx: CanvasRenderingContext2D;
	private imageAdjuster = new ImageAdjuster();

	constructor(props: HSLImageProps) {
		super(props);
		this.state = {
			workerReady: false,
			processing: false,
		};

		this.imageAdjuster.setBasePixels(props.pixels)
			.then(() => this.setState(
				{
					workerReady: true,
				},
				this.updateCanvas
			));
	}

	public render(): React.ReactNode {
		return (
			<canvas
				className="HSLImage"
				width={this.props.width}
				height={this.props.height}
				ref={this.cvsRef} />
		)
	}

	public componentDidMount() {
		this.ctx = this.cvsRef.current.getContext("2d");

		this.updateCanvas();
	}

	public componentDidUpdate(prevProps: HSLImageProps, prevState: HSLImageState) {
		if (
			this.props.adjustment.h !== prevProps.adjustment.h ||
			this.props.adjustment.s !== prevProps.adjustment.s ||
			this.props.adjustment.l !== prevProps.adjustment.l ||
			(this.props.adjust && !prevProps.adjust)
		)
			this.updateCanvas();
	}

	private updateCanvas = () => {
		const { pixels, width, height, adjustment, adjust } = this.props;
		const { workerReady, processing } = this.state;

		if (!pixels.length || !adjust || !workerReady || processing) return;

		this.setState({
			processing: true,
		});

		this.imageAdjuster.adjustImage(adjustment)
			.then(adjustedPixels => {
				const imageData = this.ctx.getImageData(0, 0, width, height);
				const { data } = imageData;

				for (let i = 0; i < adjustedPixels.length; i++) {
					const pixel = ColorUtils.hslToRGB(adjustedPixels[i]);
					const pixelIndex = i * 4;

					data[pixelIndex] = pixel.r;
					data[pixelIndex + 1] = pixel.g;
					data[pixelIndex + 2] = pixel.b;
					data[pixelIndex + 3] = typeof pixel.a === "number" ? pixel.a : 255;
				}

				this.ctx.putImageData(imageData, 0, 0);

				this.setState({
					processing: false,
				}, () => {
					const newAdjustment = this.props.adjustment;

					if (
						newAdjustment.h !== adjustment.h ||
						newAdjustment.s !== adjustment.s ||
						newAdjustment.l !== adjustment.l
					)
						this.updateCanvas();
				});
			});
	}
}