import axios from 'axios';

/**
 * Get the base URL for the API
 * - Uses NEXT_PUBLIC_API_URL in production (Vercel)
 * - Falls back to local dev server if running locally
 */
function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        // Always use env variable if defined
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Local development fallback
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:8000/api`;
    }

    // Server-side fallback
    return 'http://127.0.0.1:8000/api';
}

const API_BASE_URL = getBaseUrl();
console.log('API Base URL:', API_BASE_URL); // Optional: check in browser console

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Auth token interceptor (optional, works in browser)
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ------------------------
// Interfaces
// ------------------------

export interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    country: string;
    city: string;
    best_time_to_visit: string;
    tours_count?: number;
    tours?: Tour[];
}

export interface Tour {
    id: number;
    destination_id: number;
    title: string;
    slug: string;
    price: number;
    duration_days: number;
    start_date: string;
    max_travelers: number;
    description: any;
    itinerary: any;
    inclusions: any;
    exclusions: any;
    features: any;
    image_url: string;
    is_featured: boolean;
    reviews_count?: number;
    reviews_avg_rating?: string;
    destination?: Destination;
}

export interface Vehicle {
    id: number;
    destination_id: number;
    title: string;
    slug: string;
    price: number;
    duration_days: number;
    max_passengers: number;
    description: any;
    features: any;
    image_url: string;
    is_featured: boolean;
    reviews_count?: number;
    reviews_avg_rating?: string;
    destination?: Destination;
}

export interface Accommodation {
    id: number;
    destination_id: number;
    title: string;
    slug: string;
    price: number;
    total_nights: number;
    max_guests: number;
    description: any;
    features: any;
    image_url: string;
    is_featured: boolean;
    reviews_count?: number;
    reviews_avg_rating?: string;
    destination?: Destination;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    image_url: string;
    meta_title: string;
    meta_description: string;
    is_published: boolean;
    created_at: string;
    author?: {
        name: string;
    };
}

export interface SiteSetting {
    [key: string]: string;
}

export interface PageContent {
    id?: number;
    slug: string;
    title: string;
    hero_title?: string;
    hero_subtitle?: string;
    hero_image?: string;
    content?: any;
    is_in_navbar?: boolean;
    is_in_footer?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ContentBlock {
    type: 'heading' | 'paragraph' | 'image' | 'list';
    content: string;
    items?: string[];
}

// ------------------------
// API functions
// ------------------------

export const getFeaturedTours = async (): Promise<Tour[]> => {
    const response = await api.get('/tours?featured=1');
    return response.data;
};

export const getPopularDestinations = async (): Promise<Destination[]> => {
    const response = await api.get('/destinations');
    return response.data;
};

export const getTourDetails = async (id: string | number): Promise<Tour> => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
};

export const getDestinationDetails = async (id: string | number): Promise<Destination> => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
};

export const getSiteSettings = async (): Promise<SiteSetting> => {
    const response = await api.get('/settings');
    return response.data;
};

export const updateSiteSettings = async (settings: SiteSetting): Promise<void> => {
    await api.put('/admin/settings', { settings });
};

export const getPageContent = async (slug: string): Promise<PageContent> => {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
};

export const getPages = async (): Promise<PageContent[]> => {
    const response = await api.get('/admin/pages');
    return response.data;
};

export const updatePageContent = async (slug: string, data: Partial<PageContent>): Promise<PageContent> => {
    const response = await api.put(`/admin/pages/${slug}`, data);
    return response.data.page;
};

export const createPage = async (data: Partial<PageContent>): Promise<PageContent> => {
    const response = await api.post('/admin/pages', data);
    return response.data.page;
};

export const deletePage = async (slug: string): Promise<void> => {
    await api.delete(`/admin/pages/${slug}`);
};

// ------------------------
// Export default axios instance
// ------------------------
export default api;
