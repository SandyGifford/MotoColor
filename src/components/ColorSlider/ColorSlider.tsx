import "./ColorSlider.style";

import * as React from "react";
import { HSLColor } from "@typings/color";
import ColorUtils from "@utils/ColorUtils";
import NumberUtils from "@utils/NumberUtils";

export type ColorSliderChangeHandler = (value: number) => void;

export interface ColorSliderProps {
	value: number;
	onChange: ColorSliderChangeHandler;
	backdrop: HSLColor[];
	color: HSLColor;
}
export interface ColorSliderState {
	dragOffset: number;
}

export default class ColorSlider extends React.PureComponent<ColorSliderProps, ColorSliderState> {
	private barRef: React.RefObject<HTMLDivElement> = React.createRef();

	constructor(props: ColorSliderProps) {
		super(props);
		this.state = {
			dragOffset: 0,
		};
	}

	public render(): React.ReactNode {
		const { value, color } = this.props;

		return (
			<div
				className="ColorSlider"
				ref={this.barRef}
				style={{ backgroundImage: this.getGradient() }}
				onClick={this.barClicked}>
				<div
					className="ColorSlider__thumb"
					onMouseDown={this.dragStart}
					style={{
						left: `${100 * NumberUtils.clamp(value, 0, 1)}%`,
						backgroundColor: ColorUtils.getCSSColor(color),
					}} />
			</div>
		)
	}

	public componentWillUnmount() {
		this.removeragListeners();
	}

	private barClicked: React.MouseEventHandler<HTMLDivElement> = e => {
		if (e.target !== e.currentTarget) return;
		this.setValueFromMousePosition(e.clientX);
	};

	private addDragListeners() {
		document.addEventListener("mousemove", this.drag);
		document.addEventListener("mouseup", this.endDrag);
	}

	private removeragListeners() {
		document.removeEventListener("mousemove", this.drag);
		document.removeEventListener("mouseup", this.endDrag);
	}

	private dragStart: React.MouseEventHandler<HTMLDivElement> = e => {
		const rect = e.currentTarget.getBoundingClientRect();

		this.setState({
			dragOffset: e.clientX - rect.left,
		});

		this.addDragListeners();
	};

	private drag = (e: MouseEvent) => {
		this.setValueFromMousePosition(e.clientX - this.state.dragOffset);
	};

	private endDrag = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		this.removeragListeners();
	};

	private setValueFromMousePosition(pos: number) {
		const left = this.barRef.current.offsetLeft;
		const width = this.barRef.current.offsetWidth;

		this.props.onChange(NumberUtils.clamp((pos - left) / width, 0, 1));
	}

	private getGradient(): string {
		const { backdrop } = this.props;
		const colors = backdrop.map((color, i) => `${ColorUtils.getCSSColor(color)} ${100 * i / (backdrop.length - 1)}%`);
		return `linear-gradient(to right, ${colors.join(", ")})`
	}
}