let basePixels = [];

onmessage = e => {
	const { type, data, id } = e.data;

	switch (type) {
		case "setBasePixels":
			basePixels = data;
			postMessage({
				id,
				type: "basePixelsUpdated",
				data: true,
			});
			break;
		case "adjustImage":
			const adjustment = data;

			postMessage({
				id,
				type: "pixelsAdjusted",
				data: basePixels.map(pixel => ({
					h: adjustment.h,
					s: Math.max(0, Math.min(1, pixel.s * adjustment.s)),
					l: pixel.l * adjustment.l * 2,
					a: pixel.a,
				}))
			});
	}
};