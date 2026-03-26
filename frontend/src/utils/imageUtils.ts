/**
 * Resolves a product image URL to either the full static backend path or the original external URL.
 * Also provides a fallback image if no URL is provided.
 */
export const resolveImageUrl = (imageUrl: string | undefined | null, productName?: string): string => {
    // Array of high-quality hair accessory images for fallback/sanitization
    const accessoryImages = [
        '/hair-clip.png',
        '/scrunchie.png',
        '/hair-pin.png',
        '/hair-band.png'
    ];

    // Simple deterministic hash function to pick a consistent image based on product name
    const getHash = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const isSkincare = (path: string | null | undefined, name?: string) => {
        const lowerPath = path?.toLowerCase() || '';
        const lowerName = name?.toLowerCase() || '';
        return lowerPath.includes('skin') || lowerPath.includes('cream') || lowerPath.includes('apothecary') ||
               lowerName.includes('skin') || lowerName.includes('cream') || lowerName.includes('face');
    };

    // If no image, or it's a file:// path, or it's skincare data: use a curated accessory image
    if (!imageUrl || imageUrl.startsWith('file://') || isSkincare(imageUrl, productName)) {
        const index = productName ? (getHash(productName) % accessoryImages.length) : 0;
        return accessoryImages[index];
    }

    // If it's already an external URL, return it
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Otherwise, assume it's a local path and prepend the backend URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    
    return `${baseUrl}${cleanPath}`;
};
