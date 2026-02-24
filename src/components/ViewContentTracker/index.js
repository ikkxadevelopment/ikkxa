'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/metaPixel';

export default function ViewContentTracker({ product }) {
    useEffect(() => {
        // Fire ViewContent on page load
        trackViewContent({
            content_name: product?.product?.language_product?.name,
            content_ids: product?.product?.language_product?.name,
            content_type: 'product',
            value: product?.product?.language_product?.name,
            currency: product?.product?.language_product?.name, // 'AED' or 'SAR'
        });
    }, [product]);

    return null;
}