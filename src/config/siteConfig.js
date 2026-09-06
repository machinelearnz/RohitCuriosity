/**
 * Site Configuration — Source of Truth
 * 
 * This file controls global configuration and which sections are visible on the public website.
 * Edit this file and redeploy to change what visitors see.
 * 
 * Admin Passcode:
 * - Production: Set VITE_ADMIN_PASSCODE in Vercel Environment Variables.
 * - Fallback / Local: Defined below as adminPasscode.
 */

export const SITE_CONFIG = {
  // Master Admin Passcode (can be overridden via VITE_ADMIN_PASSCODE env variable)
  adminPasscode: import.meta.env.VITE_ADMIN_PASSCODE || 'rohit2026',
  
  sections: {
    about: false,       // Disabled — update content before enabling
    blogs: true,        // Enabled
    portfolio: false,   // Disabled — update content before enabling
    contact: true       // Enabled
  }
};
