/**
 * Truncate a string to a maximum length
 */
export function truncate(text: string, maxLength: number = 60): string {
	if (!text || text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + '...';
}

/**
 * Convert a string to URL-friendly slug
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove accents
		.replace(/[^a-z0-9]+/g, '-') // Replace special chars with dashes
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Private helper: Clean CSV string into array
 */
function cleanCsvString(str: string): string[] {
	return str
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

/**
 * Format tags: Show max 3 and add '+X more' if needed
 */
export function formatTags(tagsString: string = "Radio"): string[] {
	const tags = cleanCsvString(tagsString);

	const displayTags = tags.slice(0, 3);
	const moreCount = Math.max(0, tags.length - 3);

	if (moreCount > 0) {
		displayTags.push(`+${moreCount} more`);
	}

	return displayTags;
}

/**
 * Format languages into array
 */
export function formatLanguages(languageString: string = "unknown"): string[] {
	return cleanCsvString(languageString);
}

export function buildParams(params: Record<string, string>): string {
	return Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join("&");
}
