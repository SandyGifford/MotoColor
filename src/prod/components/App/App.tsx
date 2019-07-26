import "./App.style";

import * as React from "react";
import HSLColorPicker from "@components/HSLColorPicker/HSLColorPicker";
import { HSLColor, ArrayColor } from "@typings/color";
import ImageUtils from "@utils/ImageUtils";
import HSLImage from "@components/HSLImage/HSLImage";
import GeneralUtils from "@utils/GeneralUtils";
import Checkbox from "@components/Checkbox/Checkbox";
import UrlUtils from "@utils/UrlUtils";
import NumberUtils from "@utils/NumberUtils";
import DomUtils from "@utils/DomUtils";
import { Vector2 } from "@typings/vector";

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
	layers: { [name: string]: HSLLayer };
	ready: boolean;
	imgDims: Vector2;
	layersType: string;
	sizeByHeight: boolean;
}

const layerInitiators: { [type: string]: LayerInitiator[] } & { dflt: LayerInitiator[] } = Object.freeze({
	dflt: [
		{ name: "Tank", url: "assets/images/moto/tank.png", x: 0.20858135, y: 0.25 },
		{ name: "Frame", url: "assets/images/moto/frame.png", x: 0.21825397, y: 0.38921958 },
		{ name: "Fender", url: "assets/images/moto/fender.png", x: 0.15228175, y: 0.46164021 },
		{ name: "Background", url: "assets/images/moto/background.png", static: true },
	],
	test: [
		{ name: "Background", url: "assets/images/test/test_pattern.png" },
	],
	rox: [
		{ name: "Hair", url: "assets/images/rox/hair.png", x: 131 / 1152, y: 327 / 2048 },
		{ name: "Background", url: "assets/images/rox/background.png", static: true },
	]
});

export default class App extends React.PureComponent<AppProps, AppState> {
	private frameRef = React.createRef<HTMLDivElement>();

	constructor(props: AppProps) {
		super(props);

		this.state = {
			layers: {},
			ready: false,
			imgDims: { x: 0, y: 0 },
			layersType: null,
			sizeByHeight: false,
		};
	}

	public componentDidMount() {
		const qso = UrlUtils.getQueryStringObject();
		const layerType = qso.type || "dflt";
		delete qso.type;

		window.addEventListener("resize", this.updateSizeByDim);

		Promise.all(layerInitiators[layerType].map(layerInitiator => ImageUtils.loadImageIntoHSLPixelData(layerInitiator.url)
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

				Object.keys(qso)
					.forEach(layerName => {
						const color = qso[layerName];
						const [h, s, l] = decodeURIComponent(color).split(",");

						this.adjustmentChanged(layerName, {
							h: parseInt(h),
							s: parseInt(s),
							l: parseInt(l),
							a: 255
						})
					});

				this.setState({
					ready: true,
					imgDims: { x: backgroundLayer.width, y: backgroundLayer.height },
					layersType: layerType,
				}, this.updateSizeByDim);
			});
	}

	public componentDidUpdate() {
		if (this.state.ready) this.updateUrl();
	}

	public render(): React.ReactNode {
		const { layers, ready, imgDims, layersType, sizeByHeight } = this.state;

		if (!ready) return null;

		const [ratioX, ratioY] = NumberUtils.reduce(imgDims.x, imgDims.y);
		const frameClassName = DomUtils.makeBEMClassName("App__content__frame", { sizeByHeight });
		const frameSizerClassName = DomUtils.makeBEMClassName("App__content__frame__sizer", { sizeByHeight });

		return (
			<div className="App">
				<div className="App__sidebar">
					{
						layerInitiators[layersType].map(layerInitiator => {
							const { name } = layerInitiator;
							const layer = layers[name];

							if (layerInitiator.static) return null;

							return <div key={name} className="App__sidebar__adjuster">
								<Checkbox
									label={name}
									checked={layer.active}
									onChange={active => this.changeActive(name, active)} />
								<div className="App__sidebar__adjuster__picker">
									<HSLColorPicker
										color={{
											h: layer.adjustment[0],
											s: layer.adjustment[1],
											l: layer.adjustment[2],
											a: 255,
										}}
										onChange={color => this.adjustmentChanged(name, color)} />
								</div>
							</div>
						})
					}
				</div>
				<div className="App__content" ref={this.frameRef}>
					<div className={frameClassName}>
						<canvas className={frameSizerClassName} width={ratioX} height={ratioY} />
						<div className="App__content__frame__layers">
							{
								layerInitiators[layersType].map(layerInitiator => {
									const { name, url } = layerInitiator;
									const layer = layers[name];

									return <div
										key={name}
										className="App__content__frame__layers__layer">
										{
											layerInitiator.static ?
												<img className="App__content__frame__layers__layer__img App__content__frame__layers__layer__img--static" src={url} /> :
												<div
													className="App__content__frame__layers__layer__img"
													style={{
														top: `${100 * layer.y}%`,
														left: `${100 * layer.x}%`,
														width: `${100 * layer.width / imgDims.x}%`,
														height: `${100 * layer.height / imgDims.y}%`,
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
				</div>
			</div>
		)
	}

	private updateSizeByDim = () => {
		const { imgDims } = this.state;
		const frameRect = this.frameRef.current.getBoundingClientRect();
		const frameRatio = frameRect.height / frameRect.width;
		const imgRatio = imgDims.y / imgDims.x;

		this.setState({
			sizeByHeight: frameRatio < imgRatio,
		});
	}

	private changeActive = (name: string, active: boolean) => {
		let { layers } = this.state;

		this.setState({
			layers: {
				...layers,
				[name]: {
					...layers[name],
					active: active,
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

	private updateUrl = GeneralUtils.debounce(() => {
		const { layers, layersType } = this.state;

		const url = Object.keys(layers).map(name => {
			const { adjustment, active } = layers[name];
			const [h, s, l] = adjustment;

			if (!active) return null;
			return `${encodeURIComponent(name)}=${Math.round(h)},${Math.round(s)},${Math.round(l)}`;
		})
			.concat([layersType ? `type=${layersType}` : null])
			.filter(i => !!i)
			.join("&");

		window.history.replaceState({}, "", `?${url}`);
	});
}
