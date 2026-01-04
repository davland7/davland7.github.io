/**
 * Capitalise la première lettre d'un mot
 */
export function capitalize(word: string): string {
	if (!word) return word;
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Tronque une chaîne à une longueur maximale
 */
export function truncate(text: string, maxLength: number = 60): string {
	if (!text || text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + '...';
}

/**
 * Convertit une chaîne en slug URL-friendly
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Supprime les accents
		.replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par des tirets
		.replace(/^-+|-+$/g, ''); // Supprime les tirets au début et à la fin
}

/**
 * Formate les tags : affiche max 3 premiers et ajoute '+X more' si nécessaire
 */
export function formatTags(tagsString: string = "Radio"): string[] {
	const tags = tagsString
		.split(',')
		.map((tag) => capitalize(tag.trim()))
		.filter((tag) => tag.length > 0);

	const displayTags = tags.slice(0, 3);
	const moreCount = Math.max(0, tags.length - 3);

	if (moreCount > 0) {
		displayTags.push(`+${moreCount} more`);
	}

	return displayTags;
}

/**
 * Formate les langues en tableau avec première lettre majuscule
 */
export function formatLanguages(languageString: string = "unknown"): string[] {
	return languageString
		.split(',')
		.map((lang) => capitalize(lang.trim()))
		.filter((lang) => lang.length > 0);
}

/**
 * Filtre les tags pour ne garder que ceux présents dans la liste des tags populaires
 */
export function filterPopularTags(tagsString: string, popularTagNames: string[]): string {
	if (!tagsString || popularTagNames.length === 0) return "Radio";

	const stationTags = tagsString
		.split(',')
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0);

	// Normaliser les tags populaires en minuscules pour comparaison
	const popularTagsLower = popularTagNames.map((t) => t.toLowerCase());

	// Garder seulement les tags qui matchent avec les populaires
	const filteredTags = stationTags.filter((tag) =>
		popularTagsLower.includes(tag.toLowerCase())
	);

	// Si aucun match, retourner "Radio" par défaut
	return filteredTags.length > 0 ? filteredTags.join(', ') : "Radio";
}

export function buildParams(params: Record<string, string>): string {
	return Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join("&");
}
