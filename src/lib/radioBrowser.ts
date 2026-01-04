import { buildParams, slugify, formatTags, formatLanguages, filterPopularTags, truncate } from "./utils.ts";
import type { Country, RadioStation, StationsByTerm, Tag, Term } from "./types.ts";
import { SearchType } from "./types.ts";

// fi1.api.radio-browser.info
// de1.api.radio-browser.info
// de2.api.radio-browser.info
const API_BASE = "https://de1.api.radio-browser.info/json";
const SORT_BY_STATION_COUNT_DESC = `order=stationcount&reverse=true`;

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

		const countryItems: Term[] = (countries || [])
			.filter((c) => c.name && slugify(c.name))
			.map((c) => ({
				code: c.iso_3166_1 ? c.iso_3166_1.toLowerCase() : undefined,
				name: c.name,
				type: SearchType.Country,
				slug: slugify(c.name),
			}));

		const tagItems: Term[] = (tags || [])
			.filter((t) => t.name && slugify(t.name))
			.map((t) => ({
				name: t.name,
				type: SearchType.Tag,
				slug: slugify(t.name),
			}));

		const combined: Term[] = [...countryItems, ...tagItems].sort((a, b) =>
			a.name.localeCompare(b.name),
		);

		return combined;
	} catch (error) {
		console.error("Failed to load terms:", error);
		return [];
	}
}

export async function fetchStationsByTerm({
	term,
	type,
	limit = 128,
}: StationsByTerm): Promise<RadioStation[]> {
	const searchParams: Record<string, string> = {
		order: "votes",
		limit: String(limit),
		reverse: "true",
		hidebroken: "true",
	};

	try {
		const response = await fetch(
			`${API_BASE}/stations/search?${`${type}=${term}`}&${buildParams(searchParams)}`,
		);
		if (!response.ok) throw new Error(`Failed to load stations for ${term}`);
		let stations: any[] = await response.json();

		// Filter for HTTPS and extract only necessary fields
		stations = stations
			.filter((s) => s.url_resolved?.startsWith("https://"))
			.map((s) => {
				// Formater les tags (max 3 + compteur)
				const tagsArray = formatTags(s.tags || "");

				return {
					name: truncate(s.name, 80),
					url: s.url_resolved,
					tags: tagsArray,
					country: s.country,
					countrycode: s.countrycode?.toLowerCase() || '',
					language: formatLanguages(s.language),
					bitrate: s.bitrate || 0,
					codec: s.codec || "Unknown",
					hls: s.hls || 0,
				};
			});

		return stations as RadioStation[];
	} catch (error) {
		console.error(`Failed to load stations for ${term}:`, error);
		return [];
	}
}

