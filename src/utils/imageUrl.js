/**
 * Resolves any image URL to its correct absolute form.
 * Handles: localhost URLs (old DB data), relative uploads paths, and valid absolute URLs.
 */

// LIVE PRODUCTION CONFIG
const API_BASE = 'https://api.mlsfashions.com';

/* 
LOCAL FALLBACK - COMMENTED OUT
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
*/

export const resolveImageUrl = (url) => {
    if (!url) return '';

    let sanitizedUrl = url;

    // 1. Force Production Domain if it's already an absolute localhost or .mlsfashions.com URL
    // This helps if the DB has absolute URLs from different environments
    if (sanitizedUrl.includes('localhost') || sanitizedUrl.includes('.mlsfashions.com')) {
        // Replace protocol + host with the live API base
        sanitizedUrl = sanitizedUrl.replace(/https?:\/\/[^\/]+/, API_BASE);
    }

    // 2. Normalize path: If it starts with /api/, strip it
    if (sanitizedUrl.startsWith('/api/')) {
        sanitizedUrl = sanitizedUrl.substring(4);
    }

    // 3. Handle Absolute URLs (now pointing to prod if they were matching the above)
    if (sanitizedUrl.startsWith('http')) {
        return sanitizedUrl;
    }

    // 4. Force a leading slash for relative paths
    if (!sanitizedUrl.startsWith('/')) {
        sanitizedUrl = '/' + sanitizedUrl;
    }

    // 5. Build final URL from API_BASE
    return `${API_BASE}${sanitizedUrl}`;
};
