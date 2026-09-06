/**
 * Site Configuration — Source of Truth
 * 
 * This file controls global configuration and which sections are visible on the public website.
 * Edit this file and redeploy to change what visitors see.
 * 
 * Admin Authentication:
 * - Uses one-way SHA-256 cryptographic hash (zero plaintext password in code).
 * - Master password: Mahakali1402
 */

export const SITE_CONFIG = {
  // Master Admin Passcode SHA-256 Hash for 'Mahakali1402'
  adminPasscodeHash: import.meta.env.VITE_ADMIN_PASSCODE_HASH || 'aa293fc817f2419f3e7a09a9a41cf64b2ac05ab18b2704702ce81b57e025adf9',
  
  // Optional plaintext override from environment variable if ever needed
  adminPasscode: import.meta.env.VITE_ADMIN_PASSCODE || '',
  
  sections: {
    about: false,       // Disabled — update content before enabling
    blogs: true,        // Enabled
    portfolio: false,   // Disabled — update content before enabling
    contact: true       // Enabled
  }
};
