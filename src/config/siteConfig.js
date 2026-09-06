/**
 * Site Configuration — Source of Truth
 * 
 * This file controls which sections are visible on the public website.
 * Edit this file and redeploy to change what visitors see.
 * 
 * The admin Content Studio toggle still works for local dev preview,
 * but the deployed site always uses these committed values.
 */

export const SITE_CONFIG = {
  sections: {
    about: false,       // Disabled — update content before enabling
    blogs: true,        // Enabled
    portfolio: false,   // Disabled — update content before enabling
    contact: true       // Enabled
  }
};
