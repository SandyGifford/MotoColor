import { RGBColor, HSLColor } from "@typings/color";
import ColorUtils from "./ColorUtils";

export interface RGBPixelData {
	width: number;
	height: number;
	pixels: RGBColor[];
}

export interface HSLPixelData {
	width: number;
	height: number;
	pixels: HSLColor[];
}

export default class ImageUtils {
	public static loadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((res, rej) => {
			const img = document.createElement("img");
			img.addEventListener("load", () => res(img));
			img.addEventListener("error", rej);
			img.src = url;
		});
	}

	public static loadImageIntoCanvas(url: string): Promise<HTMLCanvasElement> {
		return ImageUtils.loadImage(url)
			.then(img => {
				const cvs = document.createElement("canvas");
				const ctx = cvs.getContext("2d");

				cvs.width = img.width;
				cvs.height = img.height;

				ctx.drawImage(img, 0, 0);

				return cvs;
			});
	}

	public static loadImageIntoRGBPixelData(url: string): Promise<RGBPixelData> {
		return ImageUtils.loadImageIntoCanvas(url)
			.then(cvs => {
				const { width, height } = cvs;
				const ctx = cvs.getContext("2d");
				const imageData = ctx.getImageData(0, 0, width, height);
				const { data } = imageData;
				const pixels: RGBColor[] = [];

				for (let i = 0; i < data.length; i += 4) {
					pixels[i / 4] = {
						r: data[i],
						g: data[i + 1],
						b: data[i + 2],
						a: data[i + 3],
					};
				}

				return {
					pixels,
					width,
					height,
				};
			});
	}

	public static loadImageIntoHSLPixelData(url: string): Promise<HSLPixelData> {
		return ImageUtils.loadImageIntoRGBPixelData(url)
			.then(pixelData => ({
				...pixelData,
				pixels: pixelData.pixels.map(ColorUtils.rgbToHSL),
			}));
	}
}