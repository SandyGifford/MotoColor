export default class GeneralUtils {
	// TODO: figure out how to keep argument names in return type
	public static debounce<R>(func: () => R, wait?: number): () => Promise<R>;
	public static debounce<R, A>(func: (a: A) => R, wait?: number): (a: A) => Promise<R>;
	public static debounce<R, A, B>(func: (a: A, b: B) => R, wait?: number): (a: A, b: B) => Promise<R>;
	public static debounce<R, A, B, C>(func: (a: A, b: B, c: C) => R, wait?: number): (a: A, b: B, c: C) => Promise<R>;
	public static debounce<R, A, B, C, D>(func: (a: A, b: B, c: C, d: D) => R, wait?: number): (a: A, b: B, c: C, d: D) => Promise<R>;
	public static debounce<R, A, B, C, D, E>(func: (a: A, b: B, c: C, d: D, e: E) => R, wait?: number): (a: A, b: B, c: C, d: D, e: E) => Promise<R>;
	public static debounce<R, A, B, C, D, E, F>(func: (a: A, b: B, c: C, d: D, e: E, f: F) => R, wait?: number): (a: A, b: B, c: C, d: D, e: E, f: F) => Promise<R>;
	public static debounce<R, T>(func: (...args: T[]) => R, wait = 1000): (...args: T[]) => Promise<R> {
		let timeout: number;
		return function () {
			return new Promise<R>(res => {
				const args = arguments;
				const later = () => {
					timeout = null;
					res(func.apply(args));
				};

				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
			});
		};
	}
}
