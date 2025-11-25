export interface City {
    id: string;
    name: string;
    gridSize: number; // e.g., 10 for a 10x10 grid
}

export interface Place {
    id: string;
    cityId: string;
    x: number;
    y: number;
    name: string;
    type: 'restaurant' | 'park' | 'shop' | 'landmark' | 'hidden-gem' | 'other';
    vibeTags: string[];
    founder: string;
    story: string;
    reviews: Review[];
    challenges: Challenge[];
}

export interface Review {
    id: string;
    user: string;
    text: string;
    rating: number;
}

export interface Challenge {
    id: string;
    text: string;
    completedCount: number;
}

export const CITIES: City[] = [
    { id: 'cincy', name: 'Cincinnati', gridSize: 40 },
    { id: 'nyc', name: 'New York', gridSize: 40 },
    { id: 'tokyo', name: 'Tokyo', gridSize: 40 },
];

export const INITIAL_PLACES: Place[] = [
    {
        id: 'p1',
        cityId: 'cincy',
        x: 2,
        y: 3,
        name: "Skyline Chili (The Original)",
        type: 'restaurant',
        vibeTags: ['cheap eats', 'cult classic', 'chaotic'],
        founder: 'CincyNative_99',
        story: "The legendary spot where it all began. If you haven't had a 3-way here, did you even visit?",
        reviews: [
            { id: 'r1', user: 'Joe', text: 'Ambrosia of the gods.', rating: 5 },
            { id: 'r2', user: 'Tourist', text: 'Weird spaghetti.', rating: 3 },
        ],
        challenges: [
            { id: 'c1', text: 'Eat 3 Coneys in one sitting', completedCount: 420 },
        ],
    },
    {
        id: 'p2',
        cityId: 'cincy',
        x: 5,
        y: 5,
        name: "Washington Park",
        type: 'park',
        vibeTags: ['cozy', 'IG-perfect', 'chill'],
        founder: 'ParkRanger',
        story: "A beautiful green space in the heart of OTR. Perfect for dog watching.",
        reviews: [],
        challenges: [],
    },
    {
        id: 'p3',
        cityId: 'nyc',
        x: 6,
        y: 6,
        name: "Joe's Pizza",
        type: 'restaurant',
        vibeTags: ['classic', 'greasy', 'fast'],
        founder: 'PizzaRat',
        story: "The quintessential NY slice.",
        reviews: [],
        challenges: [],
    }
];
