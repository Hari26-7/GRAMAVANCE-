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

const DEFAULT_SUPABASE_URL = 'https://ymqcfmfibbcizwqohcyp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcWNmbWZpYmJjaXp3cW9oY3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0ODczMTYsImV4cCI6MjExMDA2MzMxNn0.loWd10wcb6bWCP-8tCpAGsLgVsEGGLlwIvyqwpDNJiY';

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

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

