import "./DevApp.style";

import * as React from "react";
import io from "socket.io-client";

export interface DevAppProps { }
export interface DevAppState {
	errors: string[];
}

export default class DevApp extends React.PureComponent<DevAppProps, DevAppState> {
	private socket = io();

	constructor(props: DevAppProps) {
		super(props);

		this.state = {
			errors: null,
		};
	}

	public componentDidMount() {
		this.socket.on("buildSuccess", this.buildSuccess);

		this.socket.on("buildFail", this.buildFail);
	}

	public render(): React.ReactNode {
		const { errors } = this.state;
		return (
			<div className="DevApp">{
				errors ?
					<div className="DevApp__errors">{
						errors.map((err, i) => <div key={i} className="DevApp__errors__error">{err}</div>)
					}</div> :
					null
			}</div>
		)
	}

	private buildSuccess = () => {
		window.location.reload();
	};

	private buildFail = (errors: string[]) => {
		this.setState({ errors });
	};
}