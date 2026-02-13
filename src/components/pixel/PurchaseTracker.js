'use client';

import { useEffect, useRef } from 'react';
import { trackPurchase } from '@/lib/metaPixel';

export default function PurchaseTracker({ order }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Check if already tracked to prevent duplicate on refresh
        const trackedKey = `fb_pixel_purchase_${order.id}`;
        const alreadyTracked = sessionStorage.getItem(trackedKey);

        // Fire ONLY if:
        // 1. Not already tracked (ref check)
        // 2. Not in sessionStorage (refresh check)
        // 3. Payment is successful
        if (!hasTracked.current && !alreadyTracked && order.status === 'paid') {
            trackPurchase({
                value: order.total,
                currency: order.currency, // 'AED' or 'SAR'
                content_ids: order.items.map(item => item.id),
                content_type: 'product',
                contents: order.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
            });

            // Mark as tracked to prevent re-firing on refresh
            sessionStorage.setItem(trackedKey, 'true');
            hasTracked.current = true;

            console.log('🎉 Purchase event fired for order:', order.id);
        } else if (alreadyTracked) {
            console.log('⚠️ Purchase already tracked for order:', order.id);
        } else if (order.status !== 'paid') {
            console.log('⚠️ Order not paid, Purchase event not fired');
        }
    }, [order]);

    return null;
}