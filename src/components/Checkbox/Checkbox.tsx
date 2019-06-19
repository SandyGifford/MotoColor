import "./Checkbox.style";

import * as React from "react";

export type CheckboxChangeEventHandler = (checked: boolean) => void;

export interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: CheckboxChangeEventHandler;
}

export interface CheckboxState { }

export default class Checkbox extends React.PureComponent<CheckboxProps, CheckboxState> {
	private static lastId = 0;
	private readonly ID = Checkbox.lastId++;

	constructor(props: CheckboxProps) {
		super(props);
		this.state = {};
	}

	public render(): React.ReactNode {
		const { checked, label } = this.props;

		return (
			<div className="Checkbox">
				<input
					className="Checkbox__input"
					id={`Checkbox ${this.ID}`}
					type="checkbox"
					checked={checked}
					onChange={this.toggle} />
				<label className="Checkbox__label" htmlFor={`Checkbox ${this.ID}`}>{label}</label>
			</div>
		)
	}

	private toggle = () => {
		this.props.onChange(!this.props.checked);
	};
}