import "./HSLImage.style";

import * as React from "react";
import { ArrayColor } from "@typings/color";
import ColorUtils from "@utils/ColorUtils";
import { ImageAdjuster } from "@workers/ImageAdjuster";
import ImageUtils from "@utils/ImageUtils";

export interface HSLImageProps {
	pixels: Uint8ClampedArray;
	adjustment: ArrayColor;
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
		const { adjustment, adjust } = this.props;

		if (
			adjustment[0] !== prevProps.adjustment[0] ||
			adjustment[1] !== prevProps.adjustment[1] ||
			adjustment[2] !== prevProps.adjustment[2] ||
			(adjust && !prevProps.adjust)
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

				ImageUtils.forEachPixel(adjustedPixels, (hslPixel, pI, cI) => {
					const rgbPixel = ColorUtils.hslToRGB(hslPixel);

					data[cI] = rgbPixel[0];
					data[cI + 1] = rgbPixel[1];
					data[cI + 2] = rgbPixel[2];
					data[cI + 3] = typeof rgbPixel[3] === "number" ? rgbPixel[3] : 255;
				});

				this.ctx.putImageData(imageData, 0, 0);

				this.setState({
					processing: false,
				}, () => {
					const newAdjustment = this.props.adjustment;

					if (
						newAdjustment[0] !== adjustment[0] ||
						newAdjustment[1] !== adjustment[1] ||
						newAdjustment[2] !== adjustment[2]
					)
						this.updateCanvas();
				});
			});
	}
}