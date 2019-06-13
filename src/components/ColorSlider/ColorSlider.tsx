import "./ColorSlider.style";

import * as React from "react";
import { RGBColor, HSLColor } from "@typings/color";
import ColorUtils from "@utils/ColorUtils";

export type ColorSliderChangeHandler = (value: number) => void;
export type ColorSliderBackdropRenderer = (frac: number) => RGBColor | HSLColor;

export interface ColorSliderProps {
	value: number;
	onChange: ColorSliderChangeHandler;
	backdrop?: (RGBColor | HSLColor)[];
	backdropRender?: ColorSliderBackdropRenderer;
}
export interface ColorSliderState { }

export default class ColorSlider extends React.PureComponent<ColorSliderProps, ColorSliderState> {
	constructor(props: ColorSliderProps) {
		super(props);
		this.state = {};
	}

	public render(): React.ReactNode {
		return (
			<div className="ColorSlider" style={{ backgroundImage: this.getGradient() }}>
				{this.getRenderedBackdrop()}
			</div>
		)
	}

	private getGradient(): string {
		const { backdrop } = this.props;
		if (!backdrop) return null;

		const colors = backdrop.map((color, i) => `${ColorUtils.getCSSColor(color)} ${100 * i / (backdrop.length - 1)}%`);
		return `linear-gradient(to right, ${colors.join(", ")})`
	}

	private getRenderedBackdrop(): React.ReactNode {
		const { backdropRender } = this.props;
		if (!backdropRender) return null;

		return <canvas className="ColorSlider__cvs" />;
	}
}