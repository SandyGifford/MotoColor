import { ArrayColor } from "@typings/color";
import ColorUtils from "./ColorUtils";


export interface ArrayPixelData {
	width: number;
	height: number;
	pixels: Uint8ClampedArray;
}

export type PixelLoopAction<T> = (pixel: ArrayColor, pixelIndex: number, componentIndex: number) => T;
export type ForEachPixelAction = PixelLoopAction<void>;
export type MapPixelAction<T> = PixelLoopAction<T>;

export default class ImageUtils {
	public static forEachPixel(pixels: Uint8ClampedArray, act: ForEachPixelAction): void {
		for (let i = 0; i < pixels.length; i += 4) act(
			[
				pixels[i],
				pixels[i + 1],
				pixels[i + 2],
				pixels[i + 3]
			],
			i / 4,
			i,
		);
	}

	public static mapPixels<T>(pixels: Uint8ClampedArray, act: MapPixelAction<T>): T[] {
		const arr: T[] = [];
		ImageUtils.forEachPixel(pixels, (pixel, pixelIndex, componentIndex) => arr.push(act(pixel, pixelIndex, componentIndex)));
		return arr;
	}

	public static mapPixelsToPixels(pixels: Uint8ClampedArray, act: MapPixelAction<ArrayColor>): Uint8ClampedArray {
		const arr = new Uint8ClampedArray(pixels.length);
		ImageUtils.forEachPixel(pixels, (pixel, pI, cI) => {
			const newPixel = act(pixel, pI, cI)
			arr[cI] = newPixel[0];
			arr[cI + 1] = newPixel[1];
			arr[cI + 2] = newPixel[2];
			arr[cI + 3] = newPixel[3];
		});
		return arr;
	}

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

	public static loadImageIntoRGBPixelData(url: string): Promise<ArrayPixelData> {
		return ImageUtils.loadImageIntoCanvas(url)
			.then(cvs => {
				const { width, height } = cvs;
				const ctx = cvs.getContext("2d");
				const imageData = ctx.getImageData(0, 0, width, height);
				const { data } = imageData;

				const pixels = new Uint8ClampedArray(data);

				return {
					pixels,
					width,
					height,
				};
			});
	}

	public static loadImageIntoHSLPixelData(url: string): Promise<ArrayPixelData> {
		return ImageUtils.loadImageIntoRGBPixelData(url)
			.then(pixelData => ({
				width: pixelData.width,
				height: pixelData.height,
				pixels: ImageUtils.mapPixelsToPixels(pixelData.pixels, ColorUtils.rgbToHSL),
			}));
	}
}