export default function (link, options) {
	if (link.includes('zendesk')) {
		return options.fn(this);
	}
}
