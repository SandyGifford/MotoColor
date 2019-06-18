import { PixelsAdjustedMessage, BasePixelsUpdatedMessage, SetBasePixelsMessage, AdjustImageMessage } from "./messages";
import { ArrayColor } from "@typings/color";

type IncomingMessage = PixelsAdjustedMessage | BasePixelsUpdatedMessage;

type PromiseResolution<T> = (value?: T | PromiseLike<T>) => void;
type PromiseRejection = (reason?: any) => void;

interface PromiseResolvers<T> {
	res: PromiseResolution<T>;
	rej: PromiseRejection;
}

export class ImageAdjuster {
	// TODO: THIS WORKER WILL BREAK IF A CALL IS MADE TO IT BEFORE THE PREVIOUS ONE COMPLETES
	// as it is the code is set up to not make multiple calls to the worker at once.  Still,
	// there should be a contingency for it.
	private transferablePixelBuffer: ArrayBuffer;
	private id = 0;
	private resolvers: { [id: number]: PromiseResolvers<any> } = {};
	private readonly worker = new Worker("build/workers/imageAdjuster.js");

	constructor(basePixels?: Uint8ClampedArray) {
		this.worker.addEventListener("message", this.messageReceived);
		if (basePixels) this.setBasePixels(basePixels);
	}

	public setBasePixels(basePixels: Uint8ClampedArray): Promise<void> {
		const id = this.id++;

		this.transferablePixelBuffer = new ArrayBuffer(basePixels.length);
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

	public adjustImage(adjustment: ArrayColor): Promise<Uint8ClampedArray> {
		const id = this.id++;
		const message: AdjustImageMessage = {
			id,
			type: "adjustImage",
			data: {
				adjustment,
				transferBuffer: this.transferablePixelBuffer,
			},
		};

		this.worker.postMessage(message, [this.transferablePixelBuffer]);

		return new Promise((res, rej) => {
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
				delete this.resolvers[message.id];
				break;
			case "pixelsAdjusted":
				this.transferablePixelBuffer = message.data;
				const uint8 = new Uint8ClampedArray(message.data);
				resolver.res(uint8);
				delete this.resolvers[message.id];
				break;
			default:
				resolver.rej(`ImageAdjuster got unknown message type "${(message as any).type}"`);
				break;
		}
	};
}