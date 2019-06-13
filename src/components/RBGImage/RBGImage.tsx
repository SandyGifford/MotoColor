import "./RBGImage.style";

import * as React from "react";
import { RGBColor } from "@typings/color";

export interface RBGImageProps {
	pixels: RGBColor[];
	width: number;
	height: number;
}
export interface RBGImageState { }

export default class RBGImage extends React.Component<RBGImageProps, RBGImageState> {
	private cvsRef: React.RefObject<HTMLCanvasElement> = React.createRef();
	private ctx: CanvasRenderingContext2D;

	constructor(props: RBGImageProps) {
		super(props);
		this.state = {};
	}

	public render(): React.ReactNode {
		return (
			<canvas
				className="RBGImage"
				width={this.props.width}
				height={this.props.height}
				ref={this.cvsRef} />
		)
	}

	public componentDidMount() {
		this.ctx = this.cvsRef.current.getContext("2d");

		this.updateCanvas();
	}

	public componentDidUpdate() {
		this.updateCanvas();
	}

	private updateCanvas() {
		const { pixels, width, height } = this.props;

		if (!pixels.length) return;

		const imageData = this.ctx.getImageData(0, 0, width, height);
		const { data } = imageData;

		for (let i = 0; i < pixels.length; i++) {
			const pixel = pixels[i];
			const pixelIndex = i * 4;

			data[pixelIndex] = pixel.r;
			data[pixelIndex + 1] = pixel.g;
			data[pixelIndex + 2] = pixel.b;
			data[pixelIndex + 3] = typeof pixel.a === "number" ? pixel.a : 255;
		}

		this.ctx.putImageData(imageData, 0, 0);
	}
}