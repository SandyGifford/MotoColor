import "./HSLColorPicker.style";

import * as React from "react";
import { HSLColor } from "@typings/color";
import ColorSlider, { ColorSliderChangeHandler } from "@components/ColorSlider/ColorSlider";

export type HSLColorPickerChangeHandler = (color: HSLColor) => void;

export interface HSLColorPickerProps {
	color: HSLColor;
	onChange: HSLColorPickerChangeHandler;
}
export interface HSLColorPickerState { }

export default class HSLColorPicker extends React.PureComponent<HSLColorPickerProps, HSLColorPickerState> {
	constructor(props: HSLColorPickerProps) {
		super(props);
		this.state = {};
	}

	public render(): React.ReactNode {
		const { color } = this.props;

		return (
			<div className="HSLColorPicker">
				<ColorSlider
					value={color.h}
					color={{ h: color.h, s: 255, l: 128, a: 255 }}
					onChange={this.changeH}
					backdrop={this.getHSLRainbow()} />
				<ColorSlider
					value={color.s}
					color={{ h: color.h, s: color.s, l: 128, a: 255 }}
					onChange={this.changeS}
					backdrop={[{ h: color.h, s: 0, l: 128, a: 255 }, { h: color.h, s: 255, l: 128, a: 255 }]} />
				<ColorSlider
					value={color.l}
					color={{ h: 0, s: 0, l: color.l, a: 255 }}
					onChange={this.changeL}
					backdrop={[{ h: 0, s: 0, l: 0, a: 255 }, { h: 0, s: 0, l: 255, a: 255 }]} />
			</div>
		)
	}

	private changeH: ColorSliderChangeHandler = val => {
		const { color, onChange } = this.props;

		onChange({ ...color, h: val });
	};

	private changeS: ColorSliderChangeHandler = val => {
		const { color, onChange } = this.props;

		onChange({ ...color, s: val });
	};

	private changeL: ColorSliderChangeHandler = val => {
		const { color, onChange } = this.props;

		onChange({ ...color, l: val });
	};

	private getHSLRainbow(): HSLColor[] {
		const colors: HSLColor[] = [];
		const STEPS = 10;

		for (let i = 0; i < STEPS; i++) {
			colors.push({
				h: 255 * i / STEPS,
				s: 255,
				l: 128,
				a: 255
			})
		}

		return colors;
	}
}