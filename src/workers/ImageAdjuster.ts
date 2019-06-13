import { HSLColor } from "@typings/color";

interface SetBasePixelsMessage {
	id: number;
	type: "setBasePixels";
	data: HSLColor[];
}

interface AdjustImageMessage {
	id: number;
	type: "adjustImage";
	data: HSLColor;
}

interface BasePixelsUpdatedMessage {
	id: number;
	type: "basePixelsUpdated";
	data: HSLColor;
}

interface PixelsAdjustedMessage {
	id: number;
	type: "pixelsAdjusted";
	data: HSLColor[];
}

type IncomingMessage = PixelsAdjustedMessage | BasePixelsUpdatedMessage;
// type OutgoingMessage = SetBasePixelsMessage | AdjustImageMessage;

type PromiseResolution<T> = (value?: T | PromiseLike<T>) => void;
type PromiseRejection = (reason?: any) => void;

interface PromiseResolvers<T> {
	res: PromiseResolution<T>;
	rej: PromiseRejection;
}

export class ImageAdjuster {
	private id = 0;
	private resolvers: { [id: number]: PromiseResolvers<any> } = {};
	private readonly worker = new Worker("assets/workers/adjustImage.js");

	constructor(basePixels?: HSLColor[]) {
		this.worker.addEventListener("message", this.messageReceived);

		if (basePixels) this.setBasePixels(basePixels);
	}

	public setBasePixels(basePixels: HSLColor[]): Promise<void> {
		const id = this.id++;

		const message: SetBasePixelsMessage = {
			id,
			type: "setBasePixels",
			data: basePixels,

		};

		this.worker.postMessage(message);

		return new Promise<void>((res, rej) => {
			this.resolvers[id] = { res, rej };
		});
	}

	public adjustImage(adjustment: HSLColor): Promise<HSLColor[]> {
		const id = this.id++;

		const message: AdjustImageMessage = {
			id,
			type: "adjustImage",
			data: adjustment,

		};

		this.worker.postMessage(message);

		return new Promise<HSLColor[]>((res, rej) => {
			this.resolvers[id] = { res, rej };
		});
	}

	private messageReceived = (e: MessageEvent) => {
		let message: IncomingMessage = e.data;

		const resolver = this.resolvers[message.id];
		if (!resolver) throw `ImageAdjuster got unknown id ${message.id}`;

		switch (message.type) {
			case "basePixelsUpdated":
				resolver.res();
				break;
			case "pixelsAdjusted":
				resolver.res(message.data);
				break;
			default:
				resolver.rej(`ImageAdjuster got unknown message type "${(message as any).type}"`);
				break;
		}
	};
}