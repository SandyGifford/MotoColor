import "./App.style";

import * as React from "react";
import HSLColorPicker from "@components/HSLColorPicker/HSLColorPicker";
import { HSLColor } from "@typings/color";
import ImageUtils from "@utils/ImageUtils";
import HSLImage from "@components/HSLImage/HSLImage";

interface LayerInitiator {
	url: string;
	name: string;
	static?: boolean;
}

interface HSLLayer {
	name: string;
	pixels: HSLColor[];
	adjustment: HSLColor;
	active: boolean;
}

export interface AppProps { }
export interface AppState {
	layers: { [urls: string]: HSLLayer };
	width: number;
	height: number;
	ready: boolean;
}

const layerInitiators: LayerInitiator[] = Object.freeze([
	{ name: "Tank", url: "assets/images/tank.png" },
	{ name: "Frame", url: "assets/images/frame.png" },
	{ name: "Fender", url: "assets/images/fender.png" },
	{ name: "Background", url: "assets/images/background.png", static: true },
]) as LayerInitiator[];

export default class App extends React.PureComponent<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state = {
			layers: {},
			width: 0,
			height: 0,
			ready: false,
		};
	}

	public componentDidMount() {
		Promise.all(layerInitiators.map(layerInitiator => ImageUtils.loadImageIntoHSLPixelData(layerInitiator.url)
			.then(pixelData => {
				const { layers } = this.state;

				this.setState({
					layers: {
						...layers,
						[layerInitiator.name]: {
							name: layerInitiator.name,
							pixels: pixelData.pixels,
							adjustment: { h: 0, s: 1, l: 0.5, a: 1 },
							active: false,
						},
					},
					width: pixelData.width,
					height: pixelData.height,
				});
			})
		))
			.then(() => {
				location.search.slice(1).split("&")
					.forEach(item => {
						const [name, color] = item.split("=");
						const [h, s, l] = color.split(",");

						this.adjustmentChanged(name, {
							h: parseFloat(h),
							s: parseFloat(s),
							l: parseFloat(l),
							a: 1
						})
					});

				this.setState({ ready: true });
			});
	}

	public componentDidUpdate() {
		if (this.state.ready) this.updateURL();
	}

	public render(): React.ReactNode {
		const { layers, width, height, ready } = this.state;

		if (!ready) return null;

		return (
			<div className="App">
				<div className="App__adjusters">
					{
						layerInitiators.map(layerInitiator => {
							const { name } = layerInitiator;
							const layer = layers[name];

							if (layerInitiator.static) return null;

							return <div key={name} className="App__adjusters__adjuster">
								<input
									className="App__adjusters__adjuster__active"
									type="checkbox"
									checked={layer.active}
									onChange={() => this.toggleActive(name)} />
								<div className="App__adjusters__adjuster__label">{name}</div>
								<div className="App__adjusters__adjuster__picker">
									<HSLColorPicker
										color={layer.adjustment}
										onChange={color => this.adjustmentChanged(name, color)} />
								</div>
							</div>
						})
					}
				</div>
				<div className="App__layers">
					{
						layerInitiators.map(layerInitiator => {
							const { name, url } = layerInitiator;
							const layer = layers[name];

							return <div key={name} className="App__layers__layer">
								{
									layerInitiator.static ?
										<img className="App__layers__layer__static" src={url} /> :
										<HSLImage
											pixels={layer.pixels}
											adjustment={layer.adjustment}
											adjust={layer.active}
											width={width}
											height={height} />
								}
							</div>
						}).reverse()
					}
				</div>
			</div>
		)
	}

	private toggleActive = (name: string) => {
		let { layers } = this.state;

		this.setState({
			layers: {
				...layers,
				[name]: {
					...layers[name],
					active: !layers[name].active,
				}
			}
		});
	};

	private adjustmentChanged = (name: string, newColor: HSLColor) => {
		let { layers } = this.state;

		this.setState({
			layers: {
				...layers,
				[name]: {
					...layers[name],
					active: true,
					adjustment: newColor,
				}
			}
		});
	};

	private updateURL() {
		const { layers } = this.state;

		const url = Object.keys(layers).map(name => {
			const { adjustment, active } = layers[name];
			const { h, s, l } = adjustment;

			if (!active) return null;
			return `${encodeURIComponent(name)}=${h},${s},${l}`;
		})
			.filter(i => !!i)
			.join("&");

		window.history.pushState({}, "", `?${url}`);
	}

	// private getAdjustmentsFromUrl(): {[name: string]: HSLColor} {
	// 	console
	// }
}
