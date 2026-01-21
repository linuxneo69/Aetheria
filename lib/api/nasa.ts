
const NASA_API_BASE = "https://api.nasa.gov/DONKI";
const API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

export interface SolarFlare {
    flrID: string;
    beginTime: string;
    peakTime: string;
    endTime: string;
    classType: string;
    sourceLocation: string;
    link: string;
}

export interface CME {
    activityID: string;
    startTime: string;
    note: string;
    cmeAnalyses: Array<{
        isExcavation: boolean;
        type: string;
        speed: number;
        halfAngle: number;
        latitude: number;
        longitude: number;
    }>;
}

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export async function getRecentFlares(startDate?: string, endDate?: string): Promise<SolarFlare[]> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const start = startDate || sevenDaysAgo.toISOString().split('T')[0];
    const end = endDate || today.toISOString().split('T')[0];

    try {
        const res = await fetchWithTimeout(
            `${NASA_API_BASE}/FLR?startDate=${start}&endDate=${end}&api_key=${API_KEY}`,
            { next: { revalidate: 3600 } } as RequestInit,
            15000
        );

        if (!res.ok) {
            console.warn(`NASA Flares API returned status ${res.status}`);
            return [];
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.warn("NASA API returned non-JSON:", text.substring(0, 100));
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        // Don't spam console on network failures - just return empty
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn("NASA Flares API request timed out");
        } else {
            console.warn("NASA Flares API unavailable:", (error as Error).message);
        }
        return [];
    }
}

export async function getRecentCMEs(startDate?: string, endDate?: string): Promise<CME[]> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const start = startDate || sevenDaysAgo.toISOString().split('T')[0];
    const end = endDate || today.toISOString().split('T')[0];

    try {
        const res = await fetchWithTimeout(
            `${NASA_API_BASE}/CME?startDate=${start}&endDate=${end}&api_key=${API_KEY}`,
            { next: { revalidate: 3600 } } as RequestInit,
            15000
        );

        if (!res.ok) {
            console.warn(`NASA CME API returned status ${res.status}`);
            return [];
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.warn("NASA API returned non-JSON:", text.substring(0, 100));
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        // Don't spam console on network failures - just return empty
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn("NASA CME API request timed out");
        } else {
            console.warn("NASA CME API unavailable:", (error as Error).message);
        }
        return [];
    }
}
