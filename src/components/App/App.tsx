import "./App.style";

import * as React from "react";
import HSLColorPicker from "@components/HSLColorPicker/HSLColorPicker";
import { HSLColor, ArrayColor } from "@typings/color";
import ImageUtils from "@utils/ImageUtils";
import HSLImage from "@components/HSLImage/HSLImage";

interface LayerInitiator {
	url: string;
	name: string;
	static?: boolean;
	x?: number;
	y?: number;
}

interface HSLLayer {
	name: string;
	pixels: Uint8ClampedArray;
	width: number;
	height: number;
	x: number;
	y: number;
	adjustment: ArrayColor;
	active: boolean;
}

export interface AppProps { }
export interface AppState {
	layers: { [urls: string]: HSLLayer };
	ready: boolean;
	fullWidth: number;
	fullHeight: number;
}

const layerInitiators: LayerInitiator[] = Object.freeze([
	// { name: "Test Pattern", url: "assets/images/test_pattern.png" },
	{ name: "Tank", url: "assets/images/tank.png", x: 0.20858135, y: 0.25 },
	{ name: "Frame", url: "assets/images/frame.png", x: 0.21825397, y: 0.38921958 },
	{ name: "Fender", url: "assets/images/fender.png", x: 0.15228175, y: 0.46164021 },
	{ name: "Background", url: "assets/images/background.png", static: true },
]) as LayerInitiator[];

export default class App extends React.PureComponent<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state = {
			layers: {},
			ready: false,
			fullWidth: 0,
			fullHeight: 0,
		};
	}

	public componentDidMount() {
		Promise.all(layerInitiators.map(layerInitiator => ImageUtils.loadImageIntoHSLPixelData(layerInitiator.url)
			.then(pixelData => {
				const { name, x, y } = layerInitiator;
				const { layers } = this.state;

				this.setState({
					layers: {
						...layers,
						[layerInitiator.name]: {
							name: name,
							pixels: pixelData.pixels,
							adjustment: [0, 255, 128, 255],
							active: false,
							width: pixelData.width,
							height: pixelData.height,
							x: x || 0,
							y: y || 0,
						},
					},
				});
			})
		))
			.then(() => {
				const backgroundLayer = this.state.layers["Background"];

				location.search.slice(1).split("&")
					.filter(item => !!item)
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

				this.setState({
					ready: true,
					fullWidth: backgroundLayer.width,
					fullHeight: backgroundLayer.height,
				});
			});
	}

	public componentDidUpdate() {
		if (this.state.ready) this.updateURL();
	}

	public render(): React.ReactNode {
		const { layers, ready, fullWidth, fullHeight } = this.state;

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
										color={{
											h: layer.adjustment[0],
											s: layer.adjustment[1],
											l: layer.adjustment[2],
											a: 1,
										}}
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

							return <div
								key={name}
								className="App__layers__layer"
								style={{
									paddingBottom: `${100 * fullHeight / fullWidth}%`,
								}}>
								{
									layerInitiator.static ?
										<img className="App__layers__layer__img App__layers__layer__img--static" src={url} /> :
										<div
											className="App__layers__layer__img"
											style={{
												top: `${100 * layer.y}%`,
												left: `${100 * layer.x}%`,
												width: `${100 * layer.width / fullWidth}%`,
												height: `${100 * layer.height / fullHeight}%`,
											}}>
											<HSLImage
												pixels={layer.pixels}
												adjustment={layer.adjustment}
												adjust={layer.active}
												width={layer.width}
												height={layer.height} />
										</div>
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
					adjustment: [newColor.h, newColor.s, newColor.l, newColor.a],
				}
			}
		});
	};

	private updateURL() {
		const { layers } = this.state;

		const url = Object.keys(layers).map(name => {
			const { adjustment, active } = layers[name];
			const [h, s, l] = adjustment;

			if (!active) return null;
			return `${encodeURIComponent(name)}=${h},${s},${l}`;
		})
			.filter(i => !!i)
			.join("&");

		window.history.replaceState({}, "", `?${url}`);
	}
}
