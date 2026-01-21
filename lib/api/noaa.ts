
export interface KIndexData {
    time_tag: string;
    kp_index: number;
}

export interface SolarWindData {
    time_tag: string;
    density: number;
    speed: number;
    temperature: number;
}

export interface NOAAAlert {
    id: string;
    type: string;
    severity: 'minor' | 'moderate' | 'severe';
    message: string;
    issued: Date;
}

// NOAA SWPC Endpoints
const KP_INDEX_URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
const ALERTS_URL = "https://services.swpc.noaa.gov/products/alerts.json";

export async function getKIndex(): Promise<KIndexData[]> {
    try {
        const res = await fetch(KP_INDEX_URL, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error("Failed to fetch K-Index");

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("NOAA API returned non-JSON");
            return [];
        }

        const data = await res.json();
        const rows = data[0][0] === 'time_tag' ? data.slice(1) : data;

        return rows.map((row: any[]) => ({
            time_tag: row[0],
            kp_index: parseFloat(row[1])
        }));
    } catch (error) {
        console.error("Error fetching K-Index:", error);
        return [];
    }
}

export async function getLast24HourKIndex(): Promise<KIndexData | null> {
    const data = await getKIndex();
    return data.length > 0 ? data[data.length - 1] : null;
}

export async function getActiveAlerts(): Promise<NOAAAlert[]> {
    try {
        const res = await fetch(ALERTS_URL, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error("Failed to fetch alerts");

        const data = await res.json();
        // The alerts structure is an array of objects
        // We want to map them to our internal Alert interface
        return data.slice(0, 5).map((alert: any) => {
            const message = alert.message || "";
            let severity: 'minor' | 'moderate' | 'severe' = 'minor';

            if (message.includes('WARNING') || message.includes('SEVERE')) severity = 'severe';
            else if (message.includes('WATCH') || message.includes('MODERATE')) severity = 'moderate';

            return {
                id: alert.issue_datetime + alert.product_id,
                type: alert.product_id.replace('PRODUCT:', '').replace(/_/g, ' '),
                severity,
                message: message.split('\n')[0], // Just first line
                issued: new Date(alert.issue_datetime)
            };
        });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return [];
    }
}
