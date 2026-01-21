# Aetheria - Solar Observation Portal

**Version 2.0 (Mission Control)**
A premium, real-time solar observatory interface using Next.js, React Three Fiber, and NASA APIs.

## 🚀 Key Features
- **3D Solar Globe**: Interactive sun visualization wrapped with live **NASA SDO HMI** (Sunspot) imagery.
- **Mission Control Dashboard**: Dense "Bento-style" grid showing:
  - **Solar Wind**: Real-time Speed, Density, and Temperature.
  - **IMF (Bz)**: Southward magnetic field detection (Aurora trigger).
  - **Flares & CMEs**: Recent X-Ray events and Coronal Mass Ejections.
- **PWA Ready**: Installable on iOS/Android.

## 💻 Setup & Run
```bash
npm install
npm run dev
# or
npx next dev -p 3001
```
Open [http://localhost:3001](http://localhost:3001)

## 📡 Data Sources
- **NOAA SWPC**: Solar Wind (Plasma/Mag), Kp Index.
- **NASA DONKI**: Flares, CMEs.
- **NASA SDO**: Solar Imagery.
