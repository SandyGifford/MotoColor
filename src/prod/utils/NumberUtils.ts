export default class NumberUtils {
	public static clamp(val: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, val));
	}

	public static reduce(...nums: number[]): number[] {
		const gcd = NumberUtils.greatestCommonDenominator(...nums);
		return nums.map(num => num / gcd);
	}

	public static greatestCommonDenominator(...nums: number[]): number {
		return nums.reduce((factor, num) => {
			return NumberUtils._greatestCommonDenominator(factor, num);
		}, -Infinity)
	}

	private static _greatestCommonDenominator(a: number, b: number): number {
		return b ? NumberUtils._greatestCommonDenominator(b, a % b) : a;
	}
}
