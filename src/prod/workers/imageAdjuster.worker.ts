import NumberUtils from "@utils/NumberUtils";
import { SetBasePixelsMessage, AdjustImageMessage, AdjustImageMessageData, PixelsAdjustedMessage } from "./messages";
import ImageUtils from "@utils/ImageUtils";

type IncomingMessage = SetBasePixelsMessage | AdjustImageMessage;

let basePixels: Uint8ClampedArray;

onmessage = e => {
	const { type, id, data } = (e.data as IncomingMessage);

	switch (type) {
		case "setBasePixels":
			basePixels = data as Uint8ClampedArray;

			postMessage({
				id,
				type: "basePixelsUpdated",
				data: true,
			}, undefined);
			break;
		case "adjustImage":
			const { adjustment, transferBuffer } = (data as AdjustImageMessageData);
			const uint8 = new Uint8ClampedArray(transferBuffer);

			const s = adjustment[1] / 128;
			const l = adjustment[2] / 128;

			ImageUtils.forEachPixel(basePixels, (pixel, pI, cI) => {
				uint8[cI] = adjustment[0];
				uint8[cI + 1] = NumberUtils.clamp(pixel[1] * s, 0, 255);
				uint8[cI + 2] = NumberUtils.clamp(pixel[2] * l, 0, 255);
				uint8[cI + 3] = pixel[3];
			});

			const message: PixelsAdjustedMessage = {
				id,
				type: "pixelsAdjusted",
				data: uint8.buffer,
			};

			postMessage(message, undefined, [uint8.buffer]);
			break;
	}
};
