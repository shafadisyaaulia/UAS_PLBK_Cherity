/** @type {import('next').NextConfig} */
const nextConfig = {
  // Paksa inject env langsung dari file konfigurasi
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://gchnsdwjlodlyrecywjg.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaG5zZHdqbG9kbHlyZWN5d2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTAzMDAsImV4cCI6MjA4MjE2NjMwMH0.rFf6xQxqco9PFRfrbrhRvVMqGLcl0o9ceou_BglVcto",
  },
};

module.exports = nextConfig;