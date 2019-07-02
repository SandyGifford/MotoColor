import { ArrayColor } from "@typings/color";

export interface SetBasePixelsMessage {
	id: number;
	type: "setBasePixels";
	data: Uint8ClampedArray;
}

export interface AdjustImageMessage {
	id: number;
	type: "adjustImage";
	data: AdjustImageMessageData;
}

export interface AdjustImageMessageData {
	adjustment: ArrayColor;
	transferBuffer: ArrayBuffer;
}

export interface BasePixelsUpdatedMessage {
	id: number;
	type: "basePixelsUpdated";
	data: ArrayColor;
}

export interface PixelsAdjustedMessage {
	id: number;
	type: "pixelsAdjusted";
	data: ArrayBuffer;
}