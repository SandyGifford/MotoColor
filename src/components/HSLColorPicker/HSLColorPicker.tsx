import "./HSLColorPicker.style";

import * as React from "react";
import { HSLColor } from "@typings/color";
import NumberUtils from "@utils/NumberUtils";
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
					color={{ h: color.h, s: 1, l: 0.5, a: 1 }}
					onChange={this.changeH}
					backdrop={this.getHSLRainbow()} />
				<ColorSlider
					value={color.s}
					color={{ h: color.h, s: color.s, l: 0.5, a: 1 }}
					onChange={this.changeS}
					backdrop={[{ h: 0, s: 0, l: 0.5, a: 1 }, { h: 1, s: 1, l: 0.5, a: 1 }]} />
				<ColorSlider
					value={color.l}
					color={{ h: 0, s: 0, l: color.l, a: 1 }}
					onChange={this.changeL}
					backdrop={[{ h: 0, s: 0, l: 0, a: 1 }, { h: 0, s: 0, l: 1, a: 1 }]} />
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

		for (let i = 0; i < 10; i++) {
			colors.push({
				h: i / 10,
				s: 1,
				l: 0.5,
				a: 1
			})
		}

		return colors;
	}
}