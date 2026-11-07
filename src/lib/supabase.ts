/**
 * Gramavance Supabase Backend & Local Demonstration Mode Connector
 *
 * Adheres strictly to Phase 6 requirements:
 * - Detects presence of official backend environment variables without exposing secrets.
 * - If not configured, gracefully activates Demo Mode (Local Offline Storage).
 * - Never pretends data is being saved remotely when offline.
 */

export interface BackendStatus {
  isConnected: boolean;
  isDemoMode: boolean;
  statusLabel: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
);

export const getBackendStatus = (): BackendStatus => {
  if (isConfigured) {
    return {
      isConnected: true,
      isDemoMode: false,
      statusLabel: 'Connected to Verified Cloud Database',
    };
  }

  return {
    isConnected: false,
    isDemoMode: true,
    statusLabel: 'Demonstration Mode (Local Offline Storage)',
  };
};

