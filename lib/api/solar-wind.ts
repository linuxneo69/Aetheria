
export interface SolarWind {
    base_time: string;
    speed: number; // km/s
    density: number; // p/cm3
    temperature: number; // K
    bt: number; // nT (Total Field)
    bz: number; // nT (Southward component - crucial for aura)
}

// NOAA Real-time Solar Wind (RTSW)
// MAG: https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json
// PLASMA: https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json
const MAG_URL = "https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json";
const PLASMA_URL = "https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json";

export async function getSolarWindRealtime(): Promise<SolarWind | null> {
    try {
        const [magRes, plasmaRes] = await Promise.all([
            fetch(MAG_URL, { next: { revalidate: 60 } }),
            fetch(PLASMA_URL, { next: { revalidate: 60 } })
        ]);

        if (!magRes.ok || !plasmaRes.ok) return null;

        const magData = await magRes.json();
        const plasmaData = await plasmaRes.json();

        // Data format: Array of arrays. First row is header.
        // Last row is latest data.

        const latestMag = magData[magData.length - 1];
        const latestPlasma = plasmaData[plasmaData.length - 1];

        // Ensure we have data
        if (!latestMag || !latestPlasma) return null;

        return {
            base_time: latestMag[0],
            bt: parseFloat(latestMag[1]),
            bz: parseFloat(latestMag[3]), // bz is usually index 3 (bt, bx, by, bz, ...) check headers
            density: parseFloat(latestPlasma[1]),
            speed: parseFloat(latestPlasma[2]),
            temperature: parseFloat(latestPlasma[3])
        };
    } catch (e) {
        console.error("Error fetching Solar Wind", e);
        return null;
    }
}
