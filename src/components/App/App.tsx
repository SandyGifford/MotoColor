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
	{ name: "Tank", url: "/assets/images/tank.png" },
	{ name: "Frame", url: "/assets/images/frame.png" },
	{ name: "Fender", url: "/assets/images/fender.png" },
	{ name: "Background", url: "/assets/images/background.png", static: true },
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
						[layerInitiator.url]: {
							name: layerInitiator.name,
							pixels: pixelData.pixels,
							adjustment: { h: 0, s: 1, l: 1, a: 1 },
							active: false,
						},
					},
					width: pixelData.width,
					height: pixelData.height,
				});
			})
		))
			.then(() => this.setState({ ready: true }));
	}

	public render(): React.ReactNode {
		const { layers, width, height, ready } = this.state;

		if (!ready) return null;

		return (
			<div className="App">
				<div className="App__adjusters">
					{
						layerInitiators.map(layerInitiator => {
							const { url, name } = layerInitiator;
							const layer = layers[url];

							if (layerInitiator.static) return null;

							return <div key={url} className="App__adjusters__adjuster">
								<input
									className="App__adjusters__adjuster__active"
									type="checkbox"
									checked={layer.active}
									onChange={() => this.toggleActive(url)} />
								<div className="App__adjusters__adjuster__label">{name}</div>
								<div className="App__adjusters__adjuster__picker">
									<HSLColorPicker
										color={layer.adjustment}
										onChange={color => this.adjustmentChanged(url, color)} />
								</div>
							</div>
						})
					}
				</div>
				<div className="App__layers">
					{
						layerInitiators.map(layerInitiator => {
							const { url } = layerInitiator;
							const layer = layers[url];

							return <div key={url} className="App__layers__layer">
								{
									layerInitiator.static ?
										<img src={layerInitiator.url} /> :
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

	private toggleActive = (url: string) => {
		let { layers } = this.state;

		this.setState({
			layers: {
				...layers,
				[url]: {
					...layers[url],
					active: !layers[url].active,
				}
			}
		});
	};

	private adjustmentChanged = (url: string, newColor: HSLColor) => {
		let { layers } = this.state;

		this.setState({
			layers: {
				...layers,
				[url]: {
					...layers[url],
					active: true,
					adjustment: newColor,
				}
			}
		});
	};
}
