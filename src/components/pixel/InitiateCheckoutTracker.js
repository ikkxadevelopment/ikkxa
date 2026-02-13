'use client';

import { useEffect } from 'react';
import { trackInitiateCheckout } from '@/lib/metaPixel';

export default function InitiateCheckoutTracker({ cart }) {
    console.log("cartaaa", cart);

    useEffect(() => {
        // Fire InitiateCheckout on checkout page load
        trackInitiateCheckout({
            id: cart?.trx_id,
            content_ids: cart?.order_details.map(item => item?.id),
            contents: cart?.order_details.map(item => ({
                id: item?.id,
                quantity: item?.quantity,
                variation: item?.variation,
                product: item?.product?.product_name
            })),
            value: cart?.total_payable,
            currency: cart?.currency, // 'AED' or 'SAR'
            num_items: cart?.order_details?.reduce((sum, item) => sum + item.quantity, 0),
        });
    }, [cart]);

    return null;
}