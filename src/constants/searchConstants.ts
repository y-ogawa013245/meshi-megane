export interface SearchFilters {
    genre: string;
    distance: number; // in meters
    onlyOpen: boolean;
    minRating: number | null;
    includeNoRating: boolean;
    limit: number;
}

export const INITIAL_FILTERS: SearchFilters = {
    genre: 'すべて',
    distance: 1000,
    onlyOpen: true,
    minRating: null,
    includeNoRating: true,
    limit: 30,
};

export const GENRES = [
    'すべて',
    '和食',
    '洋食',
    '中華',
    'カフェ',
    '居酒屋',
    'ラーメン',
    'イタリアン・フレンチ',
    '焼肉・ホルモン',
];

export const DISTANCES = [
    { label: '300m', value: 300 },
    { label: '500m', value: 500 },
    { label: '1km', value: 1000 },
    { label: '3km', value: 3000 },
];

export const LIMITS = [10, 30, 50, 100];
