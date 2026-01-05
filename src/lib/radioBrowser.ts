import { buildParams, slugify, formatTags, formatLanguages, truncate } from "./utils.ts";
import type { Country, RadioStation, StationsByTerm, Tag, Term } from "./types.ts";
import { SearchType } from "./types.ts";

// fi1.api.radio-browser.info
// de1.api.radio-browser.info
// de2.api.radio-browser.info
const API_BASE = "https://de1.api.radio-browser.info/json";
const SORT_BY_STATION_COUNT_DESC = `order=stationcount&reverse=true`;
const SEARCH_PARAMS = {
	order: "votes",
	reverse: "true",
	hidebroken: "true",
} as const;

// Helper: Transform countries/tags into Term objects
const toTerms = (items: (Country | Tag)[], type: SearchType): Term[] =>
	items
		.filter((item) => item.name && slugify(item.name))
		.map((item) => {
			const term: Term = {
				name: item.name,
				type,
				slug: slugify(item.name),
			};
			if (type === SearchType.Country && 'iso_3166_1' in item) {
				term.code = item.iso_3166_1?.toLowerCase();
			}
			return term;
		});

export async function fetchPopularCountries(limit: number): Promise<Country[]> {
	try {
		const response = await fetch(
			`${API_BASE}/countries?${SORT_BY_STATION_COUNT_DESC}&limit=${limit}`,
		);
		const countries = await response.json();
		return countries.map((c: Country) => ({
			...c,
			slug: slugify(c.name),
		}));
	} catch (error) {
		console.error("Failed to load countries:", error);
		return [];
	}
}

export async function fetchPopularTags(limit: number): Promise<Tag[]> {
	try {
		const response = await fetch(`${API_BASE}/tags?${SORT_BY_STATION_COUNT_DESC}&limit=${limit}`);
		const tags = await response.json();
		return tags.map((t: Tag) => ({
			...t,
			slug: slugify(t.name),
		}));
	} catch (error) {
		console.error("Failed to load tags:", error);
		return [];
	}
}

export async function fetchTerms(limit: number = 16): Promise<Term[]> {
	try {
		const [tags, countries] = await Promise.all([
			fetchPopularTags(limit),
			fetchPopularCountries(limit),
		]);

		const countryTerms = toTerms(countries || [], SearchType.Country);
		const tagTerms = toTerms(tags || [], SearchType.Tag);

		return [...countryTerms, ...tagTerms].sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	} catch (error) {
		console.error("Failed to load terms:", error);
		return [];
	}
}

export async function getCategoriesByType(type: SearchType, limit: number = 16): Promise<Term[]> {
	const terms = await fetchTerms(limit);
	return terms.filter((item) => item.type === type);
}

export async function fetchStationsByTerm({
	term,
	type,
	limit = 128,
}: StationsByTerm): Promise<RadioStation[]> {
	const searchParams: Record<string, string> = {
		...SEARCH_PARAMS,
		limit: String(limit),
	};

	try {
		const response = await fetch(
			`${API_BASE}/stations/search?${type}=${term}&${buildParams(searchParams)}`,
		);
		if (!response.ok) throw new Error(`Failed to load stations for ${term}`);
		let stations: any[] = await response.json();

		stations = stations
			.filter((s) => s.url_resolved?.startsWith("https://"))
			.map((s) => ({
				name: truncate(s.name, 80),
				url: s.url_resolved,
				tags: formatTags(s.tags || ""),
				country: s.country,
				countrycode: s.countrycode?.toLowerCase() || '',
				language: formatLanguages(s.language),
				bitrate: s.bitrate || 0,
				codec: s.codec || "Unknown",
				hls: s.hls || 0,
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		return stations as RadioStation[];
	} catch (error) {
		console.error(`Failed to load stations for ${term}:`, error);
		return [];
	}
}
