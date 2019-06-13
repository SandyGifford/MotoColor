// based on https://gist.github.com/mjackson/5311256

import { RGBColor, HSLColor } from "@typings/color";

export default class ColorUtils {
	public static getCSSColor(color: RGBColor | HSLColor): string {
		if (typeof (color as HSLColor).h === "number") {
			const { h, s, l, a } = color as HSLColor;
			return `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;
		} else {
			const { r, g, b, a } = color as RGBColor;
			return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
		}
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and l in the set [0, 1].
	 *
	 * @param   Number  r       The red color value
	 * @param   Number  g       The green color value
	 * @param   Number  b       The blue color value
	 * @return  Array           The HSL representation
	 */
	public static rgbToHSL(color: RGBColor): HSLColor {
		let { r, g, b, a } = color;

		r /= 255, g /= 255, b /= 255;

		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return { h, s, l, a };
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	public static hslToRGB(color: HSLColor): RGBColor {
		let { h, s, l, a } = color;
		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = ColorUtils.hue2RGBComponent(p, q, h + 1 / 3);
			g = ColorUtils.hue2RGBComponent(p, q, h);
			b = ColorUtils.hue2RGBComponent(p, q, h - 1 / 3);
		}

		return {
			r: r * 255,
			g: g * 255,
			b: b * 255,
			a,
		};
	}

	private static hue2RGBComponent(p: number, q: number, t: number): number {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}
}