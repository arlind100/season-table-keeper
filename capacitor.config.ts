import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b6d711db0a0e4663af3780599f1235ad',
  appName: 'Restaurant Reservations',
  webDir: 'dist',
  server: {
    url: 'https://b6d711db-0a0e-4663-af37-80599f1235ad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#9333ea",
      showSpinner: false
    }
  }
};

export default config;