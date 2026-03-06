/**
 * Resolves any image URL to its correct absolute form.
 * Handles: localhost URLs (old DB data), relative /uploads paths, and valid absolute URLs.
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');

export const resolveImageUrl = (url) => {
    if (!url) return '';

    // Already a valid non-localhost absolute URL → use as-is
    if (url.startsWith('http') && !url.includes('localhost')) {
        return url;
    }

    // Old DB data: localhost:5000/uploads/... → replace host with live API
    if (url.includes('localhost')) {
        return url.replace(/https?:\/\/localhost:\d+/, API_BASE);
    }

    // Relative path like /uploads/... → prepend API base
    if (url.startsWith('/')) {
        return `${API_BASE}${url}`;
    }

    return url;
};
