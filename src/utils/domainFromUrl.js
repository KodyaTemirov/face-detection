export function domainFromUrl(url) {
	var domainRegex = /^(https?:\/\/)?([^\/]+)/;
	var match = url.match(domainRegex);
	return match ? match[0] : null;
}
