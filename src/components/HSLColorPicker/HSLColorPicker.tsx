import "./HSLColorPicker.style";

import * as React from "react";
import { HSLColor } from "@typings/color";
import NumberUtils from "@utils/NumberUtils";

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
				<input type="number" value={this.getComponent(color.h, 360)} onChange={this.changeH} />
				<input type="number" value={this.getComponent(color.s, 100)} onChange={this.changeS} />
				<input type="number" value={this.getComponent(color.l, 100)} onChange={this.changeL} />
			</div>
		)
	}

	private getComponent(val: number, max: number): string {
		const numVal = Math.round(max * NumberUtils.clamp(val, 0, 1));

		return isNaN(numVal) || typeof numVal !== "number" ? "" : numVal + "";
	}

	private changeH: React.ChangeEventHandler<HTMLInputElement> = e => {
		const { color, onChange } = this.props;
		const { s, l, a } = color;

		onChange({
			h: parseFloat(e.currentTarget.value) / 360,
			s,
			l,
			a
		});
	};

	private changeS: React.ChangeEventHandler<HTMLInputElement> = e => {
		const { color, onChange } = this.props;
		const { h, l, a } = color;

		onChange({
			h,
			s: parseFloat(e.currentTarget.value) / 100,
			l,
			a
		});
	};

	private changeL: React.ChangeEventHandler<HTMLInputElement> = e => {
		const { color, onChange } = this.props;
		const { h, s, a } = color;

		onChange({
			h,
			s,
			l: parseFloat(e.currentTarget.value) / 100,
			a
		});
	};
}