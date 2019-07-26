export default class DomUtils {
	public static makeBEMClassName(baseClass: string, modifiers: { [modifier: string]: boolean }): string {
		// not efficient, but I had fun writing it
		return [baseClass].concat(Object.keys(modifiers).map(mod => modifiers[mod] ? `${baseClass}--${mod}` : null).filter(i => !!i)).join(" ");
	}
}