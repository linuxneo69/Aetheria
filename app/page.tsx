
import { getLast24HourKIndex, getKIndex, getActiveAlerts } from "@/lib/api/noaa";
import { getRecentFlares, getRecentCMEs } from "@/lib/api/nasa";
import { getSolarWindRealtime } from "@/lib/api/solar-wind";

// Components
import { CriticalAlertBanner } from "@/components/CriticalAlertBanner";
import { Header } from "@/components/Header";
import { SolarGlobe } from "@/components/widgets/SolarGlobe";
import { SolarImageryGrid } from "@/components/widgets/SolarImageryGrid";
import { SolarWindDashboard } from "@/components/widgets/SolarWindDashboard";
import { DataVisualization } from "@/components/widgets/DataVisualization";
import { StormLevelWidget } from "@/components/widgets/StormLevelWidget";
import { SolarFlareWidget } from "@/components/widgets/SolarFlareWidget";
import { CMEWidget } from "@/components/widgets/CMEWidget";
import { EventSummary } from "@/components/widgets/EventSummary";
import { GeomagneticField } from "@/components/widgets/GeomagneticField";
import { RealTimeEventFeed } from "@/components/widgets/RealTimeEventFeed";
import { RadioFluxDashboard } from "@/components/widgets/RadioFluxDashboard";
import { HistoricalComparison } from "@/components/widgets/HistoricalComparison";
import { PersonalizedImpact } from "@/components/widgets/PersonalizedImpact";
import { AlertPanel } from "@/components/widgets/AlertPanel";
import { CMEJourneyAnimation } from "@/components/widgets/CMEJourneyAnimation";
import { MoonPhaseWidget } from "@/components/widgets/MoonPhaseWidget";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CompactImpact } from "@/components/widgets/CompactImpact";

export const revalidate = 60;

export default async function Home() {
  // Fetch all data in parallel
  const [kpData, kpHistory, flares, cmes, solarWind, alerts] = await Promise.all([
    getLast24HourKIndex(),
    getKIndex(),
    getRecentFlares(),
    getRecentCMEs(),
    getSolarWindRealtime(),
    getActiveAlerts()
  ]);

  const kpIndex = kpData ? kpData.kp_index : 0;

  // Check for X-class flares in last 24 hours
  const hasXClass = flares.some(f => {
    const timeDiff = new Date().getTime() - new Date(f.peakTime).getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return f.classType.startsWith('X') && hoursDiff < 24;
  });

  // Check for geomagnetic storm
  const hasGeoStorm = kpIndex >= 5;

  // Determine threat level
  const threatLevel: 'NOMINAL' | 'ELEVATED' | 'CRITICAL' =
    hasXClass || hasGeoStorm ? 'CRITICAL' :
      kpIndex >= 4 || flares.some(f => f.classType.startsWith('M')) ? 'ELEVATED' :
        'NOMINAL';

  // Prepare chart data with unique time labels
  const kpChartData = kpHistory.slice(-24).map(k => {
    const d = new Date(k.time_tag);
    return {
      time: d.toLocaleTimeString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }),
      value: k.kp_index
    };
  });

  return (
    <main className="min-h-screen pb-10 relative">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Critical Alert Banner (Fixed Top) */}
      <CriticalAlertBanner
        hasXClass={hasXClass}
        hasGeoStorm={hasGeoStorm}
      />

      {/* Header */}
      <Header
        threatLevel={threatLevel}
        alerts={alerts}
        isLive={true}
      >
        <CompactImpact kpIndex={kpIndex} />
      </Header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-8">

        {/* Top: Data Visualization (Full Width) */}
        <div className="mb-8">
          <DataVisualization
            solarWindSpeed={[]}
            xrayFlux={[]}
            kpHistory={kpChartData}
          />
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ============================================
              LEFT COLUMN: Solar Visualization & Activity
              ============================================ */}
          <div className="xl:col-span-2 space-y-6">
            {/* Hero: 3D Solar Globe */}
            <SolarGlobe />

            {/* Solar Imagery Grid */}
            <SolarImageryGrid />

            {/* Flare & CME Activity (Moved here to balance columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SolarFlareWidget flares={flares} />
              <CMEWidget cmes={cmes} />
            </div>
          </div>

          {/* ============================================
              RIGHT COLUMN: Data Panels
              ============================================ */}
          <div className="space-y-6">
            {/* Status Summary */}
            <EventSummary hasXClass={hasXClass} stormLevel={kpIndex} />

            {/* Alert Panel */}
            <AlertPanel alerts={alerts} />

            {/* Real-Time Event Feed */}
            <RealTimeEventFeed events={[]} />

            {/* Personalized Impact & Glossary */}
            <PersonalizedImpact kpIndex={kpIndex} />
          </div>
        </div>

        {/* Mid-Section: Data-Heavy Widgets (Resized for better visibility) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
          {/* Geomagnetic Perspective */}
          <div className="xl:col-span-8">
            <GeomagneticField kpIndex={kpIndex} />
          </div>
          {/* Storm Intensity */}
          <div className="xl:col-span-4">
            <StormLevelWidget
              kpIndex={kpIndex}
              timeTag={kpData?.time_tag || new Date().toISOString()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
          {/* Solar Wind Telemetry */}
          <div className="xl:col-span-12">
            <SolarWindDashboard data={solarWind} />
          </div>
        </div>

        {/* Secondary Insights (Balanced 3-Column Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <HistoricalComparison currentKp={kpIndex} />
          <RadioFluxDashboard />
          <MoonPhaseWidget />
        </div>

        {/* Full-width Highlight: CME Journey Animation (Premium Footer Placement) */}
        <div className="mt-12 mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
            <h2 className="text-xs font-black tracking-[0.4em] text-purple-400 uppercase">Interactive Educational Module</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
          </div>
          <CMEJourneyAnimation />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-sm font-medium text-white mb-2">AETHERIA</h4>
              <p className="text-xs text-gray-500">
                Real-time space weather monitoring powered by NASA, NOAA, and ESA data feeds.
                Designed for amateur radio operators, aurora chasers, and space enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Data Sources</h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• SDO/HMI & AIA (NASA)</li>
                <li>• GOES X-Ray & Particle (NOAA)</li>
                <li>• ACE/DSCOVR Solar Wind (NOAA)</li>
                <li>• DONKI CME/Flare Catalog (NASA)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">System Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">All Data Feeds Operational</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">3D Visualization Active</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">PWA Enabled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] text-gray-600">
              AETHERIA V2.0 // MISSION CONTROL EDITION // Data for informational purposes only
            </div>
            <div className="text-[10px] text-gray-600">
              © 2026 Space Weather Observatory
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
