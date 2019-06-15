import { HSLColor } from "@typings/color";
import NumberUtils from "@utils/NumberUtils";

let basePixels: HSLColor[] = [];

onmessage = e => {
	const { type, data, id } = e.data;

	switch (type) {
		case "setBasePixels":
			basePixels = data;

			postMessage({
				id,
				type: "basePixelsUpdated",
				data: true,
			}, "*");
			break;
		case "adjustImage":
			const adjustment = data;

			postMessage({
				id,
				type: "pixelsAdjusted",
				data: basePixels.map(pixel => ({
					h: adjustment.h,
					s: NumberUtils.clamp(pixel.s * adjustment.s, 0, 1),
					l: pixel.l * adjustment.l * 2,
					a: pixel.a,
				}))
			}, "*");
	}
};
