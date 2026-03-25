/**
 * Resolves a product image URL to either the full static backend path or the original external URL.
 * Also provides a fallback image if no URL is provided.
 */
export const resolveImageUrl = (imageUrl: string | undefined | null): string => {
    // Fallback if no image is provided
    const fallbackImage = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop';

    if (!imageUrl) return fallbackImage;

    // If it's already an external URL, return it
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Otherwise, assume it's a local path and prepend the backend URL
    // We strip /api from VITE_API_BASE_URL if it exists (e.g. http://localhost:5000/api -> http://localhost:5000)
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    
    // Ensure the path starts with /
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    
    return `${baseUrl}${cleanPath}`;
};
