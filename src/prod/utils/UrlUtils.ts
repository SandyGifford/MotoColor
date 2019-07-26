export default class UrlUtils {
	public static getQueryStringObject(): { [key: string]: string } {
		return location.search.replace(/^\?/, "").split("&")
			.filter(item => !!item)
			.reduce((obj, kvp) => {
				const [key, value] = kvp.split("=");
				obj[key] = value;
				return obj;
			}, {} as { [key: string]: string })
	}
}