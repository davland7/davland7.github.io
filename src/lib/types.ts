export enum SearchType {
	Tag = "tag",
	Country = "country",
}

export interface Country {
	name: string;
	iso_3166_1?: string;
	slug?: string;
}

export interface Tag {
	name: string;
	stationcount?: number;
	slug: string;
}

export interface Term {
	code?: string;
	name: string;
	type: SearchType.Country | SearchType.Tag;
	slug: string;
}

export interface StationsByTerm {
	term: string;
	type: SearchType.Country | SearchType.Tag;
	limit: number;
}

export interface RadioStation {
	name: string;
	url: string;
	tags: string[];
	country: string;
	countrycode: string;
	language: string[];
	bitrate: number;
	codec: string;
	hls: number;
}
