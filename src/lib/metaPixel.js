// ViewContent - Product Detail Pages
export const trackViewContent = (params) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
            content_name: params.content_name,
            content_ids: params.content_ids,
            content_type: params.content_type || 'product',
            value: params.value,
            currency: params.currency,
        });
    }
};

// AddToCart - After successful cart addition
export const trackAddToCart = (params) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
            content_name: params.content_name,
            content_ids: params.content_ids,
            content_type: params.content_type || 'product',
            value: params.value,
            currency: params.currency,
        });
    }
};

// InitiateCheckout - Checkout page load
export const trackInitiateCheckout = (params) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
            content_ids: params.content_ids,
            contents: params.contents,
            value: params.value,
            currency: params.currency,
            num_items: params.num_items,
        });
    }
};

// Purchase - Order confirmation ONLY (Critical)
export const trackPurchase = (params) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
            value: params.value,
            currency: params.currency,
            content_ids: params.content_ids,
            content_type: params.content_type || 'product',
            contents: params.contents,
        });
    }
};