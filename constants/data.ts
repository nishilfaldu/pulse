import { AlertTriangle, Flame, Heart, Map as MapIcon, MapPin, Zap } from 'lucide-react-native';
import { COLORS } from './theme';

export const PEEPER_POSTS = [
    { id: 1, text: "Someone just dropped a whole pizza in TUC. The silence was loud.", location: "TUC", time: "2m", reactions: { watch: 12, dead: 45, love: 2 } },
    { id: 2, text: "Why is the 4th floor of the library louder than the cafeteria? 😤", location: "Langsam", time: "15m", reactions: { watch: 5, dead: 10, love: 0 } },
    { id: 3, text: "Saw a guy walking a cat on a leash near Calhoun. Icon behavior.", location: "Calhoun", time: "42m", reactions: { watch: 89, dead: 12, love: 156 } },
];

export const PROOFS = [
    { id: 1, user: 'Anon', color: '#FF7E47', likes: 24 },
    { id: 2, user: 'Anon', color: '#4A90E2', likes: 12 },
    { id: 3, user: 'Anon', color: '#7ED321', likes: 56 },
];

export const CLIPS = [
    { id: 1, title: "Piano Guy goes hard", views: "1.2k", color: "#FF7E47" },
    { id: 2, title: "Squirrel stole a bagel", views: "856", color: "#4A90E2" },
    { id: 3, title: "Engineering stairs fail", views: "2.4k", color: "#7ED321" },
    { id: 4, title: "Sunset @ Nippert", views: "5.1k", color: "#FF5E7D" },
];

export const GLOBAL_TRENDS = [
    { id: 1, title: "Silent Walking", source: "TikTok", icon: '🤫', action: "Start Group Walk", color: "#000000", desc: "No pods. No music. Just walking and staring." },
    { id: 2, title: "Stealing Salad Bowls", source: "X / Twitter", icon: '🥗', action: "Tag Salad Spot", color: "#1DA1F2", desc: "NYC girls are doing it. Are we?" },
    { id: 3, title: "I'm Just a Girl", source: "Reels", icon: '🎀', action: "Confess", color: "#E1306C", desc: "Excuse your chaos with this sound." },
    { id: 4, title: "75 Soft Challenge", source: "TikTok", icon: '💪', action: "Launch Challenge", color: "#000000", desc: "75 Hard but for people with finals." },
];

export const EVENTS = [
    { id: 1, title: "Study-Speed Dating", location: "Langsam 5F", time: "Tonight 8PM", price: "$1", spots: "4 left", color: COLORS.accent.pink, icon: Heart },
    { id: 2, title: "Pilates on Clifton", location: "Clifton Plaza", time: "Sat 10AM", price: "$5", spots: "Sold Out", color: COLORS.accent.green, icon: Zap },
    { id: 3, title: "Red Hat Scavenger", location: "City Wide", time: "Fri 2PM", price: "$1", spots: "Unlimited", color: COLORS.accent.orange, icon: MapIcon },
];

export const WAR_DATA = {
    topic: "Best 2AM Food",
    left: { name: "Taco Bell", color: "#9B51E0", score: 45 },
    right: { name: "Waffle House", color: "#F8E71C", score: 55 },
    posts: [
        { id: 1, user: "CrunchWrapGod", side: "left", text: "If you don't choose T-Bell you hate yourself.", damage: 120 },
        { id: 2, user: "HashBrownHero", side: "right", text: "WH has that grease that heals the soul.", damage: 340 },
        { id: 3, user: "LiveMas", side: "left", text: "Baja blast is the elixir of life.", damage: 89 }
    ]
};

export const PULSE_DATA = {
    id: 101,
    author: "User_77",
    text: "Is it just me or does the whole city smell like burnt popcorn today?",
    stats: {
        building: [
            { label: "TUC", val: 65, color: '#FF7E47' },
            { label: "DAAP", val: 20, color: '#4A90E2' },
            { label: "ERC", val: 15, color: '#7ED321' }
        ],
        mood: [
            { label: "Confused", val: 80, color: '#F8E71C' },
            { label: "Hungry", val: 10, color: '#FF5E7D' },
            { label: "Annoyed", val: 10, color: '#9B51E0' }
        ]
    }
};

export const DAILY_LOOP_CONTENT = [
    { type: 'secret', label: "City Secret", content: "The 4th floor vending machine gives free soda if you press 'C4' twice.", bg: '#1A1A1A', text: '#00FF00', icon: AlertTriangle },
    { type: 'near', label: "Near You", content: "3 people are studying for the same 'Intro to Psych' exam within 50ft of you right now.", bg: '#4A90E2', text: '#FFFFFF', icon: MapPin },
    { type: 'trend', label: "Micro Trend", content: "Wearing pajamas to class is trending up 40% today.", bg: '#F8E71C', text: '#1A1A1A', icon: Zap },
    { type: 'dare', label: "Daily Dare", content: "Ask the next person you see wearing a red hat for the time.", bg: '#FF4444', text: '#FFFFFF', icon: Flame }
];

export const CHAT_MESSAGES = [
    { id: 1, text: "Hey! I'm the red hat person lol", sender: 'them' },
    { id: 2, text: "No way, that was fast. I'm near the fountain.", sender: 'me' },
    { id: 3, text: "Cool, I have a blue backpack.", sender: 'them' },
];

export const BUILDINGS = [
    { name: 'TUC', x: 50, y: 50, w: 120, h: 80, color: '#FF7E47' }, // Orange
    { name: 'DAAP', x: 200, y: 60, w: 100, h: 100, color: '#4A90E2' }, // Blue
    { name: 'ERC', x: 80, y: 200, w: 90, h: 120, color: '#7ED321' }, // Green
    { name: 'Arts', x: 220, y: 220, w: 110, h: 70, color: '#FF5E7D' }, // Pink
];
